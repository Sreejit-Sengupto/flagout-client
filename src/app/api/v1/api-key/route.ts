import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
import z from "zod";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = z.object({ name: z.string() }).safeParse(body);
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

        const apiKey = `f0-${randomBytes(16).toString("hex")}`;
        const hashedKey = await bcrypt.hash(apiKey, 10);

        const keysCount = await prisma.aPIKey.count({
            where: { clerk_user_id: { equals: user.id } },
        });
        if (keysCount > 5) {
            throw new ApiError(
                403,
                "Limit reached",
                "You cannot create more than 5 API keys",
            );
        }

        await prisma.aPIKey.create({
            data: {
                clerk_user_id: user.id,
                name: data.name,
                key: hashedKey,
            },
        });

        return Response.json(
            {
                success: true,
                message: "API Key generated. It will not be displayed again!",
                data: { name: data.name, key: apiKey },
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

        const apiKeys = await prisma.aPIKey.findMany({
            select: {
                id: true,
                name: true,
                revoked: true,
                lastUsed: true,
                createdAt: true,
            },
            where: {
                clerk_user_id: {
                    equals: user.id,
                },
            },
        });

        return Response.json(
            {
                success: true,
                message: "Fetched keys successfully!",
                data: apiKeys,
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
