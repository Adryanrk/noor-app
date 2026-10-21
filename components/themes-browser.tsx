"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { THEME_LABELS, type Theme } from "@/data/curated-verses";
import { versesByTheme } from "@/lib/curated-pool";
import { VerseSummary } from "@/components/verse-summary";

const THEMES = Object.keys(THEME_LABELS) as Theme[];

// Counted once at module load (curatedVerses is static data, not
// fetched), so each pill can show how many verses it holds before you
// click it — cheaper than recomputing on every render too.
const THEME_COUNTS: Record<Theme, number> = Object.fromEntries(
  THEMES.map((theme) => [theme, versesByTheme(theme).length])
) as Record<Theme, number>;

/**
 * Simple browse, per the agreed scope: pick a theme, see the curated
 * verses tagged with it below. No per-theme intro copy — just the
 * existing Theme/THEME_LABELS data (data/curated-verses.ts) and
 * versesByTheme (lib/curated-pool.ts), both of which already existed
 * before this section had any UI at all.
 *
 * Two polish passes added after the first version: a count on each
 * pill (so you know what you're about to get before clicking — some
 * themes only have one or two curated verses so far), and the verse
 * list now fades/slides in and out (AnimatePresence, keyed on the
 * active theme) instead of popping in instantly when you switch themes
 * or close the list.
 */
export function ThemesBrowser() {
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const verses = activeTheme ? versesByTheme(activeTheme) : [];

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {THEMES.map((theme) => {
          const selected = theme === activeTheme;
          return (
            <button
              key={theme}
              type="button"
              onClick={() => setActiveTheme(selected ? null : theme)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
                selected
                  ? "border-gold bg-gold text-background"
                  : "border-gold/30 text-gold hover:border-gold/60"
              }`}
            >
              {THEME_LABELS[theme]}{" "}
              <span className={selected ? "text-background/70" : "text-gold/50"}>
                ({THEME_COUNTS[theme]})
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTheme && (
          <motion.div
            key={activeTheme}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5 }}
            className="flex w-full flex-col items-center gap-4"
          >
            {verses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No curated verses for this theme yet.
              </p>
            ) : (
              verses.map((verse) => (
                <VerseSummary key={`${verse.surah}-${verse.ayah}`} verse={verse} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
