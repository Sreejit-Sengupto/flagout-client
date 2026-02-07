import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { revokeApiKey, deleteApiKey } from "../../controllers/v1/api-keys.controller.js";

/**
 * Single API key routes (PATCH, DELETE) - All routes require JWT authentication
 */
export async function apiKeysIdRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.patch("/", revokeApiKey);
    fastify.delete("/", deleteApiKey);
}
