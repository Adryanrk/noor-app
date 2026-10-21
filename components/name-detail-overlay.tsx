"use client";

import { motion } from "framer-motion";
import type { AsmaName } from "@/data/asma-ul-husna";

/**
 * The click-a-name popup. Same visual language as ReflectionScene (gold
 * hairline border, black/backdrop-blur card, fade+rise-in) but simpler —
 * no boat-anchored positioning, just a centered dialog over a dark scrim,
 * since there's no ambient-video metaphor to line up with here. Caller
 * (NamesGrid) wraps this in AnimatePresence and only renders it when a
 * name is selected, same pattern page.tsx already uses for ReflectionScene.
 */
export function NameDetailOverlay({
  name,
  onClose,
}: {
  name: AsmaName;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-gold/20 bg-black/60 px-8 py-10 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-sm"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          {name.number} / 99
        </span>
        <span dir="rtl" lang="ar" className="font-arabic text-4xl leading-relaxed text-gold">
          {name.arabic}
        </span>
        <span className="font-serif text-lg">{name.transliteration}</span>
        <span className="text-sm text-muted-foreground/80">{name.meaning}</span>
        <span className="h-px w-10 bg-gold/20" />
        <p className="text-sm leading-relaxed text-muted-foreground">{name.explanation}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 rounded-full border border-gold/70 px-6 py-2 text-xs uppercase tracking-widest text-gold transition hover:bg-gold hover:text-background"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
