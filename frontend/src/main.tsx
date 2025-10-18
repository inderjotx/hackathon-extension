import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CheckAnswers } from "./components/check-answers";
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
            <CheckAnswers />
          </main>
        </QuestionProvider>
      </SidebarProvider>
    </QueryClientProvider>
  </StrictMode>
);
