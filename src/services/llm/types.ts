export interface QuranReference {
  surah: number;
  ayah: number;
}

export interface LLMProvider {
  name: string;
  getReferences(mood: string): Promise<QuranReference[]>;
}
