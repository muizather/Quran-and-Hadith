# Qalb-e-Saleem: Technical Architecture

This document provides a comprehensive technical overview of the Qalb-e-Saleem application.

## 1. High-Level Overview

Qalb-e-Saleem is a **Serverless Web Application** built with **Next.js 14 (App Router)**. It functions as a dynamic interface between the user's emotional state and authentic Islamic content repositories.

**Core Concept:**
`User Emotion` -> `AI Analysis (LLM)` -> `Structured References (Surah:Ayah)` -> `Content Fetching (Quran API)` -> `UI Display`

## 2. Technical Stack

-   **Framework:** Next.js 14 (App Router, Server Actions)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (v3)
-   **AI/LLM:** Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` SDK
-   **Data Sources:**
    -   **Quran.com API V4:** For authentic Uthmani text and translations.
    -   **HadithEnc:** (Integrated in service layer) for Hadith content.
-   **Deployment:** Vercel (Serverless Functions)

## 3. Data Flow & Logic

### A. The "Mood Jar" Flow

1.  **User Interaction:** User clicks a mood (e.g., "Anxiety") in `MoodJar.tsx` (Client Component).
2.  **Server Action:** `getMoodContent("Anxiety")` is called in `src/app/actions.ts`.
    -   This function runs entirely on the server.
3.  **LLM Resolution:**
    -   The action calls `getQuranReferences("Anxiety")` from `src/services/llm.ts`.
    -   The `LLMProvider` (Google Gemini) receives a prompt: *"User is feeling Anxiety. Provide 3 relevant verses."*
    -   **Output:** The LLM returns a strictly formatted JSON array: `[{ surah: 2, ayah: 286 }, ...]`.
4.  **Content Hydration (Parallel Fetching):**
    -   The server iterates through the references and calls `fetchVerse(surah, ayah)` for each.
    -   These requests are executed in **parallel** (`Promise.all`) for performance.
5.  **API Integration:**
    -   `fetchVerse` calls `https://api.quran.com/api/v4/verses/by_key/...`.
    -   **Caching:** This request is cached by Next.js for **24 hours** (`revalidate: 86400`). If another user asks for 2:286, it is served from the Data Cache instantly.
6.  **Response:** The fully hydrated content (Arabic, English, Urdu) is returned to the Client Component and rendered.

### B. "Talk to Me" (Chat) Flow

1.  **Input:** User types a sentence in `ChatInterface.tsx`.
2.  **Process:** The same `getMoodContent` action is reused (or a dedicated chat action).
3.  **Analysis:** The LLM analyzes the *sentence* semantics to find relevant verses.
4.  **Display:** Results are displayed in a chat bubble.

## 4. Key Components

### `src/services/api.ts`
-   **Purpose:** The single source of truth for external API calls.
-   **Features:**
    -   Handles `text_uthmani_simple` fetching for correct font rendering.
    -   Strips HTML tags from translations (cleaning data).
    -   Implements Next.js `fetch` caching strategies.

### `src/services/llm/`
-   **Pattern:** Factory/Provider Pattern.
-   **Files:**
    -   `factory.ts`: Decides which AI to use (Google vs OpenAI) based on API keys.
    -   `google.ts`: Implementation for Google Gemini.
    -   `openai.ts`: Implementation for OpenAI (fallback).
-   **Why?** Allows hot-swapping AI providers without changing the application logic.

### `src/app/actions.ts`
-   **Role:** The Controller. Orchestrates the flow between the UI, the LLM, and the Data API.
-   **Configuration:** Sets `maxDuration` (via page config) to ensure LLM requests don't time out.

## 5. Caching & Performance

-   **Verse Caching:** Once a verse (e.g., 2:286) is fetched, it is stored in the Vercel Data Cache. Subsequent requests for this verse (even from different users/moods) do not hit the Quran.com API.
-   **LLM Responses:** Currently **uncached** to allow for dynamic conversation. (See "Future Improvements").

## 6. Known Behaviors & "Sameness" Issue

**Why do I get the same verses?**
Large Language Models (LLMs) are probabilistic but tend to converge on the "highest probability" answers. For a broad prompt like "Verses for Anxiety", Surah 2:286 and Surah 94:6 are statistically the most relevant/cited verses. Therefore, the AI selects them repeatedly because they are the "best" fit.

**Solution Strategy (Implemented/Planned):**
To introduce variety, we must explicitly instruct the AI to:
1.  Vary its selection.
2.  Use a higher "Temperature" (randomness setting).
3.  Potentially "seed" the request with a random aspect (e.g., "Focus on patience" vs "Focus on reward").
