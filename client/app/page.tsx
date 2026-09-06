import Link from "next/link";

export default function Home() {
  return <main className="min-h-screen">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="text-2xl font-bold"><span className="text-[#F4A91C]">Social</span>Guard AI</div>
      <div className="flex gap-3"><Link href="/login" className="px-4 py-2">Login</Link><Link href="/register" className="rounded-xl bg-[#F4A91C] px-4 py-2 font-semibold text-black">Get Started</Link></div>
    </nav>
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-3xl">
        <div className="mb-5 inline-block rounded-full border border-[#F4A91C]/30 px-4 py-2 text-sm text-[#F4A91C]">Explainable social-risk intelligence</div>
        <h1 className="text-5xl font-black leading-tight md:text-7xl">Detect suspicious social media behavior with intelligent risk analysis.</h1>
        <p className="mt-6 text-lg text-slate-400">Analyze authorized account metadata, identify bot-like signals, investigate suspicious accounts, and visualize risk patterns from one secure dashboard.</p>
        <div className="mt-8 flex gap-4"><Link href="/register" className="rounded-xl bg-[#F4A91C] px-6 py-3 font-bold text-black">Start Analysis</Link><Link href="/login" className="rounded-xl border border-slate-700 px-6 py-3">Sign In</Link></div>
      </div>
    </section>
    <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
      {["Risk scoring", "Explainable signals", "Analytics"].map(x => <div key={x} className="rounded-2xl border border-slate-800 bg-[#111827] p-6"><h3 className="text-xl font-bold">{x}</h3><p className="mt-3 text-slate-400">Built around transparent, reviewable indicators rather than claims of absolute certainty.</p></div>)}
    </section>
  </main>;
}
