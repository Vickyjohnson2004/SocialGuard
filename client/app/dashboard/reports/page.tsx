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
    <main className="p-6">
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
      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="text-4xl font-black text-[#F4A91C]">{data?.total || 0}</p>
        <p className="mt-2 text-slate-400">analysis records ready for export</p>
      </div>
    </main>
  );
}
