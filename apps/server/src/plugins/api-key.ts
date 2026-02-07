import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@flagout/database";
import bcrypt from "bcrypt";

// Extend FastifyRequest to include userId from API key
declare module "fastify" {
    interface FastifyRequest {
        apiKeyUserId?: string;
    }
}

/**
 * Fastify preHandler middleware for API key authentication.
 * Validates API keys from the X-flagout-key header.
 *
 * Use this for SDK-facing endpoints (evaluate, allowed-origins).
 */
export async function apiKeyMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
): Promise<void> {
    const apiKey = request.headers["x-flagout-key"] as string | undefined;

    if (!apiKey) {
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: ["Missing X-flagout-key header"],
        });
    }

    // Validate key format
    if (typeof apiKey !== "string" || apiKey.length < 10) {
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: ["Invalid API key format"],
        });
    }

    const prefix = apiKey.substring(0, 8);

    // Find key by prefix
    const record = await prisma.aPIKey.findFirst({
        where: { prefix: { equals: prefix } },
    });

    if (!record) {
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: ["Invalid API key"],
        });
    }

    if (record.revoked) {
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: ["API key has been revoked"],
        });
    }

    // Compare full key
    const isMatch = await bcrypt.compare(apiKey, record.key);
    if (!isMatch) {
        return reply.status(401).send({
            success: false,
            message: "Unauthorized",
            data: ["Invalid API key"],
        });
    }

    // Attach user ID to request
    request.apiKeyUserId = record.clerk_user_id;
}
