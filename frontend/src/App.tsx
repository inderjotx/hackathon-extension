import "./App.css";
import { MCQQuestions } from "./components/MCQuestions";
import { useMCQ } from "./hooks/useMCQ";
import type { MCQQuestion } from "./types";
import { content } from "./test";

function App() {
  const { data, isLoading, error } = useMCQ(content);
  if (error) return <div>Error: {error.message}</div>;

  const questions = (data as MCQQuestion[] | undefined) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <div className="text-sm text-gray-600">
          Generating questions…{" "}
          {questions.length > 0 ? `(${questions.length} received)` : null}
        </div>
      )}
      {questions.length > 0 ? (
        <MCQQuestions questions={questions} />
      ) : (
        !isLoading && (
          <div className="text-sm text-gray-600">No questions yet.</div>
        )
      )}
    </div>
  );
}

export default App;
