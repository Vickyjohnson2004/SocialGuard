"use client";
import { useState } from "react";
import { datasetService } from "@/services/datasets";
type DatasetResult = {
  username: string;
  platform: string;
  riskScore: number;
  confidence: number;
  classification: string;
  reasons: string[];
};

export default function Datasets() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<DatasetResult[]>([]);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setMessage("");
    setResults([]);
    try {
      const r = await datasetService.upload(file);
      setMessage(
        `${r.data.message}: ${r.data.data.rowsProcessed} accounts analyzed.`,
      );
      setResults(r.data.data.results || []);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Datasets</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="text-slate-400">
          Upload a CSV containing authorized account metadata.
        </p>
        <input
          className="mt-5 block"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={upload}
          disabled={!file || busy}
          className="mt-5 rounded-lg bg-[#F4A91C] px-5 py-3 font-bold text-black"
        >
          {busy ? "Processing..." : "Upload & Analyze"}
        </button>
        {message && <p className="mt-5 text-slate-300">{message}</p>}
      </div>
      {results.length > 0 && (
        <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-xl font-bold">Analysis Results</h2>
          <table className="mt-4 w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-3">Account</th>
                <th className="p-3">Classification</th>
                <th className="p-3">Risk</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Reasons</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={`${result.platform}-${result.username}`}
                  className="border-b border-slate-800"
                >
                  <td className="p-3">
                    {result.platform} / @{result.username}
                  </td>
                  <td className="p-3 font-bold">{result.classification}</td>
                  <td className="p-3 text-[#F4A91C]">{result.riskScore}/100</td>
                  <td className="p-3">{result.confidence}%</td>
                  <td className="p-3 text-slate-400">
                    {result.reasons.join(" ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
