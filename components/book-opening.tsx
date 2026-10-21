"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BookOpeningProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onCloseComplete?: () => void;
}

/**
 * The book is one of two mutually-exclusive states, swapped with
 * AnimatePresence: a floating cover photo (closed) or the open pages
 * (isOpen). Rather than trying to physically "hinge" the flat cover
 * photo open in 3D — which looked wrong, since the photo already has
 * its own baked-in dramatic angle — the cover settles flat and
 * dissolves into the open pages, like the book coming to rest on a
 * table and falling open. Closing (from "show another verse") plays the
 * same transition in reverse; `onCloseComplete` fires once the pages
 * have fully faded out, which is when the caller should swap in the
 * next verse.
 */
export function BookOpening({ children, isOpen, onOpen, onCloseComplete }: BookOpeningProps) {
  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="relative mx-auto aspect-[3/4] w-full [perspective:2400px]">
        {/* Slow-turning light rays radiating from behind the book */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-24 opacity-0"
          animate={{ opacity: isOpen ? 0.5 : 0.25, rotate: 360 }}
          transition={{
            opacity: { duration: 1 },
            rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          }}
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg, rgba(201,162,75,0.35) 0deg 1.5deg, transparent 1.5deg 12deg)",
            WebkitMaskImage: "radial-gradient(closest-side, black 0%, transparent 72%)",
            maskImage: "radial-gradient(closest-side, black 0%, transparent 72%)",
          }}
        />

        {/* Soft gold bloom behind the book, blooms brighter on reveal */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-10 rounded-full blur-3xl"
          initial={{ opacity: 0.15 }}
          animate={{ opacity: isOpen ? 0.4 : 0.15 }}
          transition={{ duration: 1.2 }}
          style={{
            backgroundImage: "radial-gradient(closest-side, var(--gold) 0%, transparent 70%)",
          }}
        />

        <AnimatePresence
          onExitComplete={() => {
            if (!isOpen) onCloseComplete?.();
          }}
        >
          {!isOpen ? (
            <motion.button
              key="cover"
              type="button"
              onClick={onOpen}
              aria-label="Open the book"
              className="absolute inset-0 overflow-hidden rounded-md border border-gold/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, scale: 1.06, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, rotateX: 7 }}
              exit={{ opacity: 0, scale: 0.92, rotateX: 0, transition: { duration: 0.55 } }}
              transition={{ duration: 0.8 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/quran-cover.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Slow diagonal sheen sweep */}
              <motion.div
                aria-hidden
                className="absolute -inset-y-10 -inset-x-24 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                }}
                animate={{ x: ["-30%", "30%"] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              />

              {/* Scrim + label at the base so "Tap to open" stays legible */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-8 pb-6 pt-16 text-center">
                <span className="font-serif text-xs uppercase tracking-[0.35em] text-gold/90">
                  Tap to open
                </span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="pages"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.45 } }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {/* Gilded page stack, suggesting thickness */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-md bg-gradient-to-br from-[#d8c99e] to-[#c9b585]" />
              <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-md bg-[#ecdfba]" />
              <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-md bg-[#f6efd8]" />

              {/* The open page */}
              <div className="absolute inset-0 flex items-center justify-center overflow-y-auto rounded-md border border-gold/40 bg-card p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.25)]">
                {children}
              </div>

              {/* Light-burst flash as the page settles in */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 1, times: [0, 0.35, 1], delay: 0.15 }}
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(255,244,214,0.95) 0%, rgba(255,244,214,0) 65%)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
