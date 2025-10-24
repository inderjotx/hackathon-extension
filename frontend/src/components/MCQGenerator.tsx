import { MCQQuestions } from "@/components/MCQuestions";
import { useEffect } from "react";
import { MCQSkeleton } from "@/components/MCQSkeleton";
import { useMCQ } from "@/hooks/useMCQ";
import type { MCQQuestion, Difficulty } from "@/types";
import { useMemo } from "react";
import { useQuestions } from "@/components/questions-provider";

function extractPageContent() {
  const title = document.title;
  const url = window.location.href;
  const bodyContent =
    (document.body as HTMLElement).innerText ||
    (document.body as HTMLElement).textContent ||
    "";

  return {
    title,
    url,
    content: bodyContent.trim(),
  };
}

interface MCQGeneratorProps {
  numberOfQuestions: number;
  difficulty: Difficulty;
}

export function MCQGenerator({
  numberOfQuestions,
  difficulty,
}: MCQGeneratorProps) {
  const { content } = useMemo(
    () => extractPageContent(),
    [window.location.href]
  );

  const { data, isLoading, error } = useMCQ(
    content,
    numberOfQuestions,
    difficulty
  );
  const questions = (data as MCQQuestion[] | undefined) ?? [];
  const hasQuestions = questions.length > 0;
  const { setTotalQuestions, clearAnswers } = useQuestions();

  useEffect(() => {
    if (isLoading) return;
    setTotalQuestions(
      questions.map((question, index) => ({
        questionIndex: index,
        correctAnswer: question.correctOption,
      }))
    );
  }, [isLoading, setTotalQuestions, clearAnswers]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 p-4 ">
      {isLoading && !hasQuestions && <MCQSkeleton />}
      {hasQuestions && <MCQQuestions questions={questions} />}
    </div>
  );
}
