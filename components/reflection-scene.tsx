"use client";

import { motion } from "framer-motion";

/**
 * The reflection reveal. Earlier version created a SECOND, zoomed-in copy
 * of the ambient video here (object-cover + scale) — that was the actual
 * bug behind it landing in the wrong spot: BackgroundScene's video (the
 * one that's always visible, mounted once in layout.tsx, fixed behind
 * everything) uses object-contain, fit to the viewport's full height and
 * centered, so I know exactly where the boat sits in it. A SECOND video
 * cropped differently (object-cover, then scaled further) doesn't show
 * the same framing at all, so anchoring against the boat's position was
 * never going to line up with what that second video actually showed.
 *
 * Fixed by not creating a second video at all — this scene is just a
 * dark scrim over the SAME already-playing background, with the text
 * anchored at the boat's actual measured position in it: I opened the
 * poster frame directly and measured the boat at roughly 82% down the
 * frame, horizontally centered. Since the background is always fit to
 * the viewport's full height and centered, that percentage holds at any
 * screen size. The card's bottom edge sits just above that point (not
 * over the boat itself) and drops down into place from higher up, so it
 * still reads as "descending toward the light, down to the boat."
 */
export function ReflectionScene({
  reminder,
  onBack,
}: {
  reminder: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.85 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 2.2 }}
      />

      {/*
        Was anchored at the boat's exact measured position (82% down) —
        read as too far toward the bottom edge in practice, so this is
        pulled up to 60%, a compromise between "centered on screen" and
        "still clearly settling toward the boat/light" rather than
        abandoning the boat anchor entirely. The card's BOTTOM edge is
        still pinned there via a plain, unanimated "-translate-y-full" on
        this static wrapper. The drop-in motion lives on the INNER div
        instead, as plain pixel y values relative to that already-
        anchored spot; keeping the static anchor and the animated offset
        on two separate elements avoids mixing % and px for the same
        animated property, which would make framer-motion interpolate
        between two different reference frames and send the card the
        wrong way.
      */}
      <div className="absolute left-1/2 top-[60%] z-10 -translate-x-1/2 -translate-y-full">
        <motion.div
          className="mx-6 flex max-w-lg flex-col items-center gap-7 rounded-2xl border border-gold/20 bg-black/45 px-8 py-10 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-sm"
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        >
          <p className="font-serif text-xl leading-relaxed text-[#f9f2df] sm:text-2xl">
            {reminder}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-gold/70 px-6 py-2 text-xs uppercase tracking-widest text-gold transition hover:bg-gold hover:text-background"
          >
            Back to the verse
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
