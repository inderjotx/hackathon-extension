import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import App from "@/App.tsx";

export function AppSidebar() {
  return (
    <Sidebar side="right" variant="floating">
      <SidebarHeader />
      <SidebarContent>
        <App />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
