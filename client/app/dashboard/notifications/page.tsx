"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
export default function Notifications() {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data.data,
  });
  return (
    <main className="page-shell">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : data?.length ? (
          data.map((n: any) => (
            <div
              key={n._id}
              className="rounded-xl border border-slate-800 bg-[#111827] p-5"
            >
              <b>{n.title}</b>
              <p className="mt-1 text-slate-400">{n.message}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No notifications.</p>
        )}
      </div>
    </main>
  );
}
