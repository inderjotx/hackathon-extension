import { cn } from "@/lib/utils";
import { X, Check } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import type { MCQQuestion } from "@/types";

export function Question({
  index,
  question,
  options,
  correctOption,
  explanation,
}: MCQQuestion & { index: number }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const isCorrect = selectedOption === correctOption;
  const hasAttempted = selectedOption !== null;

  return (
    <div className="flex flex-col gap-2 justify-start">
      <h3 className="text-base  text-start">
        {index + 1}. {question}
      </h3>
      <div className="flex flex-col gap-2 ">
        {options.map((option, index) => (
          <div key={index} className="flex  items-start gap-2 text-sm">
            <Checkbox
              checked={selectedOption === index}
              className="mt-0.5"
              onCheckedChange={() => setSelectedOption(index)}
            />
            <label className="text-start" htmlFor={option}>
              {option}
            </label>
          </div>
        ))}
      </div>
      {hasAttempted && (
        <div
          className={cn(
            isCorrect
              ? "border border-green-500 bg-green-50 p-2 rounded-md text-green-500"
              : "border border-red-500 bg-red-50 p-2 rounded-md text-red-500",
            "flex gap-2 items-center "
          )}
        >
          {isCorrect ? <Check className="size-4" /> : <X className="size-4" />}
          <p className="text-sm">{explanation}</p>
        </div>
      )}
    </div>
  );
}
