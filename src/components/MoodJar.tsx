'use client';

import { useState } from 'react';
import { getMoodContent, MoodContent } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const MOODS = [
  { name: 'Anxiety', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
  { name: 'Anger', color: 'bg-red-100 hover:bg-red-200 text-red-800' },
  { name: 'Gratitude', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  { name: 'Sadness', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
  { name: 'Hope', color: 'bg-teal-100 hover:bg-teal-200 text-teal-800' },
  { name: 'Loneliness', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
];

export function MoodJar() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [content, setContent] = useState<MoodContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMoodClick = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    setContent([]);
    try {
      const data = await getMoodContent(mood);
      setContent(data);
    } catch (err: any) {
      console.error("Failed to fetch mood content", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">How are you feeling today?</h2>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {MOODS.map((m) => (
          <button
            key={m.name}
            onClick={() => handleMoodClick(m.name)}
            className={`p-6 rounded-xl transition-all shadow-sm flex flex-col items-center justify-center gap-2 ${m.color} ${selectedMood === m.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
          >
            <span className="text-lg font-semibold">{m.name}</span>
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="space-y-6">
        {loading && (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
             <p className="font-semibold">Error</p>
             <p>{error}</p>
          </div>
        )}

        {!loading && !error && content.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold mb-4">Verses for {selectedMood}</h3>
            <div className="grid gap-6">
              {content.map((item) => (
                <div key={item.key} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-500">Surah {item.key}</span>
                  </div>
                  <p className="text-right text-3xl font-amiri mb-6 leading-loose">{item.arabic}</p>
                  <p className="text-gray-800 mb-2 italic">"{item.english}"</p>
                  <p className="text-gray-600 text-right text-lg font-urdu leading-loose" dir="rtl">{item.urdu}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && selectedMood && content.length === 0 && (
           <div className="text-center text-gray-500">
             No content found. Please try again or check your connection.
           </div>
        )}
      </div>
    </div>
  );
}
