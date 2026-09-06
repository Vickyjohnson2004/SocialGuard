import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 15000
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/refresh")) {
      try {
        await api.post("/auth/refresh");
        return api.request(error.config);
      } catch {}
    }
    return Promise.reject(error);
  }
);
