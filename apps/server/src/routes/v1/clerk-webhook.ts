import { FastifyInstance } from "fastify";
import { handleClerkWebhook } from "../../controllers/v1/webhook.controller.js";

/**
 * Clerk webhook route - Svix verified (no auth middleware)
 */
export async function clerkWebhookRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post("/", handleClerkWebhook);
}
