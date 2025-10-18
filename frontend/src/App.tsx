import "./App.css";
import { MCQQuestions } from "./components/MCQuestions";
import { useEffect } from "react";
import { MCQSkeleton } from "./components/MCQSkeleton";
import { useMCQ } from "./hooks/useMCQ";
import type { MCQQuestion } from "./types";
import { content } from "./test";
import { useQuestions } from "./components/questions-provider";

function App() {
  const { data, isLoading, error } = useMCQ(content);
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

export default App;
