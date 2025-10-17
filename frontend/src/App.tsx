import "./App.css";
import { MCQQuestions } from "./components/MCQuestions";
import { MCQSkeleton } from "./components/MCQSkeleton";
import { useMCQ } from "./hooks/useMCQ";
import type { MCQQuestion } from "./types";
import { content } from "./test";

function App() {
  const { data, isLoading, error } = useMCQ(content);
  if (error) return <div>Error: {error.message}</div>;

  const questions = (data as MCQQuestion[] | undefined) ?? [];
  const hasQuestions = questions.length > 0;

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <h1 className="text-xl font-bold">Quiz</h1>
      {isLoading && !hasQuestions && <MCQSkeleton />}
      {hasQuestions && <MCQQuestions questions={questions} />}
    </div>
  );
}

export default App;
