"use client";
import Link from "next/link";
import { LayoutDashboard, ScanSearch, Users, BarChart3, Database, ShieldAlert } from "lucide-react";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/dashboard/analysis/new", "New Analysis", ScanSearch],
  ["/dashboard/accounts", "Accounts", Users],
  ["/dashboard/analytics", "Analytics", BarChart3],
  ["/dashboard/datasets", "Datasets", Database],
  ["/dashboard/investigations", "Investigations", ShieldAlert]
] as const;

export function Sidebar() {
  return <aside className="hidden md:block w-64 border-r border-slate-800 bg-[#0d1426] p-5 min-h-screen">
    <div className="text-xl font-bold mb-8"><span className="text-[#F4A91C]">Social</span>Guard AI</div>
    <nav className="space-y-2">
      {links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">
        <Icon size={18}/>{label}
      </Link>)}
    </nav>
  </aside>;
}
