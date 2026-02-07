import { TargetUser } from "@prisma/client";
import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import {
    ZFeatureFlags,
    ZGetAllFeatureFlags,
} from "@/lib/zod-schemas/feature-flags";
import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { cache } from "@/lib/redis";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = ZFeatureFlags.safeParse(body);
        if (!result.success) {
            throw new ApiError(
                400,
                "Invalid request body",
                result.error.message,
            );
        }
        const data = result.data;

        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to create flags",
            );
        }

        const slug = data.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        const flagExists = await prisma.featureFlags.findFirst({
            where: {
                AND: [
                    {
                        slug: {
                            equals: slug,
                        },
                    },
                    {
                        clerk_user_id: {
                            equals: user.id,
                        },
                    },
                    {
                        projectId: {
                            equals: data.projectId,
                        },
                    },
                ],
            },
        });
        if (flagExists) {
            throw new ApiError(
                400,
                "A flag with this name already exists in this project",
                "Please create a flag with different name",
            );
        }

        const insertedFlag = await prisma.featureFlags.create({
            data: {
                clerk_user_id: user.id,
                description: data.description,
                name: data.name,
                slug,
                enabled: data.enabled,
                environment: data.environment,
                rollout_percentage: data.rolloutPercentage,
                targeting: data.targeting as TargetUser[],
                projectId: data.projectId,
            },
        });

        await prisma.recentActivity.create({
            data: {
                activity: "Feature Flag created",
                flag_id: insertedFlag.id,
                clerk_user_id: user.id,
            },
        });

        await cache.invalidate(`flags:${data.projectId}:*`);

        return Response.json(
            {
                success: true,
                message: "Feature flag created",
                data: insertedFlag,
            },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);

        if (error instanceof ApiError) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                    data: [error.details],
                },
                { status: error.status },
            );
        }

        // fallback for unhandled errors
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
                data: [],
            },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Number(searchParams.get("page"));
        const limit = Number(searchParams.get("limit"));
        const projectId = searchParams.get("project_id");

        const result = ZGetAllFeatureFlags.safeParse({
            page,
            limit,
            projectId,
        });
        if (!result.success) {
            throw new ApiError(
                400,
                "Invalid request body",
                result.error.message,
            );
        }
        const data = result.data;

        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        const skip = (data.page - 1) * data.limit;
        const featureFlags = prisma.featureFlags.findMany({
            skip,
            take: data.limit,
            where: {
                // clerk_user_id: {
                //     equals: user.id,
                // },
                AND: [
                    {
                        clerk_user_id: {
                            equals: user.id,
                        },
                        projectId: data.projectId,
                    },
                ],
            },
            include: {
                _count: {
                    select: {
                        evaluationLogs: true,
                    },
                },
            },
        });
        const totalFlags = prisma.featureFlags.count({
            where: {
                clerk_user_id: {
                    equals: user.id,
                },
            },
        });

        const cacheKey = `flags:${data.projectId}:${data.page}:${data.limit}`;
        const cachedData = await cache.get<{
            flags: unknown[];
            meta: { page: number; totalItems: number; totalPages: number };
        }>(cacheKey);

        if (cachedData) {
            return Response.json(
                {
                    success: true,
                    message: "Fetched feature flags (cached)",
                    data: cachedData.flags,
                    meta: cachedData.meta,
                },
                { status: 200, headers: { "X-Cache": "HIT" } },
            );
        }

        const [flags, count] = await Promise.all([featureFlags, totalFlags]);

        const responseData = {
            flags,
            meta: {
                page: data.page,
                totalItems: count,
                totalPages: Math.ceil(count / data.limit),
            },
        };

        await cache.set(cacheKey, responseData, 300); // 5 minutes cache

        return Response.json(
            {
                success: true,
                message: "Fetched feature flags",
                data: responseData.flags,
                meta: responseData.meta,
            },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                    data: [error.details],
                },
                { status: error.status },
            );
        }

        // fallback for unhandled errors
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
                data: [],
            },
            { status: 500 },
        );
    }
}
