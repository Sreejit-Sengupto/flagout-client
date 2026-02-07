import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import { ZUpdateFeatureFlags } from "@/lib/zod-schemas/feature-flags";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = ZUpdateFeatureFlags.safeParse(body);
        if (!result.success) {
            throw new ApiError(
                400,
                "Invalid request body",
                result.error.message,
            );
        }
        const data = result.data;

        const dataToUpdate: {
            name?: string;
            description?: string;
            enabled?: boolean;
            environment?: "DEVELOPMENT" | "PRODUCTION" | "STAGING";
            rollout_percentage?: number;
            targeting?: ("ALL" | "INTERNAL" | "BETA" | "PREMIUM")[];
        } = {};
        if (data.name !== undefined) dataToUpdate.name = data.name;
        if (data.description !== undefined)
            dataToUpdate.description = data.description;
        if (data.enabled !== undefined) dataToUpdate.enabled = data.enabled;
        if (data.environment !== undefined)
            dataToUpdate.environment = data.environment;
        if (data.rolloutPercentage !== undefined)
            dataToUpdate["rollout_percentage"] = data.rolloutPercentage;
        if (data.targeting !== undefined)
            dataToUpdate.targeting = data.targeting;

        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to create flags",
            );
        }

        const updatedFlag = await prisma.featureFlags.update({
            data: dataToUpdate,
            where: {
                id,
            },
        });

        await prisma.recentActivity.create({
            data: {
                activity: "Feature Flag disabled",
                clerk_user_id: user.id,
                flag_id: updatedFlag.id,
            },
        });

        return Response.json(
            {
                success: true,
                message: "Fetched feature flags",
                data: updatedFlag,
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
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to create flags",
            );
        }

        const deletedFlag = await prisma.featureFlags.delete({
            where: {
                id,
            },
        });
        if (!deletedFlag) {
            throw new ApiError(404, "No flag was found with the provided id");
        }

        return Response.json(
            {
                success: true,
                message: "Fetched feature flags",
                data: {
                    id: deletedFlag.id,
                    slug: deletedFlag.slug,
                    name: deletedFlag.name,
                },
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
