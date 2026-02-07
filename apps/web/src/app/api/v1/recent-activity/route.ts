import { ApiError } from "@/lib/api-error";
import prisma from "@flagout/database";
import { ZGetRecentActivities } from "@/lib/zod-schemas/recent-activity";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { cache } from "@/lib/redis";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));

    console.log("Page: ", page);
    console.log("Limit: ", limit);

    const result = ZGetRecentActivities.safeParse({ page, limit });
    if (!result.success) {
        throw new ApiError(400, "Invalid request body", result.error.message);
    }
    const data = result.data;

    try {
        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        const skip = (data.page - 1) * data.limit;
        const activities = prisma.recentActivity.findMany({
            skip,
            take: data.limit,
            include: {
                flag: {
                    select: {
                        name: true,
                        id: true,
                        slug: true,
                    },
                },
            },
            where: {
                clerk_user_id: {
                    equals: user.id,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalActivities = prisma.recentActivity.count({
            where: {
                clerk_user_id: {
                    equals: user.id,
                },
            },
        });

        const cacheKey = `activities:${user.id}:${data.page}:${data.limit}`;
        const cachedActivities = await cache.get<{
            recentActivities: unknown[];
            meta: { page: number; totalPages: number; totalItems: number };
        }>(cacheKey);

        if (cachedActivities) {
            return Response.json(
                {
                    success: true,
                    message: "Fetched recent activities (cached)",
                    data: cachedActivities.recentActivities,
                    meta: cachedActivities.meta,
                },
                { status: 200, headers: { "X-Cache": "HIT" } },
            );
        }

        const [recentActivities, count] = await Promise.all([
            activities,
            totalActivities,
        ]);

        const responseData = {
            recentActivities,
            meta: {
                page: data.page,
                totalPages: Math.ceil(count / data.limit),
                totalItems: count,
            },
        };

        await cache.set(cacheKey, responseData, 60); // 1 minute cache

        return Response.json(
            {
                success: true,
                message: "Fetched recent activities",
                data: responseData.recentActivities,
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
