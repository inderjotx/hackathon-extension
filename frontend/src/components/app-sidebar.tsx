import { useState } from "react";
import { useQuestions } from "./questions-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { MCQGenerator } from "./MCQGenerator";
import { Button } from "./ui/button";

export function AppSidebar() {
  const [generateQuestions, setGenerateQuestions] = useState(false);

  return (
    <Sidebar side="right" variant="floating">
      <SidebarHeader>
        <h1 className="text-2xl font-bold font-cartograph text-center">
          Quiz <span className="text-indigo-700">*</span>{" "}
        </h1>
        <ProgressBar />
      </SidebarHeader>
      <SidebarContent>
        {generateQuestions ? (
          <MCQGenerator />
        ) : (
          <GenerateQuestionsButton onClick={() => setGenerateQuestions(true)} />
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const GenerateQuestionsButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="p-4 h-full flex items-center justify-center">
      <Button onClick={onClick} className="w-full">
        Generate Questions
      </Button>
    </div>
  );
};

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
