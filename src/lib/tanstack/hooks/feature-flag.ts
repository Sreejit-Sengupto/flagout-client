import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { createFeatureFlag, getFeatureFlags } from "../api/feature-flag";
import { TFeatureFlags } from "@/lib/zod-schemas/feature-flags";
import useTanstackClient from "../query-client";

export const useUserFlagQuery = (limit: number, page: number) => {
    return useQuery({
        queryKey: queryKeys.userFlags,
        queryFn: () => getFeatureFlags({ limit, page }),
        staleTime: 60 * 1000,
    });
};

export const useCreateFlagMutation = (input: TFeatureFlags) => {
    const queryClient = useTanstackClient();
    return useMutation({
        mutationFn: () => createFeatureFlag(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [...queryKeys.userFlags, ...queryKeys.dashboardActivity],
            });
        },
    });
};
