import { NextResponse } from "next/server";
import { questionSchema, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { flashcards } = await request.json();

    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Create a multiple choice test based on the following flashcards. Each question should include one correct answer and three distractors.Total number of questions should be as much as the number of flashcards.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate test questions based on these flashcards.",
            },
            { type: "text", text: JSON.stringify(flashcards) },
          ],
        },
      ],
      schema: questionsSchema, // Corrected schema to handle an array of questions
      onFinish: ({ object }: { object: unknown }) => {
        const resValidation = questionsSchema.safeParse(object);
        if (!resValidation.success) {
          throw new Error(
            resValidation.error.errors.map((e) => e.message).join("\n")
          );
        }
      },
    });

    const textStreamResponse = await result.toTextStreamResponse();
    return new Response(textStreamResponse.body, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
