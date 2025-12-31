import type { Metadata } from "next";
import { Inter, Amiri, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: '--font-amiri'
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"], // Urdu uses arabic subset in Google Fonts usually, or just 'latin' if subset not available, but for Noto it usually handles it.
  weight: ["400", "700"],
  variable: '--font-urdu',
});

export const metadata: Metadata = {
  title: "Qalb-e-Saleem",
  description: "Your Spiritual Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${amiri.variable} ${urdu.variable} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
