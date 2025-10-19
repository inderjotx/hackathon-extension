import { CheckAnswers } from "@/components/check-answers";
import "../index.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { QuestionProvider } from "@/components/questions-provider";

export function MCQWrapper() {
  return (
    <SidebarProvider>
      <QuestionProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <CheckAnswers />
        </main>
      </QuestionProvider>
    </SidebarProvider>
  );
}
