import { getLLMProvider } from './llm/factory';
import { QuranReference } from './llm/types';

/**
 * Asks the AI for Quran references based on a mood/feeling.
 * Delegates to the active provider (Google or OpenAI).
 */
export async function getQuranReferences(mood: string): Promise<QuranReference[]> {
  const provider = getLLMProvider();
  return await provider.getReferences(mood);
}
