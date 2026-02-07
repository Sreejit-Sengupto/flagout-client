import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "@flagout/database";
import { authMiddleware } from "../../plugins/auth.js";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

type MetricsIdParams = {
    Params: { id: string };
    Querystring: { months?: string };
};

const getFlagCallsMetrics = async (flagId: string, start: Date, end: Date) => {
    return (
        await prisma.flagEvaluationLogs.findMany({
            where: {
                flag_id: flagId,
                createdAt: { gte: start, lte: end },
            },
        })
    ).length;
};

const getUsersTargetedMetrics = async (flagId: string, start: Date, end: Date) => {
    return (
        await prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: {
                flag_id: flagId,
                createdAt: { gte: start, lte: end },
            },
            _count: true,
        })
    ).length;
};

const featureVisible = async (flagId: string, totalUsers: number, start: Date, end: Date) => {
    const enabledUsers = await prisma.flagEvaluationLogs.groupBy({
        by: ["visited_user_id"],
        where: {
            flag_id: flagId,
            enabled: true,
            createdAt: { gte: start, lte: end },
        },
        _count: true,
    });
    return totalUsers === 0 ? 0 : enabledUsers.length / totalUsers;
};

const getActiveFlags = async (clerkUserId: string, start: Date, end: Date) => {
    return (
        await prisma.featureFlags.findMany({
            where: {
                clerk_user_id: clerkUserId,
                enabled: true,
                createdAt: { gte: start, lte: end },
            },
        })
    ).length;
};

/**
 * Per-flag metrics routes
 */
export async function metricsIdRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    /**
     * GET /api/v1/flags/metrics/:id
     */
    fastify.get<MetricsIdParams>("/", async (request, reply) => {
        const userId = request.userId;
        const { id: flagId } = request.params;
        const months = Number(request.query.months || "6");

        const today = new Date();
        const promises: Promise<{
            month: string;
            metrics: {
                flagCalls: number;
                usersTargeted: number;
                visibility: number;
                totalFlags: number;
            };
        }>[] = [];

        for (let i = months; i >= 0; i--) {
            const targetDate = subMonths(today, i);
            const monthStart = startOfMonth(targetDate);
            const monthEnd = endOfMonth(targetDate);

            promises.push(
                (async () => {
                    const totalUsers = await getUsersTargetedMetrics(flagId, monthStart, monthEnd);
                    const [flagCalls, visibility, totalFlags] = await Promise.all([
                        getFlagCallsMetrics(flagId, monthStart, monthEnd),
                        featureVisible(flagId, totalUsers, monthStart, monthEnd),
                        getActiveFlags(userId, monthStart, monthEnd),
                    ]);

                    return {
                        month: format(monthStart, "MMM yyyy"),
                        metrics: {
                            flagCalls,
                            usersTargeted: totalUsers,
                            visibility: visibility * 100,
                            totalFlags,
                        },
                    };
                })(),
            );
        }

        const monthlyMetrics = await Promise.all(promises);

        return reply.send({
            success: true,
            message: `Metrics for the last ${months} months fetched successfully`,
            data: monthlyMetrics,
        });
    });
}
