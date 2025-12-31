import OpenAI from 'openai';
import { LLMProvider, LLMResponse } from './types';

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI';
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async getReferences(mood: string): Promise<LLMResponse> {
    try {
      const prompt = `You are a compassionate spiritual companion. A user is feeling "${mood}".

      1. Write a short, comforting, and empathetic message (2-3 sentences) addressing the user directly ("You"). Speak as a kind friend.
      2. Select exactly 3 comforting or relevant Quran verses.

      Return ONLY a JSON object with the following structure:
      {
        "message": "Your comforting message here...",
        "references": [{"surah": number, "ayah": number}, ...]
      }

      Do not include any markdown formatting.
      Example:
      {
        "message": "It is okay to feel this way. Turn to patience and prayer.",
        "references": [{"surah": 1, "ayah": 5}, {"surah": 112, "ayah": 1}, {"surah": 36, "ayah": 58}]
      }`;

      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;

      if (!content) return { message: "No content available.", references: [] };

      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedContent) as LLMResponse;
    } catch (error) {
      console.error("OpenAI Provider Error:", error);
      return { message: "Sorry, I am having trouble connecting.", references: [] };
    }
  }
}
