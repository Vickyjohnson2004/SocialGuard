"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/accounts";
import { analysisService } from "@/services/analysis";
export default function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["account", id],
    queryFn: async () => (await accountService.get(id)).data.data,
  });
  const { data: analyses } = useQuery({
    queryKey: ["account-analysis", id],
    queryFn: async () => (await analysisService.list({ limit: 100 })).data.data,
  });
  if (isLoading) return <main className="p-6">Loading...</main>;
  const analysis = analyses?.items?.find(
    (item: any) => (item.accountId?._id || item.accountId) === id,
  );
  if (!data)
    return <main className="p-6 text-red-400">Account not found.</main>;
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">@{data.username}</h1>
      <p className="mt-1 text-slate-400">
        {data.platform} account profile and detection evidence.
      </p>
      {analysis && (
        <div className="mt-6 rounded-2xl border border-[#F4A91C]/40 bg-[#111827] p-6">
          <p className="text-sm text-slate-400">Latest assessment</p>
          <div className="mt-2 flex flex-wrap items-end gap-5">
            <strong className="text-5xl text-[#F4A91C]">
              {analysis.riskScore}/100
            </strong>
            <span className="text-xl font-bold">{analysis.classification}</span>
            <span className="text-slate-400">
              {analysis.confidence}% confidence
            </span>
          </div>
          <ul className="mt-4 list-disc pl-5 text-slate-300">
            {analysis.reasons.map((reason: string) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "platform",
          "followers",
          "following",
          "posts",
          "accountAgeDays",
          "postsPerDay",
          "engagementRate",
          "duplicateContentRatio",
          "repetitiveContentScore",
          "networkScore",
        ].map((k) => (
          <div
            key={k}
            className="rounded-xl border border-slate-800 bg-[#111827] p-4"
          >
            <p className="text-sm text-slate-400">{k}</p>
            <p className="mt-2 text-2xl font-bold">{String(data[k])}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
