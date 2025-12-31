import { getLLMProvider } from './llm/factory';
import { LLMResponse } from './llm/types';
import { getFallbackForMood } from './llm/fallback';
import { unstable_cache } from 'next/cache';

/**
 * Asks the AI for Quran references based on a mood/feeling.
 * Delegates to the active provider (Google or OpenAI).
 * Includes Caching and Fallback logic.
 */
export async function getQuranReferences(mood: string): Promise<LLMResponse> {
  const getCachedReferences = unstable_cache(
    async (m: string) => {
      const provider = getLLMProvider();
      try {
        return await provider.getReferences(m);
      } catch (error: any) {
        console.error(`LLM Provider failed for mood "${m}":`, error);

        // Check for Rate Limit (429) or other errors
        if (error.message?.includes('429') || error.status === 429) {
             console.warn("Hit Rate Limit. Attempting to use Fallback data.");
             const fallback = getFallbackForMood(m);
             if (fallback) return fallback;
        }

        throw error;
      }
    },
    ['quran-references-v1'], // Cache key
    {
      revalidate: 86400, // Cache for 24 hours to prevent rate limits on repetitive queries
      tags: ['llm-responses']
    }
  );

  try {
    return await getCachedReferences(mood);
  } catch (error) {
    // If cache/fetch fails (e.g. rate limit + no fallback), try fallback one last time explicitly
    // This catches cases where the error propagated out of the cached function
    const fallback = getFallbackForMood(mood);
    if (fallback) {
        console.log("Using Fallback data after error.");
        return fallback;
    }
    // If all models fail and no fallback is found, return a friendly error message
    // The previous implementation returned "trouble connecting" which is good.
    // We will keep it but maybe improve the message.
    return { message: "Service is currently busy. Please try again in a few moments or try a different feeling.", references: [] };
  }
}
