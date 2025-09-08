import axiosInstance, { TApiResponse } from "@/lib/axios";

interface TMetrics {
    activeFlags: {
        value: number;
        change: number;
    };
    featureVisibility: {
        value: number;
        change: number;
    };
    flagCalls: {
        value: number;
        change: number;
    };
    usersTargeted: {
        value: number;
        change: number;
    };
}

export type TResponseMetrics = TApiResponse<TMetrics>;
export const getMetrics = async () => {
    try {
        const response = await axiosInstance.request<TResponseMetrics>({
            url: "/flags/metrics",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
