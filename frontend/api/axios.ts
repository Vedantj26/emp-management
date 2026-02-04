import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { clearAuthData } from "@/lib/auth";
import { startGlobalLoader, stopGlobalLoader } from "@/hooks/use-global-loader";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    startGlobalLoader();
    return config;
  },
  (error: AxiosError) => {
    stopGlobalLoader();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    stopGlobalLoader();
    return response;
  },
  (error: AxiosError) => {
    stopGlobalLoader();
    if (error.response?.status === 401) {
      clearAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403) {
      console.warn("Forbidden response", error.response?.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;
