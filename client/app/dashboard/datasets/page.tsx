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
  const [error, setError] = useState("");

  function selectFile(nextFile: File | null) {
    setMessage("");
    setError("");
    setResults([]);
    if (!nextFile) {
      setFile(null);
      return;
    }
    if (!nextFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setError("Please select a CSV file.");
      return;
    }
    if (nextFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("The file must be smaller than 5 MB.");
      return;
    }
    setFile(nextFile);
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setMessage("");
    setError("");
    setResults([]);
    try {
      const r = await datasetService.upload(file);
      setMessage(
        `${r.data.message}: ${r.data.data.rowsProcessed} accounts analyzed.`,
      );
      setResults(r.data.data.results || []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          "Upload failed. Check the CSV format and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const template =
      "platform,username,followers,following,posts,accountAgeDays,hasProfilePicture,hasBio,hasWebsite,isVerified,averageLikes,averageComments,averageShares,postsPerDay,engagementRate,duplicateContentRatio,activeHours,repetitiveContentScore,networkScore\nX,example_account,100,250,50,365,true,true,false,false,10,1,0,2,2.5,0.05,8,10,10\n";
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([template], { type: "text/csv" }));
    link.download = "socialguard-dataset-template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const counts = results.reduce<Record<string, number>>((summary, result) => {
    summary[result.classification] = (summary[result.classification] || 0) + 1;
    return summary;
  }, {});

  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="mt-1 text-slate-400">
            Upload authorized account metadata and analyze every row for
            bot-like risk signals.
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-[#F4A91C]"
        >
          Download CSV template
        </button>
      </div>
      <div className="mt-6 max-w-2xl rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="text-slate-400">
          CSV files can contain 1–5,000 account rows and must include platform,
          username, followers, following, posts, accountAgeDays, postsPerDay,
          and engagementRate.
        </p>
        <input
          className="mt-5 block"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => selectFile(e.target.files?.[0] || null)}
        />
        {file && (
          <p className="mt-3 text-sm text-slate-400">
            Selected: {file.name} ({Math.ceil(file.size / 1024)} KB)
          </p>
        )}
        <button
          onClick={upload}
          disabled={!file || busy}
          className="mt-5 rounded-lg bg-[#F4A91C] px-5 py-3 font-bold text-black"
        >
          {busy ? "Processing..." : "Upload & Analyze"}
        </button>
        {message && <p className="mt-5 text-emerald-400">{message}</p>}
        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}
      </div>
      {results.length > 0 && (
        <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Analysis Results</h2>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span>Total: {results.length}</span>
              {Object.entries(counts).map(([name, count]) => (
                <span key={name}>
                  {name.replace("_", " ")}: {count}
                </span>
              ))}
            </div>
          </div>
          <table className="mt-4 w-full min-w-180 text-left text-sm">
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
