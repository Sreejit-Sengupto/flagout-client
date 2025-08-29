import axios from "axios";
import { URL } from "../constants";

const axiosInstance = axios.create({
    baseURL: `${URL}/api`,
});

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
