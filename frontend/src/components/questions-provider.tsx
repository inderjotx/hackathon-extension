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
  totalQuestions: Question[];
  answers: Answer[];
  setTotalQuestions: (totalQuestions: Question[]) => void;
  answerQuestion: (questionIndex: number, answer: number) => void;
  clearAnswers: () => void;
}>({
  totalQuestions: [],
  answers: [],
  setTotalQuestions: () => {},
  answerQuestion: () => {},
  clearAnswers: () => {},
});

export const QuestionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [totalQuestions, setTotalQuestions] = useState<Question[]>([]);
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
