import { FastifyInstance } from "fastify";
import { apiKeyMiddleware } from "../../plugins/api-key.js";
import { evaluateFlag } from "../../controllers/v1/sdk.controller.js";

/**
 * Flag evaluate route (SDK endpoint) - Requires API key authentication
 */
export async function evaluateRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", apiKeyMiddleware);

    fastify.get("/", evaluateFlag);
}
