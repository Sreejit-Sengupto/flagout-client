import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { createProject, getAllProjects } from "../api/project";
import useTanstackClient from "../query-client";

export const useGetAllProjects = () => {
    return useQuery({
        queryKey: queryKeys.projects,
        queryFn: () => getAllProjects(),
        staleTime: 60 * 1000,
    });
};

export const useCreateProjectMutation = () => {
    const queryClient = useTanstackClient();
    return useMutation({
        mutationFn: (name: string) => createProject(name),
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.projects,
            });
        },
    });
};
