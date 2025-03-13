"use client";

import React, { useState, useEffect } from "react";
import TestQuestion from "@/components/TestQuestion";
import { Progress } from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface QuestionType {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface AnswerType {
  selectedAnswer?: string;
  isCorrect: boolean;
}

const TestPage = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Check if we should automatically generate questions
    const shouldGenerateQuestions = localStorage.getItem("generateQuestionsImmediately") === "true";
    if (shouldGenerateQuestions) {
      // Clear the flag
      localStorage.removeItem("generateQuestionsImmediately");
      // Generate questions
      handleGenerateTest();
    }
  }, []);

  const handleGenerateTest = async () => {
    const flashcardsStr = localStorage.getItem("flashcards");
    if (!flashcardsStr) {
      setError("No flashcards found. Please create some flashcards first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const flashcards = JSON.parse(flashcardsStr);
      const response = await fetch("/api/generateTest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcards }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const generatedQuestions = await response.json();
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill({
        selectedAnswer: undefined,
        isCorrect: false,
      }));
      setCurrentIndex(0);
      setScore(0);
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to generate test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    
    newAnswers[currentIndex] = {
      selectedAnswer: answer,
      isCorrect,
    };

    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
        {questions.length > 0 && (
          <div className="space-y-1 text-right">
            <p className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <Progress
              value={progress}
              className="h-2 bg-gray-100 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </Progress>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {questions.length > 0 ? (
            <TestQuestion
              question={questions[currentIndex].question}
              options={questions[currentIndex].options}
              correctAnswer={questions[currentIndex].correctAnswer}
              selectedAnswer={answers[currentIndex]?.selectedAnswer}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onSkip={handleSkip}
              isAnswered={!!answers[currentIndex]?.selectedAnswer}
            />
          ) : (
            <div className="text-center py-12">
              <button
                onClick={handleGenerateTest}
                disabled={loading}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium",
                  "bg-blue-500 text-white hover:bg-blue-600",
                  "transition-colors duration-150",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? "Generating Questions..." : "Start Quiz"}
              </button>
            </div>
          )}

          {currentIndex === questions.length - 1 && 
            answers[currentIndex]?.selectedAnswer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-6 bg-blue-50 rounded-lg text-center"
            >
              <h3 className="text-xl font-semibold mb-2">
                Quiz Complete! 🎉
              </h3>
              <p className="text-gray-700">
                Score: {score}/{questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </p>
              <button
                onClick={handleGenerateTest}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retake Quiz
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default TestPage;