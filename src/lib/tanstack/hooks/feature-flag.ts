import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import {
    createFeatureFlag,
    deleteFeatureFlag,
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
        queryKey: [...queryKeys.userFlags, limit, page],
        queryFn: () => getFeatureFlags({ limit, page }),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
};

export const useUserFlagMutations = () => {
    const queryClient = useTanstackClient();
    const createFlag = useMutation({
        mutationFn: (input: TFeatureFlags) => createFeatureFlag(input),
        onSuccess: async () => {
            const flagsPrms = queryClient.invalidateQueries({
                queryKey: queryKeys.userFlags,
            });
            const activityPrms = queryClient.invalidateQueries({
                queryKey: queryKeys.dashboardActivity,
            });
            await Promise.all([flagsPrms, activityPrms]);
        },
    });

    const updateFlag = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: TUpdateFeatureFlags;
            invalidationKeys: string[];
        }) => updateFeatureFlag(id, data),
        onSuccess: async (data, variables) => {
            const invalidatePrms = variables.invalidationKeys.map((item) => {
                return queryClient.invalidateQueries({
                    queryKey: [item],
                });
            });
            await Promise.all(invalidatePrms);
        },
    });

    const deleteFlag = useMutation({
        mutationFn: (id: string) => deleteFeatureFlag(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.userFlags,
            });
        },
    });

    return { createFlag, updateFlag, deleteFlag };
};

// export const useCreateFlagMutation = (input: TFeatureFlags) => {
//     const queryClient = useTanstackClient();
//     return useMutation({
//         mutationFn: () => createFeatureFlag(input),
//         onSuccess: async () => {
//             const flagsPrms = queryClient.invalidateQueries({
//                 queryKey: queryKeys.userFlags,
//             });
//             const activityPrms = queryClient.invalidateQueries({
//                 queryKey: queryKeys.dashboardActivity,
//             });
//             await Promise.all([flagsPrms, activityPrms]);
//         },
//     });
// };

// export const useUpdateFlagMutation = (
//     id: string,
//     invalidationKeys: string[],
// ) => {
//     const queryClient = useTanstackClient();
//     return useMutation({
//         mutationFn: (data: TUpdateFeatureFlags) => updateFeatureFlag(id, data),
//         onSuccess: async () => {
//             const invalidatePrms = invalidationKeys.map((item) => {
//                 return queryClient.invalidateQueries({
//                     queryKey: [item],
//                 });
//             });
//             await Promise.all(invalidatePrms);
//         },
//     });
// };

// export const useDeleteFlagMutation = () => {
//     const queryClient = useTanstackClient();
//     return useMutation({
//         mutationFn: (id: string) => deleteFeatureFlag(id),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({
//                 queryKey: queryKeys.userFlags,
//             });
//         },
//     });
// };
