import { cn } from "@/lib/utils";
import { CheckIcon, X, XIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import type { MCQQuestion } from "@/types";
import { useQuestions } from "./questions-provider";

export function Question({
  index,
  question,
  options,
  correctOption,
}: MCQQuestion & { index: number }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { answerQuestion, isChecked } = useQuestions();
  const questionIndex = index;

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    answerQuestion(questionIndex, optionIndex);
  };

  const correctClass = "bg-green-50 border border-green-400 p-1";
  const incorrectClass = "bg-red-50 border border-red-400 p-1";

  return (
    <div className="flex flex-col gap-2 justify-start font-wotfard ">
      <h3 className="text-base text-start text-indigo-700  text-[0.95rem]">
        <span className="font-cartograph">{questionIndex + 1}.</span> {question}
      </h3>
      <div className="flex flex-col gap-2 text-sm ">
        {options.map((option, optionIndex) => (
          <div
            key={`${question}-option-${optionIndex}`}
            className={cn(
              `flex  items-start gap-2 text-sm rounded-sm`,
              isChecked && optionIndex === correctOption && correctClass,
              isChecked &&
                selectedOption !== correctOption &&
                optionIndex === selectedOption &&
                incorrectClass
            )}
          >
            {isChecked && optionIndex === correctOption && (
              <div className="mt-0.5 bg-green-400 text-white rounded-sm flex items-center justify-center">
                <CheckIcon className="size-4 " />
              </div>
            )}
            {isChecked &&
              selectedOption !== correctOption &&
              optionIndex === selectedOption && (
                <div className="mt-0.5 bg-red-400 text-white rounded-sm flex items-center justify-center">
                  <XIcon className="size-4 " />
                </div>
              )}

            {(!isChecked ||
              (optionIndex !== correctOption &&
                optionIndex !== selectedOption)) && (
              <Checkbox
                disabled={isChecked}
                id={`${question}-${optionIndex}`}
                checked={selectedOption === optionIndex}
                onCheckedChange={() => handleAnswer(optionIndex)}
                className={cn("mt-0.5 cursor-pointer")}
              />
            )}
            <label
              htmlFor={`${question}-${optionIndex}`}
              className="text-start cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {/* {isChecked && explanation.trim().length > 0 && (
        <div className="border bg-indigo-50 border-indigo-400 p-0.5 rounded-sm text-sm  mt-2 ">
          {explanation}
        </div>
      )} */}
    </div>
  );
}
