import { api } from "@/lib/api";
export const accountService = {
  list: (params?: Record<string, unknown>) => api.get("/accounts", { params }),
  get: (id: string) => api.get(`/accounts/${id}`)
};
