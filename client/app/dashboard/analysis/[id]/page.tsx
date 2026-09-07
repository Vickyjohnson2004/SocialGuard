"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { analysisService } from "@/services/analysis";
export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => (await analysisService.get(id)).data.data,
  });
  if (isLoading) return <main className="page-shell">Loading...</main>;
  return (
    <main className="page-shell">
      <h1 className="text-3xl font-bold">Analysis Result</h1>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-6">
        <div className="text-6xl font-black text-[#F4A91C] sm:text-7xl">
          {data?.riskScore}
          <span className="text-xl">/100</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
          {data?.classification}
        </h2>
        <p className="mt-2 text-slate-400">
          Confidence: {data?.confidence}% · Model: {data?.modelVersion}
        </p>
        <h3 className="mt-7 font-bold">Reasons</h3>
        <ul className="mt-2 list-disc pl-5">
          {data?.reasons?.map((x: string) => (
            <li key={x} className="wrap-break-word">
              {x}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
