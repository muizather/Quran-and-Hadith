import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, LLMResponse } from './types';

export class GoogleProvider implements LLMProvider {
  name = 'Google Gemini';
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async getReferences(mood: string): Promise<LLMResponse> {
    try {
      // Use gemini-2.0-flash which typically has higher rate limits than preview models
      // Increase temperature to 1.0 to encourage variety in verse selection
      const model = this.client.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 1.0,
            topP: 0.95,
          }
      });

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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) return { message: "I couldn't generate a response.", references: [] };

      const cleanedContent = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedContent) as LLMResponse;
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
