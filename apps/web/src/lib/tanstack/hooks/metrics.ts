import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { queryKeys } from "../keys";
import { getMetrics } from "../api/metrics";

export const useGetMetrics = () => {
    const { isSignedIn } = useAuth();
    return useQuery({
        queryKey: queryKeys.metrics,
        queryFn: getMetrics,
        enabled: !!isSignedIn,
        staleTime: 60 * 1000,
    });
};
