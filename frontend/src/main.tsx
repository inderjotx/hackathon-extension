import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { QuestionProvider } from "./components/questions-provider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <QuestionProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
          </main>
        </QuestionProvider>
      </SidebarProvider>
    </QueryClientProvider>
  </StrictMode>
);
