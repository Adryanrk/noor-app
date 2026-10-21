"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AsmaName } from "@/data/asma-ul-husna";
import { ASMA_GROUPS } from "@/lib/asma-groups";
import { NameDetailOverlay } from "@/components/name-detail-overlay";
import { NamesQuiz } from "@/components/names-quiz";

/**
 * A grid of all 99 names — Arabic, transliteration, short meaning.
 *
 * First version of this was one flat 99-item grid, which read as a
 * spreadsheet rather than a feature ("bara rad efter rad") — grouping,
 * card redesign and scroll-reveal fixed that first pass. This version
 * adds the two follow-up ideas: tapping a card opens a detail popup
 * (NameDetailOverlay) with a short explanation beyond the one-line
 * meaning, and a "Practice the Names" button opens a flashcard quiz
 * (NamesQuiz) for the same groups-of-10 this grid is already organized
 * into — both share that grouping via lib/asma-groups.ts rather than
 * each inventing their own.
 */
export function NamesGrid() {
  const [selectedName, setSelectedName] = useState<AsmaName | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-10">
      <button
        type="button"
        onClick={() => setQuizOpen(true)}
        className="rounded-full border border-gold/40 px-5 py-2 text-xs uppercase tracking-widest text-gold transition hover:border-gold hover:bg-gold hover:text-background"
      >
        Practice the Names
      </button>

      {ASMA_GROUPS.map((group) => (
        <div key={group.label} className="flex w-full flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-muted-foreground/60">
            <span className="h-px w-8 bg-gold/30" />
            <span className="text-xs uppercase tracking-[0.3em]">{group.label}</span>
            <span className="h-px w-8 bg-gold/30" />
          </div>
          <div className="grid w-full grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4">
            {group.names.map((name, i) => (
              <motion.button
                key={name.number}
                type="button"
                onClick={() => setSelectedName(name)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center gap-1 rounded-xl border border-gold/20 bg-black/30 px-3 pb-4 pt-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-black/40"
              >
                <span className="absolute -top-2.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-gold/30 bg-background text-[9px] text-muted-foreground/70">
                  {name.number}
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-5 h-10 w-20 -translate-x-1/2 rounded-full bg-gold/25 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                />
                <span dir="rtl" lang="ar" className="relative font-arabic text-xl text-gold">
                  {name.arabic}
                </span>
                <span className="my-1 h-px w-8 bg-gold/20" />
                <span className="font-serif text-sm">{name.transliteration}</span>
                <span className="text-xs text-muted-foreground">{name.meaning}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {selectedName && (
          <NameDetailOverlay name={selectedName} onClose={() => setSelectedName(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quizOpen && <NamesQuiz onClose={() => setQuizOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
