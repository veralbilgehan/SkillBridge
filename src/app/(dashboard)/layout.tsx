import { AppSidebar } from "@/components/ui/app-sidebar";
import { DashboardTopbar } from "@/components/ui/dashboard-topbar";
import ContextHelpMenu from "@/components/ui/context-help-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <ContextHelpMenu />
    </div>
  );
}
