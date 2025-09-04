import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import { ZAddFlagEnv } from "@/lib/zod-schemas/flag-env";
import { currentUser } from "@clerk/nextjs/server";
import { FlagEnviroment } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = ZAddFlagEnv.safeParse(body);
        if (!result.success) {
            throw new ApiError(
                400,
                "Invalid request body",
                result.error.message,
            );
        }
        const data = result.data;

        if (!data.dev && !data.prod && !data.stage) {
            throw new ApiError(
                400,
                "Either prod or dev or stage URL is required",
            );
        }

        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        const environmentExists = await prisma.flagEnviroment.findFirst({
            where: {
                clerk_user_id: {
                    equals: user.id,
                },
            },
        });

        let environment: FlagEnviroment | null = null;
        if (environmentExists) {
            environment = await prisma.flagEnviroment.update({
                data: {
                    dev: data.dev,
                    prod: data.prod,
                    stage: data.stage,
                },
                where: {
                    clerk_user_id: user.id,
                },
            });
        } else {
            environment = await prisma.flagEnviroment.create({
                data: {
                    clerk_user_id: user.id,
                    dev: data.dev,
                    prod: data.prod,
                    stage: data.stage,
                },
            });
        }

        return Response.json(
            {
                success: true,
                message: "Environment URLs updated",
                data: environment,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);

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

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        const environment = await prisma.flagEnviroment.findFirst({
            where: {
                clerk_user_id: user.id,
            },
        });

        return Response.json(
            {
                success: true,
                message: "Environment URLs updated",
                data: environment,
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
