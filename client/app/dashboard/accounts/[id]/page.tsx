"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/accounts";
export default function AccountDetail(){const {id}=useParams<{id:string}>();const {data,isLoading}=useQuery({queryKey:["account",id],queryFn:async()=>(await accountService.get(id)).data.data});if(isLoading)return <main className="p-6">Loading...</main>;return <main className="p-6"><h1 className="text-3xl font-bold">@{data?.username}</h1><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{["platform","followers","following","posts","accountAgeDays","postsPerDay","engagementRate","duplicateContentRatio","repetitiveContentScore","networkScore"].map(k=><div key={k} className="rounded-xl border border-slate-800 bg-[#111827] p-4"><p className="text-sm text-slate-400">{k}</p><p className="mt-2 text-2xl font-bold">{String(data?.[k])}</p></div>)}</div></main>}
