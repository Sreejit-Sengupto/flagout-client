import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { getDashboardActivity } from "../api/recent-activity";

export const useRecentActivity = (limit: number, page: number) => {
    return useQuery({
        queryKey: [...queryKeys.dashboardActivity, limit, page],
        queryFn: () => getDashboardActivity({ limit, page }),
        staleTime: 60 * 1000,
    });
};
