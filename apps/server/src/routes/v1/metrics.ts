import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "@flagout/database";
import { authMiddleware } from "../../plugins/auth.js";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

const thisMonthStart = startOfMonth(new Date());
const thisMonthEnd = endOfMonth(new Date());
const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

const getFlagCallsMetrics = async (clerkUserId: string, start: Date, end: Date) => {
    return (
        await prisma.flagEvaluationLogs.findMany({
            where: {
                clerk_user_id: clerkUserId,
                createdAt: { gte: start, lte: end },
            },
        })
    ).length;
};

const getUsersTargetedMetrics = async (clerkUserId: string, start: Date, end: Date) => {
    return (
        await prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: {
                clerk_user_id: clerkUserId,
                createdAt: { gte: start, lte: end },
            },
            _count: true,
        })
    ).length;
};

const featureVisible = async (clerkUserId: string, start: Date, end: Date) => {
    const [totalUsers, enabledUsers] = await Promise.all([
        getUsersTargetedMetrics(clerkUserId, start, end),
        prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: {
                clerk_user_id: clerkUserId,
                enabled: true,
                createdAt: { gte: start, lte: end },
            },
            _count: true,
        }),
    ]);
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

const getPercentageChange = (thisMonthVal: number, lastMonthVal: number) => {
    if (lastMonthVal === 0) return 0;
    return ((thisMonthVal - lastMonthVal) / lastMonthVal) * 100;
};

/**
 * Metrics routes
 */
export async function metricsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.addHook("preHandler", authMiddleware);

    /**
     * GET /api/v1/flags/metrics
     */
    fastify.get("/", async (request, reply) => {
        const userId = request.userId;

        const [
            thisMnthFlagCalls,
            lastMnthFlagCalls,
            thisMnthUsers,
            lastMnthUsers,
            thisMnthVisiblity,
            lastMnthVisibility,
            thisMnthActiveFlags,
            lastMntActiveFlags,
        ] = await Promise.all([
            getFlagCallsMetrics(userId, thisMonthStart, thisMonthEnd),
            getFlagCallsMetrics(userId, lastMonthStart, lastMonthEnd),
            getUsersTargetedMetrics(userId, thisMonthStart, thisMonthEnd),
            getUsersTargetedMetrics(userId, lastMonthStart, lastMonthEnd),
            featureVisible(userId, thisMonthStart, thisMonthEnd),
            featureVisible(userId, lastMonthStart, lastMonthEnd),
            getActiveFlags(userId, thisMonthStart, thisMonthEnd),
            getActiveFlags(userId, lastMonthStart, lastMonthEnd),
        ]);

        return reply.send({
            success: true,
            message: "Metrics fetched successfully",
            data: {
                activeFlags: {
                    value: thisMnthActiveFlags,
                    change: getPercentageChange(thisMnthActiveFlags, lastMntActiveFlags),
                },
                featureVisibilty: {
                    value: thisMnthVisiblity * 100,
                    change: getPercentageChange(thisMnthVisiblity, lastMnthVisibility),
                },
                flagCalls: {
                    value: thisMnthFlagCalls,
                    change: getPercentageChange(thisMnthFlagCalls, lastMnthFlagCalls),
                },
                usersTargeted: {
                    value: thisMnthUsers,
                    change: getPercentageChange(thisMnthUsers, lastMnthUsers),
                },
            },
        });
    });
}
