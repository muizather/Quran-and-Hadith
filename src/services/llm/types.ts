export interface QuranReference {
  surah: number;
  ayah: number;
}

export interface LLMResponse {
  message: string;
  references: QuranReference[];
}

export interface LLMProvider {
  name: string;
  getReferences(mood: string): Promise<LLMResponse>;
}
