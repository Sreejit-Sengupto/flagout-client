import axiosInstance, { TApiResponse } from "@/lib/axios";
import {
    TFeatureFlags,
    TGetAllFeatureFlags,
    TUpdateFeatureFlags,
} from "@/lib/zod-schemas/feature-flags";
import { FeatureFlags } from "@prisma/client";
import { showSuccess } from "@/lib/sonner";

export type TResponseGetAllFeatureFlags = TApiResponse<
    (FeatureFlags & {
        _count: {
            evaluationLogs: number;
        };
    })[]
>;
export const getFeatureFlags = async (input: TGetAllFeatureFlags) => {
    try {
        const response =
            await axiosInstance.request<TResponseGetAllFeatureFlags>({
                url: "/flags",
                method: "GET",
                params: {
                    limit: input.limit,
                    page: input.page,
                },
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export type TResponseCreateFeatureFlag = TApiResponse<FeatureFlags>;
export const createFeatureFlag = async (input: TFeatureFlags) => {
    const reqData: TFeatureFlags = {
        name: input.name,
        description: input.description,
        enabled: input.enabled,
        environment: input.environment,
        rolloutPercentage: input.rolloutPercentage,
        targeting: input.targeting,
    };
    try {
        const response =
            await axiosInstance.request<TResponseCreateFeatureFlag>({
                url: "/flags",
                method: "POST",
                data: reqData,
            });
        if (response.status === 201) {
            showSuccess(response.data.message);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export type TResponseUpdateFeatureFlag = TApiResponse<FeatureFlags>;
export const updateFeatureFlag = async (
    id: string,
    data: TUpdateFeatureFlags,
) => {
    try {
        const response =
            await axiosInstance.request<TResponseUpdateFeatureFlag>({
                url: `/flags/${id}`,
                method: "PATCH",
                data,
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};
