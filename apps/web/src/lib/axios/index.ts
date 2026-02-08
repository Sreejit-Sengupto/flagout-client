import axios from "axios";
import { showError } from "../sonner";

// Use server URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    withCredentials: true,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get token from Clerk on the client side
        if (typeof window !== "undefined" && window.Clerk?.session) {
            try {
                const token = await window.Clerk.session.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Failed to get auth token:", error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor for error handling
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
