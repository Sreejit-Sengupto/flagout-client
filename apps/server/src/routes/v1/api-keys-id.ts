import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "@flagout/database";
import { authMiddleware } from "../../plugins/auth.js";
import { z } from "zod";

type ApiKeyIdParams = { Params: { id: string } };

const ZRevokeApiKey = z.object({
    revoke: z.boolean(),
});

/**
 * Single API key routes (PATCH, DELETE)
 */
export async function apiKeysIdRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    /**
     * PATCH /api/v1/api-keys/:id
     */
    fastify.patch<ApiKeyIdParams>("/", async (request, reply) => {
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
    });

    /**
     * DELETE /api/v1/api-keys/:id
     */
    fastify.delete<ApiKeyIdParams>("/", async (request, reply) => {
        const { id } = request.params;

        const deletedKey = await prisma.aPIKey.delete({
            where: { id },
        });

        return reply.send({
            success: true,
            message: "API key deleted",
            data: { id: deletedKey.id },
        });
    });
}
