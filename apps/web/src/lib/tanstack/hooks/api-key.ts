import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import {
    createAPIKey,
    deleteAPIKey,
    getAllAPIKeys,
    revokeAPIKey,
} from "../api/api-key";
import useTanstackClient from "../query-client";

export const useQueryAPIKeys = () => {
    return useQuery({
        queryKey: queryKeys.apiKey,
        queryFn: () => getAllAPIKeys(),
        staleTime: 60 * 1000,
    });
};

export const useAPIKeysMutation = () => {
    const queryClient = useTanstackClient();
    const createKey = useMutation({
        mutationFn: (name: string) => createAPIKey(name),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.apiKey,
            });
        },
    });

    const deleteKey = useMutation({
        mutationFn: (id: string) => deleteAPIKey(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.apiKey,
            });
        },
    });

    const revokeKey = useMutation({
        mutationFn: ({ id, revoke }: { id: string; revoke: boolean }) =>
            revokeAPIKey(id, revoke),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.apiKey,
            });
        },
    });

    return { createKey, deleteKey, revokeKey };
};

// export const useCreateAPIKey = () => {
//     const queryClient = useTanstackClient();
//     return useMutation({
//         mutationFn: (name: string) => createAPIKey(name),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({
//                 queryKey: queryKeys.apiKey,
//             });
//         },
//     });
// };

// export const useDeleteAPIKey = () => {
//     const queryClient = useTanstackClient();
//     return useMutation({
//         mutationFn: (id: string) => deleteAPIKey(id),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({
//                 queryKey: queryKeys.apiKey,
//             });
//         },
//     });
// };

// export const useRevokeAPIKey = () => {
//     const queryClient = useTanstackClient();
//     return useMutation({
//         mutationFn: ({ id, revoke }: { id: string; revoke: boolean }) =>
//             revokeAPIKey(id, revoke),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({
//                 queryKey: queryKeys.apiKey,
//             });
//         },
//     });
// };
