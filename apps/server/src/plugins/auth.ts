import { FastifyRequest, FastifyReply } from "fastify";
import { verifyClerkToken, extractBearerToken } from "../lib/jwt.js";

// Extend FastifyRequest to include userId
declare module "fastify" {
    interface FastifyRequest {
        userId: string;
    }
}

/**
 * Fastify preHandler middleware for JWT-based authentication.
 * Verifies Clerk session tokens from the Authorization header.
 *
 * Use this for dashboard routes that require user authentication.
 */
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
): Promise<void> {
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: ["Missing or invalid Authorization header"],
        });
    }

    try {
        const payload = verifyClerkToken(token);
        // Attach user ID to request for use in route handlers
        request.userId = payload.sub;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Invalid token";
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: [message],
        });
    }
}
