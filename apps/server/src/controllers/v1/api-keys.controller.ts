import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@flagout/database";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { z } from "zod";

const ZCreateApiKey = z.object({
    name: z.string().min(1, "Name is required"),
});

const ZRevokeApiKey = z.object({
    revoke: z.boolean(),
});

const API_KEY_LIMIT = 5;

type ApiKeyByIdRequest = FastifyRequest<{ Params: { id: string } }>;

/**
 * List all API keys for the authenticated user
 */
export async function listApiKeys(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;

    const apiKeys = await prisma.aPIKey.findMany({
        where: { clerk_user_id: userId },
        select: {
            id: true,
            name: true,
            prefix: true,
            revoked: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return reply.send({
        success: true,
        message: "API keys fetched",
        data: apiKeys,
    });
}

/**
 * Create a new API key
 */
export async function createApiKey(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const result = ZCreateApiKey.safeParse(request.body);

    if (!result.success) {
        return reply.status(400).send({
            success: false,
            message: "Invalid request body",
            data: [result.error.message],
        });
    }

    // Check limit
    const existingKeys = await prisma.aPIKey.count({
        where: { clerk_user_id: userId },
    });

    if (existingKeys >= API_KEY_LIMIT) {
        return reply.status(400).send({
            success: false,
            message: `API key limit of ${API_KEY_LIMIT} reached`,
            data: [],
        });
    }

    // Generate API key
    const rawKey = crypto.randomBytes(32).toString("hex");
    const prefix = rawKey.substring(0, 8);
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const createdKey = await prisma.aPIKey.create({
        data: {
            name: result.data.name,
            key: hashedKey,
            prefix,
            clerk_user_id: userId,
        },
    });

    return reply.status(201).send({
        success: true,
        message: "API key created",
        data: {
            id: createdKey.id,
            name: createdKey.name,
            prefix: createdKey.prefix,
            key: rawKey, // Return raw key only once
        },
    });
}

/**
 * Revoke or activate an API key
 */
export async function revokeApiKey(request: ApiKeyByIdRequest, reply: FastifyReply) {
    const { id } = request.params;
    const result = ZRevokeApiKey.safeParse(request.body);

    if (!result.success) {
        return reply.status(400).send({
            success: false,
            message: "Invalid request body",
            data: [result.error.message],
        });
    }

    const updatedKey = await prisma.aPIKey.update({
        where: { id },
        data: { revoked: result.data.revoke },
    });

    return reply.send({
        success: true,
        message: result.data.revoke ? "API key revoked" : "API key activated",
        data: { id: updatedKey.id },
    });
}

/**
 * Delete an API key
 */
export async function deleteApiKey(request: ApiKeyByIdRequest, reply: FastifyReply) {
    const { id } = request.params;

    const deletedKey = await prisma.aPIKey.delete({
        where: { id },
    });

    return reply.send({
        success: true,
        message: "API key deleted",
        data: { id: deletedKey.id },
    });
}
