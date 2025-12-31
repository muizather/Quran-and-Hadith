import { MoodJar } from "@/components/MoodJar";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

// Allow longer timeout for AI generation
export const maxDuration = 60;

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Qalb-e-Saleem</h1>
          <p className="text-gray-600 mb-6">Your Spiritual Companion</p>

          <Link
            href="/talk-to-me"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors shadow-sm font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Talk to Me
          </Link>
        </header>

        <MoodJar />
      </div>
    </main>
  );
}
