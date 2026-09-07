import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Eye,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1020]">
      <div className="home-grid pointer-events-none absolute inset-0" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-tight sm:text-2xl">
          <span className="text-[#F4A91C]">Social</span>Guard{" "}
          <span className="text-slate-400">AI</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/login"
            className="px-2 py-2 text-sm text-slate-300 transition hover:text-white sm:px-3"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#F4A91C] px-3 py-2 text-sm font-bold text-black transition hover:bg-[#ffc14b] sm:px-4"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F4A91C]/30 bg-[#F4A91C]/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F4A91C]">
            <ShieldCheck size={15} /> Explainable risk intelligence
          </div>
          <h1 className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-4xl">
            See the signals behind suspicious social behavior.
          </h1>
          <p className="mt-5 max-w-1xl text-base leading-7 text-slate-200 sm:text-lg">
            SocialGuard turns authorized account metadata into clear, reviewable
            risk intelligence so your team can investigate with context and
            confidence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F4A91C] px-5 py-3 font-bold text-black transition hover:bg-[#ffc14b]"
            >
              Start an analysis <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-slate-500"
            >
              Explore dashboard
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F4A91C]" /> Transparent
              indicators
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#F4A91C]" /> Built for
              human review
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="home-panel relative rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Account assessment
                </p>
                <p className="mt-1 font-bold">@northstar_media</p>
              </div>
              <span className="rounded-full bg-[#F4A91C]/15 px-3 py-1 text-xs font-bold text-[#F4A91C]">
                Review needed
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-5 py-6 sm:gap-7">
              <div className="grid size-28 place-items-center rounded-full border-[10px] border-[#F4A91C] border-r-slate-700 border-b-slate-700 sm:size-36">
                <div className="text-center">
                  <p className="text-3xl font-black sm:text-4xl">72</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    risk score
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Signal confidence</span>
                    <span>High</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-[82%] rounded-full bg-[#F4A91C]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Activity pattern</span>
                    <span>Unusual</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-[68%] rounded-full bg-rose-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Posting velocity", "Follower ratio", "Profile age"].map(
                (label, index) => (
                  <div key={label} className="rounded-lg bg-slate-900/80 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-bold">
                      {["4.8x baseline", "Low", "14 days"][index]}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] p-3 shadow-2xl sm:flex">
            <div className="grid size-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Latest scan</p>
              <p className="text-sm font-bold">18 signals explained</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-4 px-5 pb-16 sm:grid-cols-3 sm:px-8 lg:px-10 lg:pb-24">
        {[
          {
            icon: ShieldCheck,
            title: "Risk scoring",
            text: "Prioritize accounts with a score built from observable behavior signals.",
          },
          {
            icon: Eye,
            title: "Explainable findings",
            text: "Trace every assessment back to the indicators your team can review.",
          },
          {
            icon: Activity,
            title: "Investigation-ready",
            text: "Move from a pattern to a focused investigation without losing context.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="home-panel rounded-xl p-5">
            <Icon size={20} className="text-[#F4A91C]" />
            <h2 className="mt-5 text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
