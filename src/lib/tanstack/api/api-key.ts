import axiosInstance, { TApiResponse } from "@/lib/axios";
import { APIKey } from "@prisma/client";

export type TResponseGetAllAPIKeys = TApiResponse<APIKey[]>;
export const getAllAPIKeys = async () => {
    try {
        const response = await axiosInstance.request<TResponseGetAllAPIKeys>({
            url: "/api-key",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export type TResponseCreateAPIKEY = TApiResponse<{ name: string; key: string }>;
export const createAPIKey = async (name: string) => {
    try {
        const response = await axiosInstance.request<TResponseCreateAPIKEY>({
            url: "/api-key",
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

export type TResponseRevokeAPIKey = TApiResponse<APIKey>;
export const revokeAPIKey = async (id: string, revoke: boolean) => {
    try {
        const response = await axiosInstance.request<TResponseRevokeAPIKey>({
            url: `/api-key/${id}`,
            method: "PATCH",
            data: {
                revoke,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAPIKey = async (id: string) => {
    try {
        const response = await axiosInstance.request<TResponseRevokeAPIKey>({
            url: `/api-key/${id}`,
            method: "DELETE",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
