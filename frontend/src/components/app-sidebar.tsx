import { useState } from "react";
import { Difficulty } from "@/types";
import { useQuestions } from "./questions-provider";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { MCQGenerator } from "./MCQGenerator";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export function AppSidebar() {
  const { generateQuestions, setGenerateQuestions } = useQuestions();
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");

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
          <MCQGenerator
            numberOfQuestions={numberOfQuestions}
            difficulty={difficulty as Difficulty}
          />
        ) : (
          <GenerateQuestionsButton
            onClick={() => setGenerateQuestions(true)}
            numberOfQuestions={numberOfQuestions}
            difficulty={difficulty as Difficulty}
            setNumberOfQuestions={setNumberOfQuestions}
            setDifficulty={setDifficulty}
          />
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const GenerateQuestionsButton = ({
  onClick,
  numberOfQuestions,
  difficulty,
  setNumberOfQuestions,
  setDifficulty,
}: {
  onClick: () => void;
  numberOfQuestions: number;
  difficulty: Difficulty;
  setNumberOfQuestions: (numberOfQuestions: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}) => {
  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="numberOfQuestions">Number of Questions</Label>
        <Input
          id="numberOfQuestions"
          type="number"
          min="5"
          max="20"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 10)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as Difficulty)}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onClick} className="w-full font-cartograph">
        <Sparkles className="size-4 text-accent" />
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
