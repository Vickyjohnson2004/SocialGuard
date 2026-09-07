"use client";
import { FormEvent, useState } from "react";
import { analysisService } from "@/services/analysis";
import { useRouter } from "next/navigation";

const initial = {
  platform: "X",
  username: "demo_account",
  followers: 100,
  following: 500,
  posts: 300,
  accountAgeDays: 30,
  hasProfilePicture: true,
  hasBio: true,
  hasWebsite: false,
  isVerified: false,
  averageLikes: 5,
  averageComments: 1,
  averageShares: 0,
  postsPerDay: 10,
  engagementRate: 1,
  duplicateContentRatio: 0.2,
  activeHours: 8,
  repetitiveContentScore: 20,
  networkScore: 20,
};

export default function NewAnalysis() {
  const [form, setForm] = useState<any>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();
  const set = (k: string, v: any) => setForm((x: any) => ({ ...x, [k]: v }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await analysisService.create(form);
      setResult(r.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Analysis failed");
    } finally {
      setBusy(false);
    }
  }
  const numeric = [
    "followers",
    "following",
    "posts",
    "accountAgeDays",
    "averageLikes",
    "averageComments",
    "averageShares",
    "postsPerDay",
    "engagementRate",
    "duplicateContentRatio",
    "activeHours",
    "repetitiveContentScore",
    "networkScore",
  ];
  return (
    <main className="page-shell">
      <h1 className="text-3xl font-bold">New Account Analysis</h1>
      <p className="mt-1 text-slate-400">Enter authorized account metadata.</p>
      <form
        onSubmit={submit}
        className="mt-7 grid max-w-5xl gap-4 rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-6 md:grid-cols-2"
      >
        <input
          className="field"
          placeholder="Platform"
          value={form.platform}
          onChange={(e) => set("platform", e.target.value)}
        />
        <input
          className="field"
          placeholder="Username"
          value={form.username}
          onChange={(e) => set("username", e.target.value)}
        />
        {numeric.map((k) => (
          <label key={k} className="text-sm text-slate-300">
            {k}
            <input
              className="field mt-1"
              type="number"
              step="any"
              value={form[k]}
              onChange={(e) => set(k, Number(e.target.value))}
            />
          </label>
        ))}
        {["hasProfilePicture", "hasBio", "hasWebsite", "isVerified"].map(
          (k) => (
            <label
              key={k}
              className="flex items-center gap-3 rounded-lg border border-slate-700 p-3"
            >
              <input
                type="checkbox"
                checked={form[k]}
                onChange={(e) => set(k, e.target.checked)}
              />
              {k}
            </label>
          ),
        )}
        {error && <p className="md:col-span-2 text-red-400">{error}</p>}
        <button
          disabled={busy}
          className="md:col-span-2 rounded-xl bg-[#F4A91C] p-3 font-bold text-black"
        >
          {busy ? "Analyzing..." : "Run Risk Analysis"}
        </button>
      </form>
      {result && (
        <section className="mt-6 max-w-5xl rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-6">
          <p className="text-sm text-slate-400">Classification</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            {result.analysis.classification}
          </h2>
          <div className="mt-4 text-5xl font-black text-[#F4A91C] sm:text-6xl">
            {result.analysis.riskScore}
            <span className="text-xl">/100</span>
          </div>
          <p className="mt-3 text-slate-400">
            Confidence: {result.analysis.confidence}%
          </p>
          <h3 className="mt-6 font-bold">Reasons</h3>
          <ul className="mt-2 list-disc pl-5 text-slate-300">
            {result.analysis.reasons.map((x: string) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-lg border border-slate-700 px-4 py-2"
          >
            Back to dashboard
          </button>
        </section>
      )}
    </main>
  );
}
