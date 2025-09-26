import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { NextRequest } from "next/server";

const getFlagCallsMetrics = async (flagId: string, start: Date, end: Date) => {
    try {
        const flagCalls = (
            await prisma.flagEvaluationLogs.findMany({
                where: {
                    flag_id: flagId,
                    createdAt: { gte: start, lte: end },
                },
            })
        ).length;

        return flagCalls;
    } catch (error) {
        throw error;
    }
};

const getUsersTargetedMetrics = async (
    flagId: string,
    start: Date,
    end: Date,
) => {
    try {
        const usersTargeted = (
            await prisma.flagEvaluationLogs.groupBy({
                by: ["visited_user_id"],
                where: {
                    flag_id: flagId,
                    createdAt: { gte: start, lte: end },
                },
                _count: true,
            })
        ).length;

        return usersTargeted;
    } catch (error) {
        throw error;
    }
};

const featureVisible = async (
    flagId: string,
    totalUsers: number,
    start: Date,
    end: Date,
) => {
    try {
        // const totalUsersPrms = getUsersTargetedMetrics(clerkUserId, start, end);

        const enabledUsers = await prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: {
                flag_id: flagId,
                enabled: true,
                createdAt: { gte: start, lte: end },
            },
            _count: true,
        });

        // const [totalUsers, enabledUsers] = await Promise.all([
        //     totalUsersPrms,
        //     enabledUsersPrms,
        // ]);

        return totalUsers === 0 ? 0 : enabledUsers.length / totalUsers;
    } catch (error) {
        throw error;
    }
};

const getActiveFlags = async (clerkUserId: string, start: Date, end: Date) => {
    try {
        const activeFlags = (
            await prisma.featureFlags.findMany({
                where: {
                    clerk_user_id: {
                        equals: clerkUserId,
                    },
                    enabled: {
                        equals: true,
                    },
                    createdAt: { gte: start, lte: end },
                },
            })
        ).length;
        return activeFlags;
    } catch (error) {
        throw error;
    }
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        const { id: flagId } = await params;

        const searchParams = request.nextUrl.searchParams;
        const months = Number(searchParams.get("months") || "6");

        const today = new Date();
        const promises: Promise<{
            month: string;
            metrics: {
                flagCalls: number;
                usersTargeted: number;
                visibility: number;
                activeFlags: number;
            };
        }>[] = [];

        for (let i = months; i >= 0; i--) {
            const targetDate = subMonths(today, i);
            const monthStart = startOfMonth(targetDate);
            const monthEnd = endOfMonth(targetDate);

            const promise = (async () => {
                const totalUsers = await getUsersTargetedMetrics(
                    flagId,
                    monthStart,
                    monthEnd,
                );
                const flagCalls = await getFlagCallsMetrics(
                    flagId,
                    monthStart,
                    monthEnd,
                );
                const visibility = await featureVisible(
                    flagId,
                    totalUsers,
                    monthStart,
                    monthEnd,
                );
                const activeFlags = await getActiveFlags(
                    user.id,
                    monthStart,
                    monthEnd,
                );

                return {
                    month: format(monthStart, "MMM yyyy"),
                    metrics: {
                        flagCalls,
                        usersTargeted: totalUsers,
                        visibility: visibility * 100,
                        activeFlags,
                    },
                };
            })();

            promises.push(promise);
        }

        const monthlyMetrics = await Promise.all(promises);

        return Response.json(
            {
                success: true,
                message: `Metrics for the last ${months} months fetched 
      successfully`,
                data: monthlyMetrics,
            },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                    data: [error.details],
                },
                { status: error.status },
            );
        }

        return Response.json(
            { success: false, message: "Internal Server Error", data: [] },
            { status: 500 },
        );
    }
}
