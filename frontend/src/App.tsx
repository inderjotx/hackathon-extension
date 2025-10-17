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
  const hasReceivedQuestions = questions.length > 0;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">MCQ Generator</h1>
      <div className="text-sm text-gray-600">
        Status: {isLoading ? "Loading..." : "Ready"}
      </div>
      {(isLoading || !hasReceivedQuestions) && <MCQSkeleton />}
      {questions.length > 0 ? (
        <MCQQuestions questions={questions} />
      ) : (
        <div className="text-sm text-gray-600">No questions yet.</div>
      )}
    </div>
  );
}

export default App;
