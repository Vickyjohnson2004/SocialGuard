"use client";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/accounts";
import { analysisService } from "@/services/analysis";
import Link from "next/link";
import { useState } from "react";
export default function Accounts() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["accounts", query],
    queryFn: async () =>
      (await accountService.list({ limit: 50, q: query })).data.data,
  });
  const { data: analysisData } = useQuery({
    queryKey: ["account-risks"],
    queryFn: async () => (await analysisService.list({ limit: 100 })).data.data,
  });
  const risks = new Map(
    (analysisData?.items || []).map((item: any) => [
      item.accountId?._id || item.accountId,
      item,
    ]),
  );
  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="mt-1 text-slate-400">
            Review imported accounts and their latest risk scores.
          </p>
        </div>
        <input
          className="field max-w-xs"
          placeholder="Search username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="p-4">Username</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Risk</th>
              <th className="p-4">Classification</th>
              <th className="p-4">Followers</th>
              <th className="p-4">Posts/day</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : (
              data?.items?.map((a: any) => {
                const risk: any = risks.get(a._id);
                return (
                  <tr key={a._id} className="border-b border-slate-800">
                    <td className="p-4">
                      <Link
                        href={`/dashboard/accounts/${a._id}`}
                        className="text-[#F4A91C]"
                      >
                        @{a.username}
                      </Link>
                    </td>
                    <td className="p-4">{a.platform}</td>
                    <td className="p-4 text-[#F4A91C]">
                      {risk ? `${risk.riskScore}/100` : "-"}
                    </td>
                    <td className="p-4">
                      {risk?.classification || "Not analyzed"}
                    </td>
                    <td className="p-4">{a.followers}</td>
                    <td className="p-4">{a.postsPerDay}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
