import { api } from "@/lib/api";
export const analyticsService = { dashboard: () => api.get("/analytics/dashboard") };
