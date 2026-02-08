import axiosInstance, { TApiResponse } from "@/lib/axios";
import { Projects } from "@flagout/database";

export type TResponseGetAllProjects = TApiResponse<Projects[]>;
export const getAllProjects = async () => {
    const response = await axiosInstance.request<TResponseGetAllProjects>({
        url: "/projects",
        method: "GET",
    });
    return response.data;
};

export type TResponseCreateProject = TApiResponse<Projects>;
export const createProject = async (name: string) => {
    const response = await axiosInstance.request<TResponseCreateProject>({
        url: "/projects",
        method: "POST",
        data: {
            name,
        },
    });
    return response.data;
};
