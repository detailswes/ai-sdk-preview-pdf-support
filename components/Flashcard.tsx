"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FlashcardProps {
  term: string;
  definition: string;
  onNext?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ term, definition, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    console.log("term", term);
    console.log("definition", definition);
  }, [term, definition]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      {/* Flashcard */}
      <div
        className="relative w-full h-96 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front - Term */}
          <div
            className="absolute inset-0 w-full h-full bg-card border border-border rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-sm text-muted-foreground mb-2">TERM</div>
            <div className="text-2xl font-semibold text-foreground text-center">
              {term}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Click to reveal definition
            </div>
          </div>

          {/* Back - Definition */}
          <div
            className="absolute inset-0 w-full h-full bg-card border border-border rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-sm text-muted-foreground mb-2">DEFINITION</div>
            <div className="text-lg text-muted-foreground text-center">
              {definition}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Click to see term
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcard;
