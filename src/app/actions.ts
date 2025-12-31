'use server';

import { getQuranReferences } from '../services/llm';
import { fetchVerse } from '../services/api';

export interface MoodContent {
  surah: number;
  ayah: number;
  key: string;
  arabic: string;
  english: string;
  urdu: string;
}

/**
 * Server Action to get content based on mood.
 * 1. Calls LLM to get references.
 * 2. Fetches verses in parallel.
 */
export async function getMoodContent(mood: string): Promise<MoodContent[]> {
  try {
    const references = await getQuranReferences(mood);

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

    const verses = await Promise.all(versePromises);

    // Filter out any failed fetches (nulls) and return valid content
    return verses.filter((v): v is MoodContent => v !== null);
  } catch (error) {
    console.error("Error in getMoodContent:", error);
    return [];
  }
}
