"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
export default function Analytics(){const {data,isLoading}=useQuery({queryKey:["analytics-page"],queryFn:async()=>(await analyticsService.dashboard()).data.data});if(isLoading)return <main className="p-6">Loading...</main>;return <main className="p-6"><h1 className="text-3xl font-bold">Analytics</h1><div className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-6"><h2 className="font-bold">Platform Distribution</h2><div className="h-96"><ResponsiveContainer><BarChart data={data?.platforms||[]}><XAxis dataKey="platform" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip/><Bar dataKey="count" fill="#F4A91C"/></BarChart></ResponsiveContainer></div></div></main>}
