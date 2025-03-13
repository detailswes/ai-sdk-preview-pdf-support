# Quizlet-like Flashcard Generator with AI SDK  

This project is a **Quizlet-style** app built with **Next.js 14 (App Router)** and the **Vercel AI SDK**, where users upload PDFs, and AI generates flashcards. The app is **session-based**, meaning no database is required.  

## ✨ Features  
✅ Upload PDF and generate flashcards dynamically  
✅ AI-powered question and answer extraction  
✅ Interactive flashcards with flip mode  


## 🔧 How to Use  

Clone the repository:  
```bash
git clone https://github.com/detailswes/ai-sdk-preview-pdf-support.git

```

Install dependencies:  
```bash
npm install
```

Set up environment variables:  
1. Create a `.env` file in the root directory.  
2. Add your API keys:  
   ```env
   GOOGLE_API_KEY=your_google_api_key
   ```

Run the development server:  
```bash
npm run dev
```

## 📂 Project Structure  

```
/app
 ├── api
 │   ├── upload/route.ts       # API route for PDF uploads
 │   ├── generate/route.ts     # AI-powered flashcard generation
 │
 ├── create/page.tsx          # Upload & generate flashcards
 ├── study/page.tsx           # Flashcard study mode
 ├── quiz/page.tsx            # Multiple-choice quiz (upcoming)
 │
 ├── components/
 │   ├── Flashcard.tsx         # Flashcard UI component
 │   ├── Timer.tsx             # Timed study mode
 │   ├── Quiz.tsx              # Quiz UI component
```

## 🧠 How It Works  
1. **Upload a PDF**: User uploads a document.  
2. **AI Processes It**: AI extracts text and generates flashcards.  
3. **Flashcards Appear**: Users study with flip/shuffle mode.  
4. **Take a Quiz** : Users test their knowledge.  