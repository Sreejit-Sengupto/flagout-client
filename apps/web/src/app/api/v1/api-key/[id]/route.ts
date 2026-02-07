import { ApiError } from "@/lib/api-error";
import prisma from "@flagout/database";
import { ZRevokeAPIKey } from "@/lib/zod-schemas/api-key";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = ZRevokeAPIKey.safeParse(body);
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

        const updatedKey = await prisma.aPIKey.update({
            data: {
                revoked: data.revoke,
            },
            where: {
                id,
            },
        });

        return Response.json(
            {
                success: true,
                message: "API key revoked",
                data: updatedKey,
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        await prisma.aPIKey.delete({
            where: {
                id,
            },
        });

        return Response.json(
            {
                success: true,
                message: "API key revoked",
                data: [],
            },
            { status: 200 },
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
