import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { updateFlag, deleteFlag } from "../../controllers/v1/flags.controller.js";

/**
 * Single flag routes (PATCH, DELETE) - All routes require JWT authentication
 */
export async function flagsIdRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.patch("/", updateFlag);
    fastify.delete("/", deleteFlag);
}
