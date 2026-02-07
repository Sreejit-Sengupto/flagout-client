import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { listApiKeys, createApiKey } from "../../controllers/v1/api-keys.controller.js";

/**
 * API keys routes - All routes require JWT authentication
 */
export async function apiKeysRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", listApiKeys);
    fastify.post("/", createApiKey);
}
