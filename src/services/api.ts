// Configuration
const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const HADITH_API_BASE = 'https://hadeethenc.com/api/v1';

// IDs
const TRANSLATION_ENGLISH = 20; // Saheeh International (More reliable than 131)
const TRANSLATION_URDU = 97; // Tafheem e Qur'an - Syed Abu Ali Maududi

interface VerseResponse {
  verse: {
    id: number;
    verse_key: string;
    text_uthmani: string;
    translations: Array<{
      id: number;
      resource_id: number;
      text: string;
    }>;
  };
}

interface HadithResponse {
  id: string;
  title: string;
  hadeeth: string;
  attribution: string;
  grade: string;
  explanation: string;
  hints: string[];
  categories: string[];
  translations: string[];
  hadeeth_intro: string;
}

/**
 * Strips HTML tags from a string.
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

/**
 * Fetches a Quran verse by Surah and Ayah with English and Urdu translations.
 * Uses Next.js standard fetch caching.
 */
export const fetchVerse = async (surah: number, ayah: number) => {
  try {
    // Switch to text_uthmani to show diacritical marks (Tashkeel)
    const url = `${QURAN_API_BASE}/verses/by_key/${surah}:${ayah}?language=en&fields=text_uthmani&translations=${TRANSLATION_ENGLISH},${TRANSLATION_URDU}`;
    console.log(`Fetching Verse: ${url}`);

    const res = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours (86400 seconds)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch verse ${surah}:${ayah}. Status: ${res.status}`);
    }

    const data = await res.json() as VerseResponse;

    // Post-process to organize translations
    const verse = data.verse;

    // Find translations safely
    const englishObj = verse.translations?.find(t => t.resource_id === TRANSLATION_ENGLISH);
    const urduObj = verse.translations?.find(t => t.resource_id === TRANSLATION_URDU);

    // Strip HTML from text (especially Urdu footnotes)
    const english = stripHtml(englishObj?.text || '');
    const urdu = stripHtml(urduObj?.text || '');

    return {
      key: verse.verse_key,
      arabic: verse.text_uthmani, // Use full Uthmani script with diacritics
      english,
      urdu,
      raw: verse
    };
  } catch (error) {
    console.error("Error in fetchVerse:", error);
    return null;
  }
};

/**
 * Fetches a Hadith by ID from HadithEnc.
 * Uses Next.js standard fetch caching.
 */
export const fetchHadith = async (id: string | number) => {
  try {
    // Endpoint: /hadeeths/one/?id={id}&language=en
    const url = `${HADITH_API_BASE}/hadeeths/one/?id=${id}&language=en`;
    console.log(`Fetching Hadith: ${url}`);

    const res = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch hadith ${id}. Status: ${res.status}`);
    }

    const data = await res.json() as HadithResponse;

    return data;
  } catch (error) {
    console.error("Error in fetchHadith:", error);
    return null;
  }
};
