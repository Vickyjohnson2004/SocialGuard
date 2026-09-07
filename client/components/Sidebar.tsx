"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ScanSearch,
  Users,
  BarChart3,
  Database,
  ShieldAlert,
  Menu,
  X,
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-[#0d1426] p-5 md:block">
        <div className="mb-8 whitespace-nowrap text-xl font-bold">
          <span className="text-[#F4A91C]">Social</span>Guard AI
        </div>

        <nav className="space-y-2">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition ${
                isActive(href)
                  ? "bg-[#F4A91C]/10 text-[#F4A91C]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="shrink-0" size={18} />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* =========================
          MOBILE MENU BUTTON
      ========================== */}
      <div className="flex items-center border-b border-slate-800 bg-[#0d1426] p-3 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800 hover:text-white active:scale-95"
        >
          <Menu size={23} />
        </button>

        <div className="ml-3 text-lg font-bold">
          <span className="text-[#F4A91C]">Social</span>Guard AI
        </div>
      </div>

      {/* =========================
          MOBILE BACKDROP
      ========================== */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      {/* =========================
          MOBILE SIDEBAR
      ========================== */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] max-w-[85vw] flex-col border-r border-slate-800 bg-[#0d1426] p-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Mobile Sidebar Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="whitespace-nowrap text-xl font-bold">
            <span className="text-[#F4A91C]">Social</span>Guard AI
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
          >
            <X size={21} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="space-y-2 overflow-y-auto">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition ${
                isActive(href)
                  ? "bg-[#F4A91C]/10 text-[#F4A91C]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="shrink-0" size={18} />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
