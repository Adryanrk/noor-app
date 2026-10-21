"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ASMA_GROUPS } from "@/lib/asma-groups";

/**
 * Flashcard practice, one group of 10 at a time (same grouping NamesGrid
 * already shows, via the shared ASMA_GROUPS — pick "1–10" here and it's
 * the exact same ten cards you'd see under that heading in the grid).
 *
 * Deliberately plain flashcards, not a scored multiple-choice quiz or a
 * matching game: tap the card to flip between the Arabic name and its
 * transliteration+meaning, Previous/Next to move through the group, no
 * score tracked anywhere. Matches the site's low-key tone — this is a
 * practice aid, not a game with a win state.
 *
 * Same overlay treatment as NameDetailOverlay/ReflectionScene (dark
 * scrim + centered gold-bordered card); caller (NamesGrid) wraps this in
 * AnimatePresence and only mounts it while the quiz is open.
 */
export function NamesQuiz({ onClose }: { onClose: () => void }) {
  const [groupIndex, setGroupIndex] = useState<number | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const group = groupIndex !== null ? ASMA_GROUPS[groupIndex] : null;
  const card = group ? group.names[cardIndex] : null;

  function pickGroup(index: number) {
    setGroupIndex(index);
    setCardIndex(0);
    setRevealed(false);
  }

  function step(direction: 1 | -1) {
    if (!group) return;
    setRevealed(false);
    setCardIndex((i) => (i + direction + group.names.length) % group.names.length);
  }

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-background/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-gold/20 bg-black/60 px-6 py-8 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-sm"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {!group || !card ? (
          <>
            <h3 className="font-serif text-lg uppercase tracking-[0.2em] text-gold">
              Practice the Names
            </h3>
            <p className="text-sm text-muted-foreground">Choose a group to start.</p>
            <div className="grid grid-cols-3 gap-2">
              {ASMA_GROUPS.map((g, i) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => pickGroup(i)}
                  className="rounded-full border border-gold/30 px-3 py-2 text-xs uppercase tracking-widest text-gold transition hover:border-gold/60"
                >
                  {g.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              {group.label} &middot; {cardIndex + 1}/{group.names.length}
            </span>

            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-gold/20 bg-black/30 px-4"
            >
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.span
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    dir="rtl"
                    lang="ar"
                    className="font-arabic text-3xl leading-relaxed text-gold"
                  >
                    {card.arabic}
                  </motion.span>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="font-serif text-base">{card.transliteration}</span>
                    <span className="text-sm text-muted-foreground">{card.meaning}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                {revealed ? "Tap to hide" : "Tap to reveal"}
              </span>
            </button>

            {/*
              Was a flex row with justify-between — looks like it should
              center "Groups", but justify-between only equalizes the
              GAPS between items, not their position relative to the
              row's true center. With "Previous" wider than "Next", that
              pulled the middle button off-center by exactly half the
              width difference between them — a geometry fact, not a
              rendering glitch, so it'd stay skewed no matter the text.
              A 3-column grid fixes it for real: each button sits in an
              equal-width column, so "Groups" sitting in the middle
              column is centered on the row regardless of how long
              "Previous" or "Next" happen to be.
            */}
            <div className="grid w-full grid-cols-3 items-center">
              <button
                type="button"
                onClick={() => step(-1)}
                className="justify-self-start text-xs uppercase tracking-widest text-gold underline underline-offset-4"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setGroupIndex(null)}
                className="justify-self-center text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4"
              >
                Groups
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="justify-self-end text-xs uppercase tracking-widest text-gold underline underline-offset-4"
              >
                Next
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-gold/70 px-6 py-2 text-xs uppercase tracking-widest text-gold transition hover:bg-gold hover:text-background"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
