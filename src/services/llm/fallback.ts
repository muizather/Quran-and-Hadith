import { LLMResponse } from './types';

export const FALLBACK_DATA: Record<string, LLMResponse> = {
  "anxiety": {
    "message": "I know your heart feels heavy, but remember that Allah does not burden a soul beyond what it can bear. Take a moment to breathe.",
    "references": [
      { "surah": 2, "ayah": 286 },
      { "surah": 94, "ayah": 6 },
      { "surah": 13, "ayah": 28 }
    ]
  },
  "anger": {
    "message": "When anger rises, seek refuge in Allah. Patience is a shield that protects you from regret.",
    "references": [
      { "surah": 3, "ayah": 134 },
      { "surah": 42, "ayah": 37 },
      { "surah": 41, "ayah": 34 }
    ]
  },
  "gratitude": {
    "message": "Alhamdulillah! Recognizing blessings is the first step to receiving more of them.",
    "references": [
      { "surah": 14, "ayah": 7 },
      { "surah": 2, "ayah": 152 },
      { "surah": 55, "ayah": 13 }
    ]
  },
  "sadness": {
    "message": "It is okay to grieve, but do not lose hope. Allah is closer to you than your jugular vein.",
    "references": [
      { "surah": 2, "ayah": 156 },
      { "surah": 9, "ayah": 40 },
      { "surah": 93, "ayah": 3 }
    ]
  },
  "hope": {
    "message": "Hold on tight to your hope. Allah's mercy encompasses all things.",
    "references": [
      { "surah": 39, "ayah": 53 },
      { "surah": 12, "ayah": 87 },
      { "surah": 2, "ayah": 186 }
    ]
  },
  "loneliness": {
    "message": "You are never truly alone. Allah hears every whisper and sees every tear.",
    "references": [
      { "surah": 50, "ayah": 16 },
      { "surah": 58, "ayah": 7 },
      { "surah": 20, "ayah": 46 }
    ]
  }
};

export function getFallbackForMood(mood: string): LLMResponse | null {
  const normalizedMood = mood.toLowerCase().trim();
  // Check exact match
  if (FALLBACK_DATA[normalizedMood]) {
    return FALLBACK_DATA[normalizedMood];
  }

  // Check partial match
  const keys = Object.keys(FALLBACK_DATA);
  const match = keys.find(k => normalizedMood.includes(k));
  if (match) {
    return FALLBACK_DATA[match];
  }

  return null;
}
