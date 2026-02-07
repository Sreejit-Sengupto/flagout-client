import { ApiError } from "@/lib/api-error";
import { getUserBucket } from "@/lib/api-utils/user-bucket";
import { secureAPI } from "@/lib/middleware/secure-api";
import prisma from "@/lib/prisma";
import { TargetUser } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const keySlug = searchParams.get("slug");
        const userRole = searchParams.get("user_role") as TargetUser;
        const userId =
            searchParams.get("user_id") ??
            request.headers.get("x-forwarded-for")?.split(",")[0] ??
            "unknown";
        if (!keySlug || !userId) {
            throw new ApiError(400, "slug or userId is required");
        }
        const data = await secureAPI(request);
        const userData = await data.json();

        if (!userData.data.userId) {
            throw new ApiError(
                401,
                "Invalid API Key",
                "Your API key is invalid kindly check again.",
            );
        }

        const flag = await prisma.featureFlags.findFirst({
            where: {
                AND: [
                    {
                        slug: {
                            equals: keySlug,
                        },
                    },
                    {
                        clerk_user_id: {
                            equals: userData.data.userId as string,
                        },
                    },
                ],
            },
        });
        if (!flag) {
            throw new ApiError(
                404,
                "Flag not found",
                "No flag found for the provided slug and key",
            );
        }

        const envUrls = await prisma.flagEnviroment.findFirst({
            where: {
                clerk_user_id: {
                    equals: userData.data.userId as string,
                },
            },
        });
        if (!envUrls) {
            throw new ApiError(
                404,
                "Data mismatch. Failed to get allowed URLs",
                "We are unable to find the user. Kindly check your API keys.",
            );
        }

        // calculate parameters to return true or false for the flag
        // if the flag is not enabled simply DO NOT perform any check and return true
        // so that all users can see the feature
        if (!flag.enabled) {
            await prisma.flagEvaluationLogs.create({
                data: {
                    clerk_user_id: flag.clerk_user_id,
                    flag_id: flag.id,
                    enabled: true,
                    visited_user_id: userId,
                },
            });
            return Response.json(
                {
                    success: true,
                    message: "Flag is disabled. Showing feature to all.",
                    data: { flag, showFeature: true },
                },
                { status: 200 },
            );
        }

        if (
            !flag.targeting.includes("ALL") &&
            !flag.targeting.includes(userRole)
        ) {
            await prisma.flagEvaluationLogs.create({
                data: {
                    clerk_user_id: flag.clerk_user_id,
                    flag_id: flag.id,
                    enabled: false,
                    visited_user_id: userId,
                },
            });
            return Response.json(
                {
                    success: true,
                    message: `Flag is disabled for ${userRole} users`,
                    data: { flag, showFeature: false },
                },
                { status: 200 },
            );
        }

        const origin = request.headers.get("Origin");
        if (request.headers.get("Origin")) {
            if (flag.environment === "PRODUCTION" && envUrls.prod !== origin) {
                await prisma.flagEvaluationLogs.create({
                    data: {
                        clerk_user_id: flag.clerk_user_id,
                        flag_id: flag.id,
                        enabled: false,
                        visited_user_id: userId,
                    },
                });
                return Response.json(
                    {
                        success: true,
                        message: "This environment is not allowed",
                        data: { flag, showFeature: false },
                    },
                    { status: 200 },
                );
            } else if (
                flag.environment !== "DEVELOPMENT" &&
                envUrls.dev !== origin
            ) {
                await prisma.flagEvaluationLogs.create({
                    data: {
                        clerk_user_id: flag.clerk_user_id,
                        flag_id: flag.id,
                        enabled: false,
                        visited_user_id: userId,
                    },
                });
                return Response.json(
                    {
                        success: true,
                        message: "This environment is not allowed",
                        data: { flag, showFeature: false },
                    },
                    { status: 200 },
                );
            } else if (
                flag.environment === "STAGING" &&
                envUrls.stage !== origin
            ) {
                await prisma.flagEvaluationLogs.create({
                    data: {
                        clerk_user_id: flag.clerk_user_id,
                        flag_id: flag.id,
                        enabled: false,
                        visited_user_id: userId,
                    },
                });
                return Response.json(
                    {
                        success: true,
                        message: "This environment is not allowed",
                        data: { flag, showFeature: false },
                    },
                    { status: 200 },
                );
            }
        }

        const bucket = getUserBucket(userId, flag.slug);

        await prisma.flagEvaluationLogs.create({
            data: {
                clerk_user_id: flag.clerk_user_id,
                flag_id: flag.id,
                enabled: bucket < flag.rollout_percentage,
                visited_user_id: userId,
            },
        });

        return Response.json(
            {
                success: true,
                message:
                    bucket < flag.rollout_percentage
                        ? "User falls in the allowed percentage"
                        : "User is not falling under the allowed percentage",
                data: { flag, showFeature: bucket < flag.rollout_percentage },
            },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);

        if (error instanceof ApiError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                    data: [error.details],
                },
                { status: error.status },
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal Server Error", data: [] },
            { status: 500 },
        );
    }
}
