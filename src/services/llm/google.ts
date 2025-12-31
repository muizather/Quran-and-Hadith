import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, LLMResponse } from './types';

export class GoogleProvider implements LLMProvider {
  name = 'Google Gemini';
  private client: GoogleGenerativeAI;

  // List of models to try in order of preference/quota availability
  private models = [
    "gemini-2.0-flash-lite-preview-02-05", // Try Lite preview first
    "gemini-flash-latest",                  // Try generic latest alias
    "gemini-2.0-flash",                     // Try specific 2.0
    "gemini-2.5-flash"                      // Try 2.5 (limited quota) as last resort
  ];

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async getReferences(mood: string): Promise<LLMResponse> {
    let lastError: any = null;

    // Add a random seed instruction to the prompt to force diversity
    const aspects = ["patience", "mercy", "strength", "hope", "forgiveness", "nature", "history", "prayer"];
    const randomAspect = aspects[Math.floor(Math.random() * aspects.length)];

    const prompt = `You are a compassionate spiritual companion. A user is feeling "${mood}".

    1. Write a short, comforting, and empathetic message (2-3 sentences) addressing the user directly ("You"). Speak as a kind friend.
    2. Select exactly 3 comforting or relevant Quran verses.

    IMPORTANT: Try to be diverse. Do not always choose the most common verses.
    Consider verses related to: ${randomAspect}.

    Return ONLY a JSON object with the following structure:
    {
      "message": "Your comforting message here...",
      "references": [{"surah": number, "ayah": number}, ...]
    }

    Do not include any markdown formatting like \`\`\`json. Just the raw JSON string.
    Example:
    {
      "message": "I know it feels heavy right now, but remember that ease follows hardship. Take a deep breath and trust in Allah's plan.",
      "references": [{"surah": 94, "ayah": 5}, {"surah": 2, "ayah": 286}, {"surah": 13, "ayah": 28}]
    }`;

    // Loop through models until one works
    for (const modelName of this.models) {
      try {
        console.log(`[GoogleProvider] Attempting with model: ${modelName}`);

        const model = this.client.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 1.0,
              topP: 0.95,
            }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error("Empty response from model");

        const cleanedContent = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedContent) as LLMResponse;

      } catch (error: any) {
        console.warn(`[GoogleProvider] Failed with model ${modelName}:`, error.message);
        lastError = error;

        // If it's a parsing error, we shouldn't switch models, but if it's 429/404, we continue.
        // For simplicity, we try next model on any error.
        continue;
      }
    }

    console.error("Google Gemini Provider Error: All models failed.");
    if (lastError?.response) {
       console.error("Last Gemini Response Error:", JSON.stringify(lastError.response, null, 2));
    }
    throw lastError || new Error("All models failed");
  }
}
