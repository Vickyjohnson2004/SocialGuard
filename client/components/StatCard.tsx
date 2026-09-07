export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="dashboard-card min-w-0 p-4 transition sm:p-5">
      <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-3 text-3xl font-black ${accent ? "text-[#F4A91C]" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
