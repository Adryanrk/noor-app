"use client";

import { useEffect, useState } from "react";
import type { CuratedVerse } from "@/data/curated-verses";
import { fetchAyahEditions, type AyahBundle } from "@/lib/quran";

interface VerseSummaryProps {
  verse: CuratedVerse;
}

/**
 * A smaller, read-only sibling of VerseDisplay for the Themes list, where
 * several verses can be shown at once — same live-fetch approach
 * (fetchAyahEditions), but no reflection button and no onSizeTier
 * reporting, since neither applies outside the single-verse-of-the-day
 * flow this was lifted from. Deliberately skips the transliteration line
 * too, to keep each entry compact when there can be many in a list.
 */
export function VerseSummary({ verse }: VerseSummaryProps) {
  const [data, setData] = useState<AyahBundle | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(false);

    fetchAyahEditions(verse.surah, verse.ayah)
      .then((bundle) => {
        if (!cancelled) setData(bundle);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [verse.surah, verse.ayah]);

  if (error) {
    return (
      <p className="text-xs text-muted-foreground">
        Couldn&apos;t load this verse right now — please try again.
      </p>
    );
  }

  if (!data) {
    return (
      <p className="animate-pulse text-xs text-muted-foreground">Loading verse…</p>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl border border-gold/20 bg-black/40 px-5 py-4 text-center backdrop-blur-sm">
      <p dir="rtl" lang="ar" className="font-arabic text-lg leading-relaxed text-gold">
        {data.arabic}
      </p>
      <p className="font-serif text-sm leading-relaxed">&ldquo;{data.translation}&rdquo;</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {data.surahName} {data.surah}:{data.ayah}
      </p>
    </div>
  );
}
