import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardProvider } from "@/context/dashboard.context";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <SidebarProvider
                style={
                    {
                    "--sidebar-width": "24rem",
                    "--sidebar-width-mobile": "24rem",
                    } as React.CSSProperties
                }
            >
                <DashboardSidebar />
                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>
        </DashboardProvider>
    )
}

