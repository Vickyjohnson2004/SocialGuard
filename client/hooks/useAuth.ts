"use client";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
export function useAuth() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await authService.me()).data.data,
    retry: false
  });
}
