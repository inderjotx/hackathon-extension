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

  const allQuestionsAttempted = answers.length === totalQuestions.length;

  const textColor = height > 50 ? "text-white" : "text-foreground";

  const handleCheckAnswers = () => {
    if (isChecked) return;
    if (!allQuestionsAttempted) return;
    checkAnswers();
  };

  if (!open) return null;

  return (
    <div className="fixed top-4  right-[calc(var(--sidebar-width)+3rem)] font-cartograph">
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
