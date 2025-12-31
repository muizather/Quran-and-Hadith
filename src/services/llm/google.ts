import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, QuranReference } from './types';

export class GoogleProvider implements LLMProvider {
  name = 'Google Gemini';
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async getReferences(mood: string): Promise<QuranReference[]> {
    try {
      // Use gemini-2.5-flash as found in the available models list
      // Increase temperature to 1.0 to encourage variety in verse selection
      const model = this.client.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            temperature: 1.0,
            topP: 0.95,
          }
      });

      // Add a random seed instruction to the prompt to force diversity
      const aspects = ["patience", "mercy", "strength", "hope", "forgiveness", "nature", "history", "prayer"];
      const randomAspect = aspects[Math.floor(Math.random() * aspects.length)];

      const prompt = `You are a helpful Islamic assistant. A user is feeling "${mood}".
      Provide exactly 3 comforting or relevant Quran verses.

      IMPORTANT: Try to be diverse. Do not always choose the most common verses.
      Consider verses related to: ${randomAspect}.

      Return ONLY a JSON array of objects with "surah" (number) and "ayah" (number).
      Do not include any explanation or markdown formatting.
      Example: [{"surah": 1, "ayah": 5}, {"surah": 112, "ayah": 1}, {"surah": 36, "ayah": 58}]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) return [];

      const cleanedContent = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedContent) as QuranReference[];
    } catch (error: any) {
      console.error("Google Gemini Provider Error:", error);
      // Log more details if available
      if (error.response) {
         console.error("Gemini Response Error:", JSON.stringify(error.response, null, 2));
      }
      throw error; // Rethrow to let the factory/caller handle or log
    }
  }
}
