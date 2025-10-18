import { Question } from "./Question";
import type { MCQQuestion } from "@/types";

export function MCQQuestions({ questions }: { questions: MCQQuestion[] }) {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {questions.map((question, index) => (
        <Question
          index={index}
          key={`${question?.question}-${index}`}
          {...question}
        />
      ))}
    </div>
  );
}
