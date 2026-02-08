import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../plugins/auth.js";
import { getFlagMetrics } from "../../controllers/v1/metrics.controller.js";

/**
 * Per-flag metrics routes - All routes require JWT authentication
 */
export async function metricsIdRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/", getFlagMetrics);
}
