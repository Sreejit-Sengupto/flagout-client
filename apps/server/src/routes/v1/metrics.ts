import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { getDashboardMetrics } from "../../controllers/v1/metrics.controller.js";

/**
 * Dashboard metrics routes - All routes require JWT authentication
 */
export async function metricsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", getDashboardMetrics);
}
