import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { addEnvUrls, getEnvURLs } from "../api/flag-env";
import useTanstackClient from "../query-client";
import { TAddFlagEnv } from "@/lib/zod-schemas/flag-env";

export const useGetEnvQuery = () => {
    return useQuery({
        queryKey: queryKeys.envUrl,
        queryFn: () => getEnvURLs(),
        staleTime: 60 * 1000,
    });
};

export const useAddEnvUrlMutation = () => {
    const queryClient = useTanstackClient();
    return useMutation({
        mutationFn: (input: TAddFlagEnv) => addEnvUrls(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.envUrl,
            });
        },
    });
};
