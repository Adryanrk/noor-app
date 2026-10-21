"use client";

import { useEffect, useState } from "react";
import type { CuratedVerse } from "@/data/curated-verses";
import { fetchAyahEditions, type AyahBundle } from "@/lib/quran";
import { getVerseSizeTier } from "@/lib/verse-sizing";

interface VerseDisplayProps {
  verse: CuratedVerse;
  onShowReflection: () => void;
  // Reports the book's own target canvas height for THIS verse's length
  // tier, so page.tsx can shrink the book a little on the longest verses
  // instead of letting the whole stack overflow the viewport. Optional
  // only so this component doesn't require a parent that cares.
  onSizeTier?: (bookHeight: number) => void;
}

export function VerseDisplay({ verse, onShowReflection, onSizeTier }: VerseDisplayProps) {
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

  // Reported as its own effect (rather than inline during render) so
  // it's a proper side effect, not a parent-state update tucked inside
  // this component's render pass.
  useEffect(() => {
    if (data) onSizeTier?.(getVerseSizeTier(data.translation.length).bookHeight);
  }, [data, onSizeTier]);

  if (error) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Couldn&apos;t load this verse right now — please try again.
      </p>
    );
  }

  if (!data) {
    return (
      <p className="animate-pulse text-center text-sm text-muted-foreground">
        Loading verse…
      </p>
    );
  }

  // Verses vary a lot in length. Scale the type down for longer ones so
  // the whole thing still fits without the card needing to scroll — you
  // asked for text that keeps shrinking over an internal scrollbar. The
  // actual thresholds now live in lib/verse-sizing.ts, shared with
  // page.tsx so the book's own canvas can shrink in step (see point 4,
  // "boken försvinner ur bild").
  const sizing = getVerseSizeTier(data.translation.length);

  return (
    <div className={`flex w-full flex-col items-center ${sizing.gap} text-center`}>
      <p dir="rtl" lang="ar" className={`font-arabic ${sizing.arabic} leading-relaxed text-gold`}>
        {data.arabic}
      </p>
      <p className={`${sizing.translit} italic text-muted-foreground`}>{data.transliteration}</p>
      <p className={`font-serif ${sizing.translation} leading-relaxed`}>
        &ldquo;{data.translation}&rdquo;
      </p>
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {data.surahName} {data.surah}:{data.ayah}
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Saheeh International
        </p>
      </div>
      {/* Filled pill, not the underlined-link style "Show another verse"
          uses below the card — these are different kinds of action
          (go deeper into THIS verse, vs. replace it with a different
          one entirely), so they shouldn't look identical. */}
      <button
        type="button"
        onClick={onShowReflection}
        className="mt-1 rounded-full bg-gold px-5 py-2 text-xs uppercase tracking-widest text-background transition hover:bg-gold/90"
      >
        Show a reflection
      </button>
    </div>
  );
}
