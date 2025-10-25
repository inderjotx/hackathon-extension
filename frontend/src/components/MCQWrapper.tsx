import { CheckAnswers } from "@/components/check-answers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { QuestionProvider } from "@/components/questions-provider";
import { ReGenerateQuestions } from "@/components/check-answers";
import { ResultPanel } from "@/components/check-answers";

export function MCQWrapper() {
  return (
    <SidebarProvider defaultOpen={false}>
      <QuestionProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <CheckAnswers />
          <ReGenerateQuestions />
          <ResultPanel />
        </main>
      </QuestionProvider>
    </SidebarProvider>
  );
}
