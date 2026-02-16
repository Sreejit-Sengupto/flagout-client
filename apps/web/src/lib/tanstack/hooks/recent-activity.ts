import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { queryKeys } from "../keys";
import { getDashboardActivity } from "../api/recent-activity";

export const useRecentActivity = (limit: number, page: number) => {
    const { isSignedIn } = useAuth();
    return useQuery({
        queryKey: [...queryKeys.dashboardActivity, limit, page],
        queryFn: () => getDashboardActivity({ limit, page }),
        enabled: !!isSignedIn,
        staleTime: 60 * 1000,
    });
};
