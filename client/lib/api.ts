import axios from "axios";

type RetryableRequestConfig = { _authRetry?: boolean };

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as
      | (typeof error.config & RetryableRequestConfig)
      | undefined;
    const isAuthRequest = config?.url?.includes("/auth/");
    if (
      error.response?.status === 401 &&
      config &&
      !isAuthRequest &&
      !config._authRetry
    ) {
      config._authRetry = true;
      try {
        await api.post("/auth/refresh");
        return api.request(config);
      } catch {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);
