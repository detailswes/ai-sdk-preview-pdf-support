"use client";

import React, { useEffect, useState } from "react";
import Flashcard from "@/components/Flashcard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface FlashcardType {
  term: string;
  definition: string;
}

const FlashcardsPage = () => {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("flashcards");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setFlashcards(parsed);
      } catch (error) {
        console.error("Error parsing flashcards", error);
      }
    }
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleTurnIntoQuestions = () => {
    // Set a flag in localStorage to indicate we want to generate questions immediately
    localStorage.setItem("generateQuestionsImmediately", "true");
    // Navigate to the test page
    router.push("/test");
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">No flashcards found. Please upload a PDF first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Flashcards</h1>

      <div className="w-full max-w-2xl">
        <Flashcard
          term={flashcards[currentIndex].term}
          definition={flashcards[currentIndex].definition}
        />
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={flashcards.length <= 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="default" 
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleTurnIntoQuestions}
      >
        Turn these into questions
      </Button>
    </div>
  );
};

export default FlashcardsPage;