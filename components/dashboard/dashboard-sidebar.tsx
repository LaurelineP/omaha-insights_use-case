import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from "../ui/sidebar";

export default function DashboardSidebar(){
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>Section 1</SidebarGroup>
                <SidebarGroup>Section 2</SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

