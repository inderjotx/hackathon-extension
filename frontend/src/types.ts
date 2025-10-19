import type { User, Session } from "better-auth";

export interface MCQQuestion {
    question: string;
    options: string[];
    correctOption: number;
    explanation: string;
}

// Define difficulty enum to match backend
export const Difficulty = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
} as const;


export type SessionUser = {
    data: {
        user: User & {
            numberOfQuestions: number;
            difficulty: Difficulty;
        },
        session: Session
    }
}


export type Difficulty = typeof Difficulty[keyof typeof Difficulty];