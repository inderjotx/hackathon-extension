import { cn } from "@/lib/utils";
import { useQuestions } from "./questions-provider";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

const getProgressHeight = (
  questionAnswered: number,
  totalQuestions: number
) => {
  let height = (questionAnswered / totalQuestions) * 100;
  if (totalQuestions === 0) {
    height = 0;
  }
  if (questionAnswered == 0) {
    height = 0;
  }
  return height;
};

export const CheckAnswers = () => {
  const { answers, totalQuestions, checkAnswers, isChecked } = useQuestions();
  const height = getProgressHeight(answers.length, totalQuestions.length);

  const { open } = useSidebar();

  const allQuestionsAttempted =
    answers.length === totalQuestions.length && answers.length > 0;

  const textColor = height > 50 ? "text-white" : "text-foreground";

  const handleCheckAnswers = () => {
    if (isChecked) return;
    if (!allQuestionsAttempted) return;
    checkAnswers();
  };

  if (!open) return null;

  return (
    <div className="fixed top-4  animate-slider-from-right   right-[calc(var(--sidebar-width)+3rem)] font-cartograph">
      <Button
        className="bg-transparent border cursor-pointer text-foreground hover:bg-transparent relative overflow-hidden z-[1000]"
        disabled={!allQuestionsAttempted || isChecked}
        onClick={handleCheckAnswers}
      >
        <span className={`z-10 ${textColor}`}>Test</span>
        <div
          className="absolute bottom-0 inset-x-0 bg-indigo-600 transition-all duration-300"
          style={{ height: `${height}%` }}
        />
      </Button>
    </div>
  );
};

export const ReGenerateQuestions = () => {
  const { isChecked, resetQuiz } = useQuestions();
  const { open } = useSidebar();

  if (!isChecked || !open) return null;

  return (
    <div className="fixed top-88 animate-slider-from-right    right-[calc(var(--sidebar-width)+0.5rem)] font-cartograph">
      <Button onClick={resetQuiz}>
        <span>Regenerate</span>
      </Button>
    </div>
  );
};

export const ResultPanel = () => {
  const { answers, totalQuestions, isChecked } = useQuestions();
  const { open } = useSidebar();

  if (!isChecked || !open) return null;

  const totalQuestionsCount = totalQuestions.length;
  const correctAnswerCount = answers.filter(
    (answer) =>
      answer.answer === totalQuestions[answer.questionIndex].correctAnswer
  ).length;

  return (
    <div className="fixed top-16 animate-slider-from-right border  border-accent right-[calc(var(--sidebar-width)+0.5rem)] font-cartograph bg-white p-4 rounded-md shadow-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-center text-primary">Result</h2>
        <ResultDiagram
          correctAnswerCount={correctAnswerCount}
          totalQuestionsCount={totalQuestionsCount}
        />
      </div>
    </div>
  );
};

const ResultDiagram = ({
  correctAnswerCount,
  totalQuestionsCount,
}: {
  correctAnswerCount: number;
  totalQuestionsCount: number;
}) => {
  const gap = 7;
  const correctAnswerPercentage =
    (correctAnswerCount / totalQuestionsCount) * 100;
  const incorrectAnswerPercentage = 100 - correctAnswerPercentage;

  return (
    <svg width={200} height={200} viewBox="0 0 200 200">
      {/* Base circle (gray background) */}
      <circle
        cx={100}
        cy={100}
        r={80}
        fill="none"
        strokeWidth={10}
        pathLength={100}
        className="stroke-gray-50"
      />

      {/* Correct answers (green arc) */}
      <circle
        cx={100}
        cy={100}
        r={80}
        fill="none"
        strokeWidth={10}
        pathLength={100}
        strokeLinecap="round"
        className="origin-center -rotate-90 stroke-green-500  animate-drawing"
        strokeDasharray={`${correctAnswerPercentage - gap / 2}, 1000`}
        style={
          {
            "--stroke-dashoffset-from": `${correctAnswerPercentage + gap / 2}`,
          } as React.CSSProperties
        }
      />

      {/* Incorrect answers (red arc) */}
      <circle
        cx={100}
        cy={100}
        r={80}
        fill="none"
        strokeWidth={10}
        pathLength={100}
        strokeLinecap="round"
        className={cn(
          "origin-center -rotate-90 stroke-red-500 animate-drawing"
        )}
        strokeDasharray={`${incorrectAnswerPercentage - gap / 2}, 1000`}
        style={
          {
            "--duration": "1.2s",
            "--stroke-dashoffset-from": `${
              incorrectAnswerPercentage + gap / 2
            }`,
            "--stroke-dashoffset-to": `${-correctAnswerPercentage}`,
          } as React.CSSProperties
        }
      />
      <text
        x={100}
        y={100}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-wotfard text-3xl fill-primary"
      >
        {correctAnswerCount} / {totalQuestionsCount}
      </text>
    </svg>
  );
};
