import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { getEnvironment, setEnvironment } from "../../controllers/v1/environment.controller.js";

/**
 * Environment routes - All routes require JWT authentication
 */
export async function environmentRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", getEnvironment);
    fastify.post("/", setEnvironment);
}
