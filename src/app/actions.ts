'use server';

import { getQuranReferences } from '../services/llm';
import { fetchVerse } from '../services/api';

// Set max duration to 60 seconds (Vercel Pro/Hobby limits apply, but this helps)
// Note: Moved maxDuration to page/layout config as per Next.js requirements for Server Actions.

export interface MoodContent {
  surah: number;
  ayah: number;
  key: string;
  arabic: string;
  english: string;
  urdu: string;
}

export interface MoodResponse {
  message: string;
  verses: MoodContent[];
}

/**
 * Server Action to get content based on mood.
 * 1. Calls LLM to get references.
 * 2. Fetches verses in parallel.
 */
export async function getMoodContent(mood: string): Promise<MoodResponse> {
  console.log(`[Server Action] getMoodContent called for mood: ${mood}`);

  try {
    const llmResponse = await getQuranReferences(mood);
    const { message, references } = llmResponse;

    if (!references || references.length === 0) {
        console.warn("[Server Action] No references returned from LLM.");
        return { message: "I couldn't find specific verses right now, but I am here for you.", verses: [] };
    }

    // Fetch all verses in parallel
    const versePromises = references.map(async (ref) => {
        const verse = await fetchVerse(ref.surah, ref.ayah);
        if (!verse) return null;

        return {
            surah: ref.surah,
            ayah: ref.ayah,
            key: verse.key,
            arabic: verse.arabic,
            english: verse.english,
            urdu: verse.urdu
        };
    });

    const versesRaw = await Promise.all(versePromises);

    // Filter out any failed fetches (nulls) and return valid content
    const verses = versesRaw.filter((v): v is MoodContent => v !== null);

    console.log(`[Server Action] Returning ${verses.length} verses.`);
    return { message, verses };

  } catch (error: any) {
    console.error("[Server Action] Error in getMoodContent:", error);
    // Rethrow error so UI can display it
    throw new Error(error.message || "Failed to fetch content");
  }
}
