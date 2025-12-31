import OpenAI from 'openai';
import { LLMProvider, QuranReference } from './types';

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI';
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async getReferences(mood: string): Promise<QuranReference[]> {
    try {
      const prompt = `You are a helpful Islamic assistant. A user is feeling "${mood}".
      Provide exactly 3 comforting or relevant Quran verses.
      Return ONLY a JSON array of objects with "surah" (number) and "ayah" (number).
      Do not include any explanation or markdown formatting.
      Example: [{"surah": 1, "ayah": 5}, {"surah": 112, "ayah": 1}, {"surah": 36, "ayah": 58}]`;

      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;

      if (!content) return [];

      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedContent) as QuranReference[];
    } catch (error) {
      console.error("OpenAI Provider Error:", error);
      return [];
    }
  }
}
