import { api } from "@/lib/api";
import { AccountInput } from "@/types";
export const analysisService = {
  create: (data: AccountInput) => api.post("/analysis", data),
  list: (params?: Record<string, unknown>) => api.get("/analysis", { params }),
  get: (id: string) => api.get(`/analysis/${id}`),
  reanalyze: (id: string) => api.post(`/analysis/${id}/reanalyze`)
};
