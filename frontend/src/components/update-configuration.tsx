import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Difficulty } from "../types";
import { Spinner } from "./ui/spinner";
import { CircleCheck } from "lucide-react";

interface UpdateConfigurationProps {
  initialNumberOfQuestions?: number;
  initialDifficulty?: Difficulty;
}

export function UpdateConfiguration({
  initialNumberOfQuestions = 10,
  initialDifficulty = Difficulty.EASY,
}: UpdateConfigurationProps) {
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(
    initialNumberOfQuestions
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessButton, setShowSuccessButton] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    numberOfQuestions?: string;
    difficulty?: string;
  }>({});

  const validateForm = () => {
    const errors: { numberOfQuestions?: string; difficulty?: string } = {};

    if (!numberOfQuestions || numberOfQuestions < 1) {
      errors.numberOfQuestions = "Number of questions must be at least 1";
    } else if (numberOfQuestions > 50) {
      errors.numberOfQuestions = "Number of questions cannot exceed 50";
    }

    if (!difficulty) {
      errors.difficulty = "Please select a difficulty level";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setValidationErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/update-configuration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            numberOfQuestions,
            difficulty,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update configuration");
      }

      await response.json();
      setShowSuccessButton(true);

      setTimeout(() => {
        setShowSuccessButton(false);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyOptions = [
    {
      value: Difficulty.EASY,
      label: "Easy",
      description: "Basic understanding and recall",
    },
    {
      value: Difficulty.MEDIUM,
      label: "Medium",
      description: "Application and analysis",
    },
    {
      value: Difficulty.HARD,
      label: "Hard",
      description: "Evaluation and synthesis",
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Update Configuration
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Number of Questions */}
        <div className="space-y-2">
          <label
            htmlFor="numberOfQuestions"
            className="text-sm font-medium text-gray-700"
          >
            Number of Questions
          </label>
          <Input
            id="numberOfQuestions"
            type="number"
            min="5"
            max="10"
            value={numberOfQuestions}
            onChange={(e) =>
              setNumberOfQuestions(parseInt(e.target.value) || 1)
            }
            className={`w-full ${
              validationErrors.numberOfQuestions
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="Enter number of questions (1-50)"
            disabled={isLoading}
          />
          {validationErrors.numberOfQuestions && (
            <p className="text-sm text-red-600">
              {validationErrors.numberOfQuestions}
            </p>
          )}
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Difficulty Level
          </label>
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as Difficulty)}
            disabled={isLoading}
          >
            <SelectTrigger
              className={`w-full ${
                validationErrors.difficulty
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              {difficultyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.difficulty && (
            <p className="text-sm text-red-600">
              {validationErrors.difficulty}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {showSuccessButton ? (
          <div className=" pt-4">
            <Button className="bg-green-500 hover:bg-green-500 flex items-center justify-center gap-4 text-white w-full">
              <CircleCheck className="size-4" />
              Updated Successfully
            </Button>
          </div>
        ) : (
          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                  Updating...
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
