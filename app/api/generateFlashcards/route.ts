// app/api/generateFlashcards/route.ts
import { NextResponse } from "next/server";
import { flashcardSchema, flashcardsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { files } = await request.json();
    const firstFile = files[0].data;

    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "system",
          content:
            "You are an educator. Your job is to take the content of a PDF document and convert it into a series of flashcards. Each flashcard should include a term and a concise definition.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate flashcards based on the following document.",
            },
            { type: "file", data: firstFile, mimeType: "application/pdf" },
          ],
        },
      ],
      schema: flashcardSchema,
      output: "array",
      onFinish: ({ object }: { object: unknown }) => {
        const resValidation = flashcardsSchema.safeParse(object);
        if (!resValidation.success) {
          throw new Error(
            resValidation.error.errors.map((e) => e.message).join("\n")
          );
        }
      },
    });
    const textStreamResponse = await result.toTextStreamResponse();
    console.log("textStreamResponse", textStreamResponse);
    return new Response(textStreamResponse.body, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
