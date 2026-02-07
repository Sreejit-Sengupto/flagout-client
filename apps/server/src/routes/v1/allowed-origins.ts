import { FastifyInstance } from "fastify";
import prisma from "@flagout/database";
import { apiKeyMiddleware } from "../../plugins/api-key.js";

/**
 * Allowed origins route (SDK endpoint)
 */
export async function allowedOriginsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", apiKeyMiddleware);

    /**
     * GET /api/v1/allowed-origins
     */
    fastify.get("/", async (request, reply) => {
        const userId = request.apiKeyUserId!;

        const envSettings = await prisma.flagEnviroment.findFirst({
            where: { clerk_user_id: userId },
        });

        if (!envSettings) {
            return reply.send({
                success: true,
                message: "No environment settings found",
                data: [],
            });
        }

        const origins: string[] = [];
        if (envSettings.dev) origins.push(envSettings.dev);
        if (envSettings.prod) origins.push(envSettings.prod);
        if (envSettings.stage) origins.push(envSettings.stage);

        return reply.send({
            success: true,
            message: "Allowed origins fetched",
            data: origins,
        });
    });
}
