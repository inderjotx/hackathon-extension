import { createContext, useContext, useState } from "react";

interface Question {
  questionIndex: number;
  correctAnswer: number;
}

interface Answer {
  questionIndex: number;
  answer: number;
}

const QuestionsContext = createContext<{
  isChecked: boolean;
  totalQuestions: Question[];
  answers: Answer[];
  setTotalQuestions: (totalQuestions: Question[]) => void;
  answerQuestion: (questionIndex: number, answer: number) => void;
  clearAnswers: () => void;
  checkAnswers: () => void;
}>({
  totalQuestions: [],
  answers: [],
  isChecked: false,
  setTotalQuestions: () => {},
  answerQuestion: () => {},
  clearAnswers: () => {},
  checkAnswers: () => {},
});

export const QuestionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [totalQuestions, setTotalQuestions] = useState<Question[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [answers, setAnswers] = useState<
    { questionIndex: number; answer: number }[]
  >([]);

  const answerQuestion = (questionIndex: number, answer: number) => {
    const filteredAnswers = answers.filter(
      (a) => a.questionIndex !== questionIndex
    );
    const newAnswers = [...filteredAnswers, { questionIndex, answer }];
    setAnswers(newAnswers);
  };
  const clearAnswers = () => {
    setAnswers([]);
  };

  return (
    <QuestionsContext.Provider
      value={{
        totalQuestions,
        answers,
        setTotalQuestions,
        answerQuestion,
        clearAnswers,
        checkAnswers: () => setIsChecked(true),
        isChecked,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return useContext(QuestionsContext);
};
