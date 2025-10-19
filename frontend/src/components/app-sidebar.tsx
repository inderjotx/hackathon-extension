import { useQuestions } from "./questions-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { MCQGenerator } from "./MCQGenerator";

export function AppSidebar() {
  return (
    <Sidebar side="right" variant="floating">
      <SidebarHeader>
        <h1 className="text-2xl font-bold font-cartograph text-center">
          Quiz <span className="text-indigo-700">*</span>{" "}
        </h1>
        <ProgressBar />
      </SidebarHeader>
      <SidebarContent>
        <MCQGenerator />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const getProgressWidth = (questionAnswered: number, totalQuestions: number) => {
  let width = (questionAnswered / totalQuestions) * 100;
  if (totalQuestions === 0) {
    width = 0;
  }
  if (questionAnswered == 0) {
    width = 0;
  }
  return width;
};

export const ProgressBar = () => {
  const { totalQuestions, answers } = useQuestions();
  const questionAnswered = answers.length;
  const width = getProgressWidth(questionAnswered, totalQuestions.length);

  return (
    <div
      className="progress-bar h-1 bg-gradient-to-r from-pink-500 to-indigo-700 rounded-sm"
      style={{
        width: width + "%",
      }}
    ></div>
  );
};
