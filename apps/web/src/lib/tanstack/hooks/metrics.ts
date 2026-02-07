import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { getMetrics } from "../api/metrics";

export const useGetMetrics = () => {
    return useQuery({
        queryKey: queryKeys.metrics,
        queryFn: getMetrics,
        staleTime: 60 * 1000,
    });
};
