import type { Metadata } from "next";
import { Amiri_Quran, Newsreader } from "next/font/google";
import { BackgroundScene } from "@/components/background-scene";
import "./globals.css";

// Amiri Quran is a Google-hosted font specifically shaped for Qur'anic
// text (full tashkeel support). next/font/google downloads it once at
// build time and self-hosts it from the app itself — no runtime calls
// to Google, and no font files to place by hand.
const amiriQuran = Amiri_Quran({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: "400",
});

// A calm serif for everything else: headings, translations, UI copy.
const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Noor — A Verse to Reflect On",
  description:
    "A calm space to read a verse of the Qur'an, its meaning, and a short reflection.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${amiriQuran.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BackgroundScene />
        {children}
      </body>
    </html>
  );
}
