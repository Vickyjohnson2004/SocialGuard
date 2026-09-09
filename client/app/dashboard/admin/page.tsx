export default function Admin() {
  const stats = [
    {
      label: "User access",
      value: "2 accounts",
      hint: "Admin + standard user",
    },
    {
      label: "Policy status",
      value: "Active",
      hint: "Role-based controls enabled",
    },
    {
      label: "Mitigation actions",
      value: "6 queued",
      hint: "High-risk review items",
    },
  ];

  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4A91C]">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold">System controls</h1>
          <p className="mt-2 text-slate-400">
            Administrative controls are protected by backend RBAC.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="dashboard-card p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-black text-white">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="dashboard-card p-4 sm:p-5">
          <h2 className="font-bold">Security posture</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• JWT auth is enforced for all protected routes.</li>
            <li>• Admin-only tools remain behind role-aware permissions.</li>
            <li>
              • Risk scoring is limited to explainable signals and policy
              review.
            </li>
          </ul>
        </div>
        <div className="dashboard-card p-4 sm:p-5">
          <h2 className="font-bold">Operational checklist</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Review suspicious content patterns weekly.</li>
            <li>• Validate exported CSV reports before external sharing.</li>
            <li>
              • Confirm account access remains limited to admin and standard
              user roles.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
