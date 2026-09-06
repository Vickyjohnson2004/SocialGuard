export function StatCard({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>;
}
