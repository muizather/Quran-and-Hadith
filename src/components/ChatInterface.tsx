'use client';

import { useState } from 'react';
import { getMoodContent, MoodContent } from '@/app/actions';
import { Loader2, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  verses?: MoodContent[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // Reuse the mood content logic for now as it does exactly what we need:
      // Takes a string (feeling/input) -> gets verses -> returns them.
      const verses = await getMoodContent(userMessage);

      const assistantMessage: Message = {
        role: 'assistant',
        content: verses.length > 0
          ? "Here are some verses from the Quran that might bring you comfort and guidance:"
          : "I couldn't find specific verses for that right now, but remember Allah is always near.",
        verses: verses
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error.message || "Sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>Tell me how you are feeling...</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white border shadow-sm rounded-bl-none'}`}>
              <p className="mb-2">{m.content}</p>

              {m.verses && m.verses.length > 0 && (
                <div className="space-y-4 mt-4">
                  {m.verses.map((v) => (
                    <div key={v.key} className="bg-gray-50 p-3 rounded-lg border text-gray-800">
                      <div className="text-xs text-gray-500 mb-1">Surah {v.key}</div>
                      <p className="text-right font-amiri text-xl mb-3 leading-relaxed">{v.arabic}</p>
                      <p className="text-sm italic mb-1">"{v.english}"</p>
                      <p className="text-sm text-right font-urdu leading-loose" dir="rtl">{v.urdu}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border shadow-sm p-4 rounded-2xl rounded-bl-none">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I am feeling anxious about work..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
