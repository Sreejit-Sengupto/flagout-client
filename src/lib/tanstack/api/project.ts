import axiosInstance, { TApiResponse } from "@/lib/axios";
import { Projects } from "@prisma/client";

export type TResponseGetAllProjects = TApiResponse<Projects[]>;
export const getAllProjects = async () => {
    try {
        const response = await axiosInstance.request<TResponseGetAllProjects>({
            url: "/projects",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export type TResponseCreateProject = TApiResponse<Projects>;
export const createProject = async (name: string) => {
    try {
        const response = await axiosInstance.request<TResponseCreateProject>({
            url: "/projects",
            method: "POST",
            data: {
                name,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
