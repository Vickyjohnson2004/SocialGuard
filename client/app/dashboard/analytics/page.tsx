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
  CartesianGrid,
} from "recharts";
import Link from "next/link";
export default function Analytics() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["analytics-page"],
    queryFn: async () => (await analyticsService.dashboard()).data.data,
    retry: 1,
  });
  if (isLoading)
    return (
      <main className="page-shell">
        <div className="loading-panel">Loading analytics...</div>
      </main>
    );
  if (error)
    return (
      <main className="page-shell">
        <div className="status-panel status-error">
          <h1 className="text-xl font-bold">Analytics unavailable</h1>
          <p className="mt-2 text-slate-400">
            The dashboard could not load the latest analysis data.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-[#F4A91C] px-4 py-2 font-bold text-black"
          >
            {isFetching ? "Retrying..." : "Try again"}
          </button>
        </div>
      </main>
    );
  const count = (name: string) =>
    (data?.distribution || []).find((item: any) => item.classification === name)
      ?.count || 0;
  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-1 text-slate-400">
            Understand the volume and risk profile of analyzed accounts.
          </p>
        </div>
        <Link
          href="/dashboard/datasets"
          className="rounded-lg bg-[#F4A91C] px-4 py-2 font-bold text-black"
        >
          Analyze a dataset
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <p className="text-slate-400">Analyzed</p>
          <strong className="text-2xl sm:text-3xl">
            {data?.summary?.total || 0}
          </strong>
        </div>
        {["GENUINE", "SUSPICIOUS", "HIGH_RISK", "LIKELY_BOT"].map((name) => (
          <div
            key={name}
            className="rounded-xl border border-slate-800 bg-[#111827] p-4"
          >
            <p className="text-slate-400">{name.replace("_", " ")}</p>
            <strong className="text-2xl sm:text-3xl">{count(name)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-6">
        <h2 className="font-bold">Platform Distribution</h2>
        {(data?.platforms || []).length === 0 ? (
          <p className="py-20 text-center text-slate-400">
            No analyzed accounts yet. Upload a dataset to see platform trends.
          </p>
        ) : (
          <div className="mt-4 h-72 w-full sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.platforms || []}
                margin={{ top: 8, right: 8, left: -18, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="platform"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Accounts"
                  fill="#F4A91C"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </main>
  );
}
