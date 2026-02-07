import { FastifyRequest, FastifyReply } from "fastify";
import prisma, { TargetUser } from "@flagout/database";
import { z } from "zod";

// Validation schemas
const ZFeatureFlags = z.object({
    name: z.string().max(25, "Should be less than 25 characters"),
    description: z.string().max(500, "Should be less than 500 characters"),
    enabled: z.boolean(),
    rolloutPercentage: z
        .number()
        .min(0, "Must be greater than 0")
        .max(100, "Must be less than equal to 100"),
    environment: z.enum(["DEVELOPMENT", "PRODUCTION", "STAGING"]),
    targeting: z.enum(["ALL", "INTERNAL", "BETA", "PREMIUM"]).array(),
    projectId: z.string(),
});

const ZGetAllFeatureFlags = z.object({
    projectId: z.string(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(30).default(10),
});

const ZUpdateFeatureFlags = z
    .object({
        name: z.string().max(25).optional(),
        description: z.string().max(500).optional(),
        enabled: z.boolean().optional(),
        environment: z.enum(["DEVELOPMENT", "PRODUCTION", "STAGING"]).optional(),
        rolloutPercentage: z.number().min(0).max(100).optional(),
        targeting: z.enum(["ALL", "INTERNAL", "BETA", "PREMIUM"]).array().optional(),
    })
    .partial();

type ListFlagsRequest = FastifyRequest<{
    Querystring: { page?: string; limit?: string; project_id?: string };
}>;

type FlagByIdRequest = FastifyRequest<{ Params: { id: string } }>;

/**
 * List all feature flags for the authenticated user
 */
export async function listFlags(request: ListFlagsRequest, reply: FastifyReply) {
    const userId = request.userId;
    const { page, limit, project_id } = request.query;

    const result = ZGetAllFeatureFlags.safeParse({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        projectId: project_id,
    });

    if (!result.success) {
        return reply.status(400).send({
            success: false,
            message: "Invalid request",
            data: [result.error.message],
        });
    }

    const data = result.data;
    const skip = (data.page - 1) * data.limit;

    const [flags, count] = await Promise.all([
        prisma.featureFlags.findMany({
            skip,
            take: data.limit,
            where: {
                clerk_user_id: userId,
                projectId: data.projectId,
            },
            include: {
                _count: {
                    select: { evaluationLogs: true },
                },
            },
        }),
        prisma.featureFlags.count({
            where: { clerk_user_id: userId },
        }),
    ]);

    return reply.send({
        success: true,
        message: "Fetched feature flags",
        data: flags,
        meta: {
            page: data.page,
            totalItems: count,
            totalPages: Math.ceil(count / data.limit),
        },
    });
}

/**
 * Create a new feature flag
 */
export async function createFlag(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const result = ZFeatureFlags.safeParse(request.body);

    if (!result.success) {
        return reply.status(400).send({
            success: false,
            message: "Invalid request body",
            data: [result.error.message],
        });
    }

    const data = result.data;
    const slug = data.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

    // Check if flag exists
    const flagExists = await prisma.featureFlags.findFirst({
        where: {
            slug,
            clerk_user_id: userId,
            projectId: data.projectId,
        },
    });

    if (flagExists) {
        return reply.status(400).send({
            success: false,
            message: "A flag with this name already exists in this project",
            data: [],
        });
    }

    const insertedFlag = await prisma.featureFlags.create({
        data: {
            clerk_user_id: userId,
            description: data.description,
            name: data.name,
            slug,
            enabled: data.enabled,
            environment: data.environment,
            rollout_percentage: data.rolloutPercentage,
            targeting: data.targeting as TargetUser[],
            projectId: data.projectId,
        },
    });

    await prisma.recentActivity.create({
        data: {
            activity: "Feature Flag created",
            flag_id: insertedFlag.id,
            clerk_user_id: userId,
        },
    });

    return reply.status(201).send({
        success: true,
        message: "Feature flag created",
        data: insertedFlag,
    });
}

/**
 * Update a feature flag
 */
export async function updateFlag(request: FlagByIdRequest, reply: FastifyReply) {
    const userId = request.userId;
    const { id } = request.params;
    const result = ZUpdateFeatureFlags.safeParse(request.body);

    if (!result.success) {
        return reply.status(400).send({
            success: false,
            message: "Invalid request body",
            data: [result.error.message],
        });
    }

    const data = result.data;
    const dataToUpdate: Record<string, unknown> = {};

    if (data.name !== undefined) dataToUpdate.name = data.name;
    if (data.description !== undefined) dataToUpdate.description = data.description;
    if (data.enabled !== undefined) dataToUpdate.enabled = data.enabled;
    if (data.environment !== undefined) dataToUpdate.environment = data.environment;
    if (data.rolloutPercentage !== undefined)
        dataToUpdate.rollout_percentage = data.rolloutPercentage;
    if (data.targeting !== undefined) dataToUpdate.targeting = data.targeting;

    const updatedFlag = await prisma.featureFlags.update({
        data: dataToUpdate,
        where: { id },
    });

    await prisma.recentActivity.create({
        data: {
            activity: data.enabled === false ? "Feature Flag disabled" : "Feature Flag updated",
            clerk_user_id: userId,
            flag_id: updatedFlag.id,
        },
    });

    return reply.send({
        success: true,
        message: "Feature flag updated",
        data: updatedFlag,
    });
}

/**
 * Delete a feature flag
 */
export async function deleteFlag(request: FlagByIdRequest, reply: FastifyReply) {
    const { id } = request.params;

    const deletedFlag = await prisma.featureFlags.delete({
        where: { id },
    });

    return reply.send({
        success: true,
        message: "Feature flag deleted",
        data: {
            id: deletedFlag.id,
            slug: deletedFlag.slug,
            name: deletedFlag.name,
        },
    });
}
