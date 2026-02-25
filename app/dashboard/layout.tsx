"use client"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardProvider } from "@/context/dashboard.context";
import { useIsMobile } from "@/hooks/use-mobile";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile()
    
    return (
        <DashboardProvider>
            <SidebarProvider
                style={
                    {
                    "--sidebar-width": "24rem",
                    "--sidebar-width-mobile": "80dvw",
                    } as React.CSSProperties
                }
            >
                <DashboardSidebar />
                {isMobile && (
                    <SidebarTrigger className="fixed top-4 left-4 z-50 shadow hover:bg-transparent bg-primary p-5 rounded-4xl text-primary-foreground" />
                )}

                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>
        </DashboardProvider>
    )
}

