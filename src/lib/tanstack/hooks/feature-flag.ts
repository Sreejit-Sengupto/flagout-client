import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import {
    createFeatureFlag,
    getFeatureFlags,
    updateFeatureFlag,
} from "../api/feature-flag";
import {
    TFeatureFlags,
    TUpdateFeatureFlags,
} from "@/lib/zod-schemas/feature-flags";
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
                queryKey: [
                    ...queryKeys.userFlags,
                    ...queryKeys.dashboardActivity,
                ],
            });
        },
    });
};

export const useUpdateFlagMutation = (
    id: string,
    invalidationKeys: string[],
) => {
    const queryClient = useTanstackClient();
    return useMutation({
        mutationFn: (data: TUpdateFeatureFlags) => updateFeatureFlag(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: invalidationKeys,
            });
        },
    });
};
