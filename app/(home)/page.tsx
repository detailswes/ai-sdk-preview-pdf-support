"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";

const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setErrorMessage(null);
    } else {
      setErrorMessage("Please select a valid PDF file");
    }
  }, []);

  const handleUpload = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a PDF file first");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    
    try {
      // Simulate progress updates
      setUploadProgress(30);
      
      // Read the file
      const reader = new FileReader();
      
      const readFile = new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
      });
      
      reader.readAsDataURL(file);
      const data = await readFile;
      
      setUploadProgress(60);

      const response = await fetch("/api/generateFlashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: [{ data }] }),
      });

      if (!response.ok) throw new Error("Failed to generate flashcards");

      const flashcards = await response.json();
      setUploadProgress(100);

      localStorage.setItem("flashcards", JSON.stringify(flashcards));
      router.push("/flashcards");
    } catch (error) {
      setErrorMessage("Failed to process PDF. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [file, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Transform PDFs into Flashcards
          </h1>
          <p className="text-muted-foreground">
            Upload your study material and get AI-powered flashcards instantly
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="pdf-upload"
              className="group relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-muted/50 transition-colors hover:border-primary hover:bg-muted/30"
            >
              <div className="flex flex-col items-center justify-center space-y-2 px-4">
                <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                <div className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to select PDF file"}
                </div>
                <span className="text-xs text-muted-foreground">
                  Maximum size: 5MB
                </span>
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="sr-only"
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="text-sm text-red-500 text-center">
              {errorMessage}
            </div>
          )}

          {/* Progress bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Generating your flashcards... {uploadProgress}%
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {isUploading ? (
              <>
                <span className="animate-spin inline-block size-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              "Generate Flashcards"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Home;