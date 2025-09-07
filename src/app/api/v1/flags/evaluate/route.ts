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
        const userId = searchParams.get("user_id");
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
        // for now just check if it is enabled or not
        if (!flag.enabled) {
            return Response.json(
                {
                    success: true,
                    message: "Flag is disabled",
                    data: { flag, showFeature: false },
                },
                { status: 200 },
            );
        }

        if (
            !flag.targeting.includes("ALL") &&
            !flag.targeting.includes(userRole)
        ) {
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
        console.log(`Bucket for user id: ${userId} - ${bucket}`);

        return Response.json(
            {
                success: true,
                message:
                    bucket < flag.rollout_percentage
                        ? "User is not falling under the allowed percentage"
                        : "User falls in the allowed percentage",
                data: { flag, showFeature: bucket < flag.rollout_percentage },
            },
            { status: 200 },
        );
    } catch (error) {
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
