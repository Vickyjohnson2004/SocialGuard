"use client";
import { useQuery } from "@tanstack/react-query";
import { analysisService } from "@/services/analysis";

export default function Reports() {
  const { data, isLoading } = useQuery({
    queryKey: ["report-analyses"],
    queryFn: async () => (await analysisService.list({ limit: 100 })).data.data,
  });
  function download() {
    const rows = data?.items || [];
    const header =
      "username,platform,riskScore,confidence,classification,reasons";
    const csv = [
      header,
      ...rows.map((item: any) => {
        const account = item.accountId || {};
        return [
          account.username,
          account.platform,
          item.riskScore,
          item.confidence,
          item.classification,
          `"${item.reasons.join("; ").replaceAll('"', '""')}"`,
        ].join(",");
      }),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "socialguard-analysis-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="mt-1 text-slate-400">
            Export the analysis results currently available to your account.
          </p>
        </div>
        <button
          onClick={download}
          disabled={isLoading || !data?.items?.length}
          className="rounded-lg bg-[#F4A91C] px-4 py-3 font-bold text-black"
        >
          Download CSV
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="dashboard-card p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Records ready
          </p>
          <p className="mt-3 text-3xl font-black text-[#F4A91C]">
            {data?.total || 0}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            analysis records ready for export
          </p>
        </div>
        <div className="dashboard-card p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Top risk
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {Math.max(
              ...(data?.items || []).map((item: any) => item.riskScore || 0),
              0,
            )}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            maximum score in the active dataset
          </p>
        </div>
        <div className="dashboard-card p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
            Export format
          </p>
          <p className="mt-3 text-3xl font-black text-emerald-400">CSV</p>
          <p className="mt-2 text-sm text-slate-400">
            clean, review-ready analysis snapshots
          </p>
        </div>
      </div>
    </main>
  );
}
