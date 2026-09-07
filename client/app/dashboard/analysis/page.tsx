"use client";
import { useQuery } from "@tanstack/react-query";
import { analysisService } from "@/services/analysis";
export default function AnalysisHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: async () => (await analysisService.list()).data.data,
  });
  return (
    <main className="page-shell">
      <h1 className="text-3xl font-bold">Analysis History</h1>
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : data?.items?.length ? (
          data.items.map((x: any) => (
            <div
              key={x._id}
              className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <b>{x.classification}</b>
                <span className="text-[#F4A91C]">{x.riskScore}/100</span>
              </div>
              <p className="mt-2 text-slate-400">
                {x.accountId?.platform} / @{x.accountId?.username}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No analyses yet.</p>
        )}
      </div>
    </main>
  );
}
