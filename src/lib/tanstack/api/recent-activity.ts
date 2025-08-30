import axiosInstance, { TApiResponse } from "@/lib/axios";
import { TGetRecentActivities } from "@/lib/zod-schemas/recent-activity";
import { RecentActivity } from "@prisma/client";

interface TDashActivity extends RecentActivity {
    flag: {
        id: string;
        name: string;
        slug: string;
    };
}
export type TResponseDashboardActivity = TApiResponse<TDashActivity[]>;
export const getDashboardActivity = async (input: TGetRecentActivities) => {
    try {
        const response =
            await axiosInstance.request<TResponseDashboardActivity>({
                url: "/recent-activity",
                method: "GET",
                params: {
                    limit: input.limit,
                    page: input.page,
                },
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};
