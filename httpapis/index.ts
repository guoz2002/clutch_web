import axios from 'axios';
import { useAuthStore } from '@/pinia/useAuthStore';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量读取API基础地址
    timeout: 10000, // Request timeout
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Add any custom request headers or configurations here
        // For example, adding an authorization token
        const authStore = useAuthStore();
        config.headers.Authorization = authStore.authenticationHeader;
        return config;
    },
    error => {
        // Handle request error here
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Handle response error here
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.handleUnauthorized();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
