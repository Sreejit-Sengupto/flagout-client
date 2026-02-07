import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "@flagout/database";
import { authMiddleware } from "../../plugins/auth.js";
import { z } from "zod";

const ZUpdateFeatureFlags = z
    .object({
        name: z.string().max(25).optional(),
        description: z.string().max(500).optional(),
        enabled: z.boolean().optional(),
        environment: z.enum(["DEVELOPMENT", "PRODUCTION", "STAGING"]).optional(),
        rolloutPercentage: z.number().min(0).max(100).optional(),
        targeting: z.enum(["ALL", "INTERNAL", "BETA", "PREMIUM"]).array().optional(),
    })
    .partial();

type FlagIdParams = { Params: { id: string } };

/**
 * Single flag routes (PATCH, DELETE)
 */
export async function flagsIdRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    /**
     * PATCH /api/v1/flags/:id
     */
    fastify.patch<FlagIdParams>("/", async (request, reply) => {
        const userId = request.userId;
        const { id } = request.params;
        const result = ZUpdateFeatureFlags.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                success: false,
                message: "Invalid request body",
                data: [result.error.message],
            });
        }

        const data = result.data;
        const dataToUpdate: Record<string, unknown> = {};

        if (data.name !== undefined) dataToUpdate.name = data.name;
        if (data.description !== undefined) dataToUpdate.description = data.description;
        if (data.enabled !== undefined) dataToUpdate.enabled = data.enabled;
        if (data.environment !== undefined) dataToUpdate.environment = data.environment;
        if (data.rolloutPercentage !== undefined)
            dataToUpdate.rollout_percentage = data.rolloutPercentage;
        if (data.targeting !== undefined) dataToUpdate.targeting = data.targeting;

        const updatedFlag = await prisma.featureFlags.update({
            data: dataToUpdate,
            where: { id },
        });

        await prisma.recentActivity.create({
            data: {
                activity: data.enabled === false ? "Feature Flag disabled" : "Feature Flag updated",
                clerk_user_id: userId,
                flag_id: updatedFlag.id,
            },
        });

        return reply.send({
            success: true,
            message: "Feature flag updated",
            data: updatedFlag,
        });
    });

    /**
     * DELETE /api/v1/flags/:id
     */
    fastify.delete<FlagIdParams>("/", async (request, reply) => {
        const { id } = request.params;

        const deletedFlag = await prisma.featureFlags.delete({
            where: { id },
        });

        return reply.send({
            success: true,
            message: "Feature flag deleted",
            data: {
                id: deletedFlag.id,
                slug: deletedFlag.slug,
                name: deletedFlag.name,
            },
        });
    });
}
