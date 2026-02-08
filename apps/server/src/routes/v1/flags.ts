import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { listFlags, createFlag } from "../../controllers/v1/flags.controller.js";

/**
 * Feature flags routes - All routes require JWT authentication
 */
export async function flagsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", listFlags);
    fastify.post("/", createFlag);
}
