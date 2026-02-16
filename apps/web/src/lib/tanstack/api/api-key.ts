import axiosInstance, { TApiResponse } from "@/lib/axios";
import { APIKey } from "@flagout/database";

export type TResponseGetAllAPIKeys = TApiResponse<APIKey[]>;
export const getAllAPIKeys = async () => {
    const response = await axiosInstance.request<TResponseGetAllAPIKeys>({
        url: "/api-keys",
        method: "GET",
    });
    return response.data;
};

export type TResponseCreateAPIKEY = TApiResponse<{ name: string; key: string }>;
export const createAPIKey = async (name: string) => {
    const response = await axiosInstance.request<TResponseCreateAPIKEY>({
        url: "/api-keys",
        method: "POST",
        data: {
            name,
        },
    });
    return response.data;
};

export type TResponseRevokeAPIKey = TApiResponse<APIKey>;
export const revokeAPIKey = async (id: string, revoke: boolean) => {
    const response = await axiosInstance.request<TResponseRevokeAPIKey>({
        url: `/api-keys/${id}`,
        method: "PATCH",
        data: {
            revoke,
        },
    });
    return response.data;
};

export const deleteAPIKey = async (id: string) => {
    const response = await axiosInstance.request<TResponseRevokeAPIKey>({
        url: `/api-keys/${id}`,
        method: "DELETE",
    });
    return response.data;
};
