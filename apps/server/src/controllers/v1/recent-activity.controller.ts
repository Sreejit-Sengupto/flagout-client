import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@flagout/database";
import { z } from "zod";

const ZPagination = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(30).default(10),
});

type RecentActivityRequest = FastifyRequest<{
    Querystring: { page?: string; limit?: string };
}>;

/**
 * Get recent activity for the authenticated user
 */
export async function getRecentActivity(request: RecentActivityRequest, reply: FastifyReply) {
    const userId = request.userId;
    const { page, limit } = request.query;

    const result = ZPagination.safeParse({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
    });

    if (!result.success) {
        return reply.status(400).send({
            success: false,
            message: "Invalid query parameters",
            data: [result.error.message],
        });
    }

    const data = result.data;
    const skip = (data.page - 1) * data.limit;

    const [activities, count] = await Promise.all([
        prisma.recentActivity.findMany({
            skip,
            take: data.limit,
            where: { clerk_user_id: userId },
            orderBy: { createdAt: "desc" },
            include: {
                flag: {
                    select: {
                        name: true,
                        slug: true,
                        enabled: true,
                    },
                },
            },
        }),
        prisma.recentActivity.count({
            where: { clerk_user_id: userId },
        }),
    ]);

    return reply.send({
        success: true,
        message: "Recent activity fetched",
        data: activities,
        meta: {
            page: data.page,
            totalItems: count,
            totalPages: Math.ceil(count / data.limit),
        },
    });
}
