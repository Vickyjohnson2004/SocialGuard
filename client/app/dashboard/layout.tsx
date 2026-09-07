import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden md:flex-row">
      <Sidebar />

      <div className="flex min-w-0 w-full flex-1 flex-col overflow-x-hidden">
        <Topbar />

        <main className="min-w-0 w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
