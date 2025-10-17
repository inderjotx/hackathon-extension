import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import type { MCQQuestion } from "@/types";

export function Question({
  index,
  question,
  options,
}: MCQQuestion & { index: number }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2 justify-start">
      <h3 className="text-base text-start">
        {index + 1}. {question}
      </h3>
      <div className="flex flex-col gap-2 text-sm ">
        {options.map((option, index) => (
          <div key={index} className="flex  items-start gap-2 text-sm">
            <Checkbox
              id={option}
              checked={selectedOption === index}
              className="mt-0.5 cursor-pointer"
              onCheckedChange={() => setSelectedOption(index)}
            />
            <label htmlFor={option} className="text-start cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
