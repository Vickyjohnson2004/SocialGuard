"use client";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
export function Topbar({ name }: { name?: string }) {
  const router = useRouter();
  return <header className="h-16 border-b border-slate-800 flex items-center justify-between px-5">
    <div className="text-sm text-slate-400">Intelligent social risk monitoring</div>
    <div className="flex items-center gap-4">
      <span className="text-sm">{name || "User"}</span>
      <button onClick={async () => { await authService.logout(); router.push("/login"); }} className="rounded-lg border border-slate-700 px-3 py-2 text-sm">Logout</button>
    </div>
  </header>;
}
