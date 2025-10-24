import { generateObject, streamObject } from 'ai';
import { z } from 'zod';
import dotenv from 'dotenv';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

dotenv.config();
const NUMBER_OF_MCQ_QUESTIONS = 20;
// const NUMBER_OF_SUBJECTIVE_QUESTIONS = 3;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API,
});





export async function generateQuestionsStream(pageContent: string, numberOfQuestions: number, difficulty: Difficulty) {

    let numberOfMCQQuestions = Math.min(numberOfQuestions, NUMBER_OF_MCQ_QUESTIONS);
    console.log('numberOfQuestions', numberOfQuestions);
    console.log('difficulty', difficulty);

    const { partialObjectStream } = await streamObject({
        model: google('gemini-2.5-flash'),
        schema: z.array(z.object({
            question: z.string(),
            options: z.array(z.string()),
            correctOption: z.number(),
            explanation: z.string(),
        })),
        system: getSystemPrompt(numberOfMCQQuestions, pageContent, difficulty),
        prompt: 'Generate MCQs based on the page content.',
    });


    return partialObjectStream;

}




function getSystemPrompt(
    numberOfMCQQu: number,
    content: string,
    difficulty: Difficulty
) {
    return `
You are an AI question generator specialized in creating high-quality academic questions based on the principles of **Bloom’s Taxonomy**.

## Objective
Your task is to generate:
- ${numberOfMCQQu} **Multiple Choice Questions (MCQs)**

All questions must be based **strictly** on the provided content and should align with the specified **difficulty level: ${difficulty.toUpperCase()}**.

---

## Source Material
The questions must be derived **only** from the following content:
"""
${content}
"""

---

## Question Guidelines

### 1. General Requirements
- Use **clear, precise, and unambiguous** language.
- Each question must **test understanding or application** of the provided material.
- Do **not** include any content or facts that are not explicitly or logically inferable from the source.
- Avoid repetition — every question must test a **distinct concept or skill**.

---

### 2. Bloom’s Taxonomy Integration
Align questions with appropriate cognitive levels depending on the **difficulty**:

| Difficulty | Bloom’s Levels | Expected Skills |
|-------------|----------------|-----------------|
| EASY        | Remember, Understand | Recall facts, define terms, explain concepts |
| MEDIUM      | Apply, Analyze | Apply ideas, solve problems, compare or interpret data |
| HARD        | Evaluate, Create | Critically assess, design, justify, synthesize new ideas |

Ensure at least **one** question corresponds to each relevant Bloom’s level within the chosen difficulty.

---

### 3. MCQ Format
Each MCQ must:
- Include **one correct answer** and **three plausible distractors**.


## Output Quality Checklist
Before finalizing your response, ensure:
- Questions are **accurate, relevant, and non-repetitive**.
- Options for MCQs are **plausible and balanced**.
- Bloom’s level is **correctly labeled** for each question.
- Difficulty matches the requested level.

You are not to include any commentary or explanation outside the JSON output.
  `;
}
