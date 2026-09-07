"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  ScanSearch,
  Users,
  BarChart3,
  Database,
  ShieldAlert,
} from "lucide-react";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/dashboard/analysis/new", "New Analysis", ScanSearch],
  ["/dashboard/accounts", "Accounts", Users],
  ["/dashboard/analytics", "Analytics", BarChart3],
  ["/dashboard/datasets", "Datasets", Database],
  ["/dashboard/investigations", "Investigations", ShieldAlert],
  ["/dashboard/reports", "Reports", Database],
] as const;

export function Sidebar() {
  return (
    <>
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-[#0d1426] p-5 md:block">
        <div className="text-xl font-bold mb-8">
          <span className="text-[#F4A91C]">Social</span>Guard AI
        </div>
        <nav className="space-y-2">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <nav
        className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-slate-800 bg-[#0d1426] p-2 md:hidden"
        aria-label="Dashboard navigation"
      >
        {links.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
