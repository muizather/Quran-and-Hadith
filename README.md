# Qalb-e-Saleem

**Your Spiritual Companion**

Qalb-e-Saleem is a Next.js web application designed to provide spiritual comfort and guidance through authentic Islamic content. It features a "Mood Jar" that uses AI to recommend relevant Quran verses based on your current emotional state, fetching authentic text and translations live from Quran.com.

## Features

-   **Mood Jar**: Select an emotion (Anxiety, Gratitude, Anger, etc.) to receive curated Quranic verses.
-   **AI-Powered Recommendations**: Uses Google Gemini (or OpenAI) to understand emotions and find relevant scriptures.
-   **Authentic Data**: Connects directly to Quran.com API (V4) for Uthmani Arabic text and verified translations (Saheeh International & Maududi).
-   **Multilingual**: Displays content in Arabic, English, and Urdu (Nastaliq script).
-   **Performance**: Utilizes Next.js Server Actions and Data Caching for optimal performance.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/qalb-e-saleem.git
    cd qalb-e-saleem
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```bash
    # Required: Google Gemini API Key
    GOOGLE_API_KEY=your_google_api_key_here

    # Optional: OpenAI API Key (if you prefer OpenAI)
    # OPENAI_API_KEY=your_openai_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fqalb-e-saleem&env=GOOGLE_API_KEY)

### Required Environment Variables on Vercel

| Variable | Description |
| :--- | :--- |
| `GOOGLE_API_KEY` | Your Google Gemini API Key. |

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS, Lucide Icons
-   **Fonts**: Amiri (Arabic), Noto Nastaliq Urdu (Urdu), Inter (English)
-   **AI**: Google Generative AI SDK (Gemini)
-   **APIs**: Quran.com V4, HadithEnc

## License

MIT
