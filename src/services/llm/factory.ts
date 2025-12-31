import { LLMProvider } from './types';
import { OpenAIProvider } from './openai';
import { GoogleProvider } from './google';

export function getLLMProvider(): LLMProvider {
  const googleKey = process.env.GOOGLE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (googleKey) {
    // Log masked key for debugging
    const maskedKey = googleKey.substring(0, 4) + '...';
    console.log(`[Factory] Using Google Gemini (Key: ${maskedKey})`);
    return new GoogleProvider(googleKey);
  }

  if (openaiKey) {
    console.log("[Factory] Using OpenAI");
    return new OpenAIProvider(openaiKey);
  }

  console.error("[Factory] CRITICAL: No API keys found! Please set GOOGLE_API_KEY.");
  return new OpenAIProvider('dummy-key');
}
