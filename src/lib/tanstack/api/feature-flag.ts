import axiosInstance, { TApiResponse } from "@/lib/axios";
import {
    TFeatureFlags,
    TGetAllFeatureFlags,
} from "@/lib/zod-schemas/feature-flags";
import { FeatureFlags } from "@prisma/client";
import { showSuccess } from "@/lib/sonner";

export type TResponseGetAllFeatureFlags = TApiResponse<FeatureFlags[]>;
export const getFeatureFlags = async (input: TGetAllFeatureFlags) => {
    try {
        const response =
            await axiosInstance.request<TResponseGetAllFeatureFlags>({
                url: "/v1/flags",
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
                url: "/v1/flags",
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
