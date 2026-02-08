import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { getRecentActivity } from "../../controllers/v1/recent-activity.controller.js";

/**
 * Recent activity routes - All routes require JWT authentication
 */
export async function recentActivityRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", getRecentActivity);
}
