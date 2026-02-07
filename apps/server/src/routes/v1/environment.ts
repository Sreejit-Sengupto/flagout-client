import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "@flagout/database";
import { authMiddleware } from "../../plugins/auth.js";
import { z } from "zod";

const ZEnvUrls = z.object({
    prod: z.string().url("Invalid production URL").optional(),
    dev: z.string().url("Invalid development URL").optional(),
    stage: z.string().url("Invalid staging URL").optional(),
});

/**
 * Environment routes
 */
export async function environmentRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    /**
     * GET /api/v1/environment
     */
    fastify.get("/", async (request, reply) => {
        const userId = request.userId;

        const envSettings = await prisma.flagEnviroment.findFirst({
            where: { clerk_user_id: userId },
        });

        return reply.send({
            success: true,
            message: "Environment settings fetched",
            data: envSettings,
        });
    });

    /**
     * POST /api/v1/environment
     */
    fastify.post("/", async (request, reply) => {
        const userId = request.userId;
        const result = ZEnvUrls.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                success: false,
                message: "Invalid request body",
                data: [result.error.message],
            });
        }

        const data = result.data;

        // Check if settings exist
        const existing = await prisma.flagEnviroment.findFirst({
            where: { clerk_user_id: userId },
        });

        if (existing) {
            const updated = await prisma.flagEnviroment.update({
                where: { id: existing.id },
                data: {
                    dev: data.dev || existing.dev,
                    prod: data.prod || existing.prod,
                    stage: data.stage || existing.stage,
                },
            });
            return reply.send({
                success: true,
                message: "Environment settings updated",
                data: updated,
            });
        } else {
            const created = await prisma.flagEnviroment.create({
                data: {
                    clerk_user_id: userId,
                    dev: data.dev,
                    prod: data.prod,
                    stage: data.stage,
                },
            });
            return reply.status(201).send({
                success: true,
                message: "Environment settings created",
                data: created,
            });
        }
    });
}
