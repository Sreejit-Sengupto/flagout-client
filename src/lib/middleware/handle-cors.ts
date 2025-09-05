import { NextRequest } from "next/server";
import prisma from "../prisma";
import { ApiError } from "../api-error";

export const CORSHandler = async (request: NextRequest, userId: string) => {
    try {
        const origin = request.headers.get("origin");
        console.log("Origin: ", origin);

        if (!origin) {
            return { origin, allowed: true };
        }

        const userAddedEnvURLs = await prisma.flagEnviroment.findFirst({
            where: {
                clerk_user_id: {
                    equals: userId,
                },
            },
        });

        if (!userAddedEnvURLs) {
            throw new ApiError(
                404,
                "Data mismatch",
                "We are unable to find the user. Kindly check your API keys.",
            );
        }

        const allowedOrigins = [
            userAddedEnvURLs.prod,
            userAddedEnvURLs.dev,
            userAddedEnvURLs.stage,
        ].filter(Boolean);
        if (origin && allowedOrigins.includes(origin)) {
            // response.headers.set("Access-Control-Allow-Origin", origin);
            // response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            // response.headers.set('Access-Control-Allow-Headers', 'Authorization, X-Client-ID, Content-Type');
            // response.headers.set('Access-Control-Allow-Credentials', 'true');
            return { origin, allowed: true };
        }

        return { origin, allowed: false };
    } catch (error) {
        throw error;
    }
};

export const setCORSHeaders = (origin?: string | null) => {
    const headers = new Headers();
    if (origin) {
        headers.set("Access-Control-Allow-Origin", origin);
    }
    return headers;
};
