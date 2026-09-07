"use client";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
export function Topbar({ name }: { name?: string }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-slate-800 bg-[#0b1020]/95 px-4 py-3 backdrop-blur sm:px-5">
      <div className="truncate text-xs text-slate-400 sm:text-sm">
        Intelligent social risk monitoring
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="hidden text-sm sm:inline">{name || "User"}</span>
        <button
          onClick={async () => {
            await authService.logout();
            router.push("/login");
          }}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs transition hover:border-slate-500 sm:text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
