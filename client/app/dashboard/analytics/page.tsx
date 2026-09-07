"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics-page"],
    queryFn: async () => (await analyticsService.dashboard()).data.data,
  });
  if (isLoading) return <main className="p-6">Loading...</main>;
  const count = (name: string) =>
    (data?.distribution || []).find((item: any) => item.classification === name)
      ?.count || 0;
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-1 text-slate-400">
        Understand the volume and risk profile of analyzed accounts.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <p className="text-slate-400">Analyzed</p>
          <strong className="text-3xl">{data?.summary?.total || 0}</strong>
        </div>
        {["GENUINE", "SUSPICIOUS", "HIGH_RISK", "LIKELY_BOT"].map((name) => (
          <div
            key={name}
            className="rounded-xl border border-slate-800 bg-[#111827] p-4"
          >
            <p className="text-slate-400">{name.replace("_", " ")}</p>
            <strong className="text-3xl">{count(name)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <h2 className="font-bold">Platform Distribution</h2>
        <div className="h-96">
          <ResponsiveContainer>
            <BarChart data={data?.platforms || []}>
              <XAxis dataKey="platform" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#F4A91C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
