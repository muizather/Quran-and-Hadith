import { ChatInterface } from "@/components/ChatInterface";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Allow longer timeout for AI generation
export const maxDuration = 60;

export default function TalkToMePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Talk to Me</h1>
        </header>

        <ChatInterface />
      </div>
    </main>
  );
}
