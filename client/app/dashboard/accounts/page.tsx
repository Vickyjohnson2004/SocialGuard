"use client";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/accounts";
import Link from "next/link";
export default function Accounts() {
  const {data,isLoading}=useQuery({queryKey:["accounts"],queryFn:async()=>(await accountService.list({limit:50})).data.data});
  return <main className="p-6"><h1 className="text-3xl font-bold">Accounts</h1><div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]"><table className="w-full text-left"><thead><tr className="border-b border-slate-800 text-slate-400"><th className="p-4">Username</th><th className="p-4">Platform</th><th className="p-4">Followers</th><th className="p-4">Posts/day</th></tr></thead><tbody>{isLoading?<tr><td className="p-4" colSpan={4}>Loading...</td></tr>:data?.items?.map((a:any)=><tr key={a._id} className="border-b border-slate-800"><td className="p-4"><Link href={`/dashboard/accounts/${a._id}`} className="text-[#F4A91C]">@{a.username}</Link></td><td className="p-4">{a.platform}</td><td className="p-4">{a.followers}</td><td className="p-4">{a.postsPerDay}</td></tr>)}</tbody></table></div></main>;
}
