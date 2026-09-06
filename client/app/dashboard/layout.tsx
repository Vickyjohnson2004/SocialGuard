import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen"><Sidebar/><div className="min-w-0 flex-1"><Topbar/>{children}</div></div>;
}
