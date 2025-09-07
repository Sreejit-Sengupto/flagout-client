import { ApiError } from "@/lib/api-error";
import { secureAPI } from "@/lib/middleware/secure-api";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const data = await secureAPI(request);
        const userData = await data.json();

        if (!userData.data.userId) {
            throw new ApiError(
                401,
                "Invalid API Key",
                "Your API key is invalid kindly check again.",
            );
        }

        const addedOrigins = await prisma.flagEnviroment.findFirst({
            where: {
                clerk_user_id: {
                    equals: userData.data.userId as string,
                },
            },
        });

        if (!addedOrigins) {
            throw new ApiError(
                404,
                "No added origin found for this user",
                "Kindly add origins/environment URLs from the dashboard first",
            );
        }

        const allowedOrigins = [
            addedOrigins.dev,
            addedOrigins.prod,
            addedOrigins.stage,
        ].filter(Boolean);

        return Response.json({
            status: true,
            message: "Allowed origin fetched",
            data: { allowedOrigins },
        });
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
