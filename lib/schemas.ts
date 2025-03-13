// lib/schemas.ts
import { z } from "zod";

// Flashcard schema: each flashcard contains a term and a definition.
export const flashcardSchema = z.object({
  term: z.string(),
  definition: z.string(),
});
export const flashcardsSchema = z.array(flashcardSchema);

// Question schema: each test question has a question, 4 options, and the correct answer.
export const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
});
export const questionsSchema = z.array(questionSchema);
