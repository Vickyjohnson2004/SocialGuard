"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import { StatCard } from "@/components/StatCard";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Link from "next/link";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey:["analytics"], queryFn: async()=> (await analyticsService.dashboard()).data.data });
  const dist = data?.distribution || [];
  const total = data?.summary?.total || 0;
  const avg = Math.round(data?.summary?.averageRisk || 0);
  const count = (name:string) => dist.find((x:any)=>x.classification===name)?.count || 0;
  if (isLoading) return <main className="p-6">Loading dashboard...</main>;
  if (error) return <main className="p-6 text-red-400">Unable to load dashboard. Check that the API is running.</main>;
  return <main className="p-6">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-1 text-slate-400">Overview of analyzed account risk.</p></div><Link href="/dashboard/analysis/new" className="rounded-xl bg-[#F4A91C] px-5 py-3 font-bold text-black">+ New Analysis</Link></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Total Analyses" value={total}/><StatCard label="Genuine" value={count("GENUINE")}/><StatCard label="Suspicious" value={count("SUSPICIOUS")}/><StatCard label="High Risk" value={count("HIGH_RISK")}/><StatCard label="Likely Bots" value={count("LIKELY_BOT")}/>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5"><h2 className="font-bold">Risk Distribution</h2><div className="h-80"><ResponsiveContainer><PieChart><Pie data={dist} dataKey="count" nameKey="classification" outerRadius={110} label>{dist.map((_:any,i:number)=><Cell key={i}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div>
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5"><h2 className="font-bold">Average Risk Score</h2><div className="mt-10 text-7xl font-black text-[#F4A91C]">{avg}</div><p className="mt-3 text-slate-400">Average across your available analyses.</p></div>
    </div>
  </main>;
}
