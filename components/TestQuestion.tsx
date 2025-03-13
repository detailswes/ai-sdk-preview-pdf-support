// components/TestQuestion.tsx
import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onSkip: () => void;
  isAnswered: boolean;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  options,
  correctAnswer,
  selectedAnswer,
  onAnswer,
  onNext,
  onSkip,
  isAnswered,
}) => {
  const handleSelect = (value: string) => {
    if (!isAnswered) {
      onAnswer(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-medium mb-4 text-gray-800">{question}</h3>
      
      <RadioGroup.Root
        value={selectedAnswer || ""}
        onValueChange={handleSelect}
        className="space-y-3 mb-6"
      >
        {options.map((option, idx) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selectedAnswer;
          
          return (
            <RadioGroup.Item
              key={idx}
              value={option}
              disabled={isAnswered}
              className={cn(
                "w-full p-3 rounded-md flex items-center",
                "border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                !isAnswered && "hover:bg-gray-50",
                isAnswered && isCorrect && "bg-green-50 border-green-500",
                isAnswered && isSelected && !isCorrect && "bg-red-50 border-red-500"
              )}
            >
              <div className="flex items-center h-5">
                <div className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center",
                  isAnswered
                    ? isCorrect
                      ? "border-green-500"
                      : isSelected
                      ? "border-red-500"
                      : "border-gray-300"
                    : "border-gray-300"
                )}>
                  {isSelected && (
                    <RadioGroup.Indicator
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isAnswered
                          ? isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                          : "bg-blue-500"
                      )}
                    />
                  )}
                </div>
              </div>
              <span className="ml-3 text-gray-700">{option}</span>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      {isAnswered && (
        <div className="mt-4">
          {selectedAnswer === correctAnswer ? (
            <div className="text-green-600 font-medium">Correct! 🎉</div>
          ) : (
            <div className="text-red-600 font-medium">
              Incorrect. The correct answer is:{" "}
              <span className="font-bold">{correctAnswer}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onSkip}
          disabled={isAnswered}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Skip
        </button>
        <button
          onClick={onNext}
          disabled={!isAnswered}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md",
            "bg-blue-500 text-white hover:bg-blue-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default TestQuestion;