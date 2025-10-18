import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import type { MCQQuestion } from "@/types";
import { useQuestions } from "./questions-provider";

export function Question({
  index,
  question,
  options,
}: MCQQuestion & { index: number }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { answerQuestion } = useQuestions();
  const questionIndex = index;

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    answerQuestion(questionIndex, optionIndex);
  };

  return (
    <div className="flex flex-col gap-2 justify-start font-wotfard ">
      <h3 className="text-base text-start text-indigo-700  text-[0.95rem]">
        <span className="font-cartograph">{questionIndex + 1}.</span> {question}
      </h3>
      <div className="flex flex-col gap-2 text-sm ">
        {options.map((option, optionIndex) => (
          <div
            key={`${question}-option-${optionIndex}`}
            className="flex  items-start gap-2 text-sm"
          >
            <Checkbox
              id={`${question}-${optionIndex}`}
              checked={selectedOption === optionIndex}
              onCheckedChange={() => handleAnswer(optionIndex)}
              className="mt-0.5 cursor-pointer"
            />
            <label
              htmlFor={`${question}-${optionIndex}`}
              className="text-start cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
