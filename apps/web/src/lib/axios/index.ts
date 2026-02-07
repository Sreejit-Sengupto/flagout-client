import axios from "axios";
import { showError } from "../sonner";

const axiosInstance = axios.create({
    // baseURL: `${URL}/api`,
    baseURL: `/api/v1`,
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        const message = error.response?.data?.message || "Unexpected error";
        showError(message);
        return Promise.reject(error);
    },
);

export interface TApiResponse<T> {
    data: T;
    status: boolean;
    message: string;
    meta?: {
        page?: number;
        totalItems?: number;
        totalPages?: number;
    };
}

export default axiosInstance;
