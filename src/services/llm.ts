import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key', // Prevent crash on init if key missing, but call will fail
});

interface QuranReference {
  surah: number;
  ayah: number;
}

/**
 * Asks the AI for Quran references based on a mood/feeling.
 */
export async function getQuranReferences(mood: string): Promise<QuranReference[]> {
  try {
    const prompt = `You are a helpful Islamic assistant. A user is feeling "${mood}".
    Provide exactly 3 comforting or relevant Quran verses.
    Return ONLY a JSON array of objects with "surah" (number) and "ayah" (number).
    Do not include any explanation or markdown formatting.
    Example: [{"surah": 2, "ayah": 153}, {"surah": 94, "ayah": 5}, {"surah": 13, "ayah": 28}]`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini", // Cost effective
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    if (!content) {
        console.error("No content received from LLM");
        return [];
    }

    // Clean up potentially messy output (e.g., if it wraps in ```json ... ```)
    const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const references = JSON.parse(cleanedContent) as QuranReference[];
    return references;

  } catch (error) {
    console.error("Error getting Quran references:", error);
    // User requested NO hardcoded/fallback data.
    // If API fails, we return empty list or let the UI handle the error state.
    return [];
  }
}
