import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

const thisMonthStart = startOfMonth(new Date());
const thisMonthEnd = endOfMonth(new Date());
const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

const getFlagCallsMetrics = async (
    clerkUserId: string,
    start: Date,
    end: Date,
) => {
    try {
        const flagCalls = (
            await prisma.flagEvaluationLogs.findMany({
                where: {
                    clerk_user_id: clerkUserId,
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
    clerkUserId: string,
    start: Date,
    end: Date,
) => {
    try {
        const usersTargeted = (
            await prisma.flagEvaluationLogs.groupBy({
                by: ["visited_user_id"],
                where: {
                    clerk_user_id: clerkUserId,
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

const featureVisible = async (clerkUserId: string, start: Date, end: Date) => {
    try {
        const totalUsersPrms = getUsersTargetedMetrics(clerkUserId, start, end);

        const enabledUsersPrms = prisma.flagEvaluationLogs.groupBy({
            by: ["visited_user_id"],
            where: {
                clerk_user_id: clerkUserId,
                enabled: true,
                createdAt: { gte: start, lte: end },
            },
            _count: true,
        });

        const [totalUsers, enabledUsers] = await Promise.all([
            totalUsersPrms,
            enabledUsersPrms,
        ]);

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

const getPercentageChange = (thisMonthVal: number, lastMonthVal: number) => {
    return ((thisMonthVal - lastMonthVal) / lastMonthVal) * 100;
};

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to see your flags",
            );
        }

        const thisMonthFlagCallsPrms = getFlagCallsMetrics(
            user.id,
            thisMonthStart,
            thisMonthEnd,
        );
        const lastMonthFlagCallsPrms = getFlagCallsMetrics(
            user.id,
            lastMonthStart,
            lastMonthEnd,
        );

        const thisMonthUsersTargetedPrms = getUsersTargetedMetrics(
            user.id,
            thisMonthStart,
            thisMonthEnd,
        );
        const lastMonthUsersTargetedPrms = getUsersTargetedMetrics(
            user.id,
            lastMonthStart,
            lastMonthEnd,
        );

        const thisMonthFeatureVisiblePrms = featureVisible(
            user.id,
            thisMonthStart,
            thisMonthEnd,
        );
        const lastMonthFeatureVisiblePrms = featureVisible(
            user.id,
            lastMonthStart,
            lastMonthEnd,
        );

        const thisMonthActiveFlagsPrms = getActiveFlags(
            user.id,
            thisMonthStart,
            thisMonthEnd,
        );
        const lastMonthActiveFlagsPrms = getActiveFlags(
            user.id,
            lastMonthStart,
            lastMonthEnd,
        );

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
            thisMonthFlagCallsPrms,
            lastMonthFlagCallsPrms,
            thisMonthUsersTargetedPrms,
            lastMonthUsersTargetedPrms,
            thisMonthFeatureVisiblePrms,
            lastMonthFeatureVisiblePrms,
            thisMonthActiveFlagsPrms,
            lastMonthActiveFlagsPrms,
        ]);

        const flagCallsPercentageChange = getPercentageChange(
            thisMnthFlagCalls,
            lastMnthFlagCalls,
        );
        const usersTargetedPercentageChange = getPercentageChange(
            thisMnthUsers,
            lastMnthUsers,
        );
        const visibiltyPercentageChange = getPercentageChange(
            thisMnthVisiblity,
            lastMnthVisibility,
        );
        const activeFlagsChange = getPercentageChange(
            thisMnthActiveFlags,
            lastMntActiveFlags,
        );

        const responseData = {
            activeFlags: {
                value: thisMnthActiveFlags,
                change: activeFlagsChange,
            },
            featureVisibilty: {
                value: thisMnthVisiblity * 100,
                change: visibiltyPercentageChange,
            },
            flagCalls: {
                value: thisMnthFlagCalls,
                change: flagCallsPercentageChange,
            },
            usersTargeted: {
                value: thisMnthUsers,
                change: usersTargetedPercentageChange,
            },
        };

        return Response.json(
            {
                success: true,
                message: "Metrics fethced successfully",
                data: responseData,
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
