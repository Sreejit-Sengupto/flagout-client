import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@flagout/database";
import { endOfMonth, startOfMonth, subMonths, format } from "date-fns";

// Pre-calculated date ranges for current/last month
const thisMonthStart = startOfMonth(new Date());
const thisMonthEnd = endOfMonth(new Date());
const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

// Helper functions
const getFlagCallsMetrics = async (userId: string, start: Date, end: Date, flagId?: string) => {
    return (
        await prisma.flagEvaluationLogs.findMany({
            where: {
                ...(flagId ? { flag_id: flagId } : { clerk_user_id: userId }),
                createdAt: { gte: start, lte: end },
            },
        })
    ).length;
};

const getUsersTargetedMetrics = async (userId: string, start: Date, end: Date, flagId?: string) => {
    return (
        await prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: {
                ...(flagId ? { flag_id: flagId } : { clerk_user_id: userId }),
                createdAt: { gte: start, lte: end },
            },
            _count: true,
        })
    ).length;
};

const getFeatureVisibility = async (userId: string, start: Date, end: Date, flagId?: string) => {
    const whereClause = {
        ...(flagId ? { flag_id: flagId } : { clerk_user_id: userId }),
        createdAt: { gte: start, lte: end },
    };

    const [totalUsers, enabledUsers] = await Promise.all([
        prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: whereClause,
            _count: true,
        }),
        prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: { ...whereClause, enabled: true },
            _count: true,
        }),
    ]);

    return totalUsers.length === 0 ? 0 : enabledUsers.length / totalUsers.length;
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

type MetricsByIdRequest = FastifyRequest<{
    Params: { id: string };
    Querystring: { months?: string };
}>;

/**
 * Get overall dashboard metrics
 */
export async function getDashboardMetrics(request: FastifyRequest, reply: FastifyReply) {
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
        getFeatureVisibility(userId, thisMonthStart, thisMonthEnd),
        getFeatureVisibility(userId, lastMonthStart, lastMonthEnd),
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
}

/**
 * Get per-flag monthly metrics
 */
export async function getFlagMetrics(request: MetricsByIdRequest, reply: FastifyReply) {
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
                const totalUsers = await getUsersTargetedMetrics(userId, monthStart, monthEnd, flagId);
                const [flagCalls, visibility, totalFlags] = await Promise.all([
                    getFlagCallsMetrics(userId, monthStart, monthEnd, flagId),
                    getFeatureVisibility(userId, monthStart, monthEnd, flagId),
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
}
