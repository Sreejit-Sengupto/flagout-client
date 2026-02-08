import { FastifyInstance } from "fastify";
import { apiKeyMiddleware } from "../../plugins/api-key.js";
import { getAllowedOrigins } from "../../controllers/v1/sdk.controller.js";

/**
 * Allowed origins route (SDK endpoint) - Requires API key authentication
 */
export async function allowedOriginsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", apiKeyMiddleware);

    fastify.get("/", getAllowedOrigins);
}
