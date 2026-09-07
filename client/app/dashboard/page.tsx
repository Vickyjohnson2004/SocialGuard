"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import { StatCard } from "@/components/StatCard";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Link from "next/link";
import { RefreshCw, ShieldCheck, TrendingUp } from "lucide-react";

const chartColors = ["#F4A91C", "#fb7185", "#f97316", "#60a5fa"];

export default function Dashboard() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await analyticsService.dashboard()).data.data,
    retry: 1,
  });
  const dist = data?.distribution || [];
  const total = data?.summary?.total || 0;
  const avg = Math.round(data?.summary?.averageRisk || 0);
  const count = (name: string) =>
    dist.find((x: any) => x.classification === name)?.count || 0;
  if (isLoading)
    return (
      <main className="page-shell">
        <div className="loading-panel">Loading your risk overview...</div>
      </main>
    );
  if (error)
    return (
      <main className="page-shell">
        <div className="status-panel status-error">
          <h1 className="text-xl font-bold">Dashboard unavailable</h1>
          <p className="mt-2 text-slate-400">
            We could not load the latest risk overview. Your account data is
            unchanged.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F4A91C] px-4 py-2 font-bold text-black"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />{" "}
            {isFetching ? "Retrying..." : "Try again"}
          </button>
        </div>
      </main>
    );
  return (
    <main className="page-shell">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4A91C]">
            Command center
          </p>
          <h1 className="dashboard-heading mt-2 text-3xl font-black sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-400">
            Overview of analyzed account risk.
          </p>
        </div>
        <Link
          href="/dashboard/analysis/new"
          className="inline-flex w-full justify-center rounded-xl bg-[#F4A91C] px-5 py-3 font-bold text-black transition hover:bg-[#ffc14b] sm:w-auto"
        >
          New analysis
        </Link>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Total Analyses" value={total} />
        <StatCard label="Genuine" value={count("GENUINE")} />
        <StatCard label="Suspicious" value={count("SUSPICIOUS")} />
        <StatCard label="High Risk" value={count("HIGH_RISK")} accent />
        <StatCard label="Likely Bots" value={count("LIKELY_BOT")} accent />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="dashboard-card min-w-0 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Risk distribution</h2>
              <p className="mt-1 text-sm text-slate-400">
                How analyzed accounts are classified.
              </p>
            </div>
            <ShieldCheck size={20} className="shrink-0 text-[#F4A91C]" />
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dist}
                  dataKey="count"
                  nameKey="classification"
                  outerRadius="72%"
                  innerRadius="48%"
                  paddingAngle={3}
                >
                  {dist.map((_: any, i: number) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-4 sm:grid-cols-4">
            {dist.map((item: any, i: number) => (
              <div key={item.classification} className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: chartColors[i % chartColors.length],
                    }}
                  />
                  <span className="truncate text-xs text-slate-400">
                    {item.classification.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 pl-4 font-bold">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card min-w-0 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Average risk score</h2>
              <p className="mt-1 text-sm text-slate-400">
                Across your available analyses.
              </p>
            </div>
            <TrendingUp size={20} className="shrink-0 text-[#F4A91C]" />
          </div>
          <div className="mt-10 text-6xl font-black text-[#F4A91C] sm:text-7xl">
            {avg}
          </div>
          <div className="mt-6 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-[#F4A91C]"
              style={{ width: `${Math.min(avg, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Risk scores are signals for review, not absolute determinations.
          </p>
        </div>
      </div>
    </main>
  );
}
