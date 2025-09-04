import axiosInstance, { TApiResponse } from "@/lib/axios";
import { showSuccess } from "@/lib/sonner";
import { TAddFlagEnv } from "@/lib/zod-schemas/flag-env";
import { FlagEnviroment } from "@prisma/client";

type ZGetEnvUrlsResponse = TApiResponse<FlagEnviroment>;
export const getEnvURLs = async () => {
    try {
        const response = await axiosInstance.request<ZGetEnvUrlsResponse>({
            url: "/environment",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

type ZAddEnvUrlsResponse = TApiResponse<FlagEnviroment>;
export const addEnvUrls = async (input: TAddFlagEnv) => {
    const data: TAddFlagEnv = {
        dev: input.dev,
        prod: input.prod,
        stage: input.stage,
    };

    try {
        const response = await axiosInstance.request<ZAddEnvUrlsResponse>({
            url: "/environment",
            method: "POST",
            data,
        });

        if (response.data.status === true) {
            showSuccess(response.data.message);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};
