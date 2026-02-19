import DashboardSidebar from "@/components/ui/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}