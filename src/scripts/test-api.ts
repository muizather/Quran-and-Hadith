import { fetchVerse, fetchHadith } from '../services/api';
import { getQuranReferences } from '../services/llm';

async function test() {
  console.log("--- Testing fetchVerse (1:1) ---");
  const verse = await fetchVerse(1, 1);
  if (verse) {
    console.log("Success! Verse Key:", verse.key);
  } else {
    console.error("Failed to fetch verse.");
  }

  console.log("\n--- Testing fetchHadith (2962) ---");
  const hadith = await fetchHadith(2962);
  if (hadith) {
    console.log("Success! Hadith Title:", hadith.title);
  } else {
    console.error("Failed to fetch hadith.");
  }

  console.log("\n--- Testing getQuranReferences ('Anxiety') ---");
  // Check if API Key is set, otherwise this will fail or use fallback
  if (!process.env.OPENAI_API_KEY) {
    console.log("Skipping real LLM call (No API KEY). Logic will trigger fallback.");
  }

  const references = await getQuranReferences("Anxiety");
  console.log("References received:", references);

  if (references.length > 0) {
      console.log("Testing fetch for first reference:", references[0]);
      const fetchedVerse = await fetchVerse(references[0].surah, references[0].ayah);
      if (fetchedVerse) {
          console.log("Successfully fetched dynamic verse:", fetchedVerse.english.substring(0, 50) + "...");
      } else {
          console.error("Failed to fetch dynamic verse.");
      }
  }
}

test();
