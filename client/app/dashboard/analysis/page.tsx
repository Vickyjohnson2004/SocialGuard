"use client";
import { useQuery } from "@tanstack/react-query";
import { analysisService } from "@/services/analysis";
export default function AnalysisHistory(){const {data,isLoading}=useQuery({queryKey:["analyses"],queryFn:async()=>(await analysisService.list()).data.data});return <main className="p-6"><h1 className="text-3xl font-bold">Analysis History</h1><div className="mt-6 space-y-3">{isLoading?<p>Loading...</p>:data?.items?.map((x:any)=><div key={x._id} className="rounded-xl border border-slate-800 bg-[#111827] p-5"><div className="flex justify-between"><b>{x.classification}</b><span className="text-[#F4A91C]">{x.riskScore}/100</span></div><p className="mt-2 text-slate-400">{x.accountId?.platform} / @{x.accountId?.username}</p></div>)}</div></main>}
