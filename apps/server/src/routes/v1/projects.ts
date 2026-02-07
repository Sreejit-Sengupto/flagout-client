import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { listProjects, createProject } from "../../controllers/v1/projects.controller.js";

/**
 * Projects routes - All routes require JWT authentication
 */
export async function projectsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", listProjects);
    fastify.post("/", createProject);
}
