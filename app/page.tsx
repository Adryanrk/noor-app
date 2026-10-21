"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookScene } from "@/components/book-scene";
import { VerseDisplay } from "@/components/verse-display";
import { ReflectionScene } from "@/components/reflection-scene";
import { NamesGrid } from "@/components/names-grid";
import { ThemesBrowser } from "@/components/themes-browser";
import { pickRandomVerse } from "@/lib/curated-pool";
import type { CuratedVerse } from "@/data/curated-verses";

// How long the 3D open/close animation takes to settle — kept in sync
// with the easing speed inside BookModel. If the reveal feels early or
// late once you can see it, this is the number to adjust first.
const BOOK_ANIMATION_MS = 1400;

export default function HomePage() {
  const [verse, setVerse] = useState<CuratedVerse>(() => pickRandomVerse());
  const [bookOpen, setBookOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  // How tall the book's own canvas should be — reported up by
  // VerseDisplay once it knows the current verse's length tier, so the
  // book can shrink a little on the longest verses instead of the whole
  // stack (header + card + book + button) overflowing the viewport and
  // pushing the book out of view. Defaults to the normal/short-verse
  // height (see lib/verse-sizing.ts's tier 0) so there's no flash of the
  // wrong size before the verse loads.
  const [bookHeight, setBookHeight] = useState(210);

  // Shared timing for every "position shifted because a sibling's size
  // changed" animation below (the book settling down into place once the
  // verse card appears, same for its reverse) — was previously an
  // instant snap, since Framer Motion only animates an element's OWN
  // declared props, not the reflow its appearance causes in siblings.
  // The `layout` prop on the motion.div's below opts each one into
  // Framer's automatic before/after position measurement (FLIP), so a
  // sibling's height change now glides the book into its new spot
  // instead of teleporting it there.
  const layoutTransition = { layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } };

  function openBook() {
    setBookOpen(true);
    window.setTimeout(() => setShowText(true), BOOK_ANIMATION_MS);
  }

  function showAnotherVerse() {
    setReflecting(false);
    if (bookOpen) {
      setShowText(false);
      setBookOpen(false);
      window.setTimeout(() => {
        setVerse((current) => pickRandomVerse(current));
      }, BOOK_ANIMATION_MS);
    } else {
      setVerse((current) => pickRandomVerse(current));
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      {/*
        This used to be "min-h-screen" + "justify-center", which meant a
        long verse's combined height (book + card + button) exceeded one
        viewport, and centering that overflow inside a forced full-screen
        box split it evenly above AND below the fold — pushing the verse
        and button out of view ("versen hamnar under"). That's gone, but
        on the longest verses in the whole Qur'an, text-shrinking alone
        still isn't enough room to guarantee the book stays visible — so
        this section now has a hard ceiling (max-h-dvh + overflow-hidden)
        and, below, the verse CARD specifically (not the book, not the
        button, not the header) is the one piece allowed to shrink below
        its natural size and scroll internally once that ceiling is hit.
        For a normal-length verse none of this engages at all — natural
        content height already fits, nothing shrinks, nothing scrolls.

        First real screenshot against this showed the budget was wrong
        though: on an actual laptop-height window, even a SHORT verse
        was hitting the scroll fallback, because the "always present"
        chrome around the card (this padding, the gaps below, the
        header, the book) was eating nearly the whole ceiling on its
        own, before the card got a fair share. Padding/gaps were
        trimmed once already; the book's own height tiers (see
        lib/verse-sizing.ts) just got cut further too — on top of
        freeing real room for the card, it also happens to be exactly
        what was asked for separately ("boken lite mindre").

        justify-center (was justify-start): with the book's footprint
        down and a real guarantee against overflow now in place (the
        max-h-dvh + shrinking card above), there's usually leftover
        room in the section, and centering the whole block in it reads
        better than everything clumped at the top. This is a different
        situation from the old min-h-screen+justify-center this
        replaced originally — that one centered an element that could
        legitimately overflow its box, which is what pushed content out
        of view. Here overflow is already handled before centering ever
        applies, so it can't reintroduce that bug.
      */}
      <section className="flex max-h-dvh flex-col items-center justify-center gap-4 overflow-hidden px-6 py-4 sm:py-6">
        <header className="shrink-0 text-center">
          <h1 className="font-arabic text-2xl text-gold">نور</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">Noor</p>
        </header>

        <motion.div
          layout
          className="flex min-h-0 w-full max-w-lg flex-col items-center gap-3"
          animate={{ opacity: reflecting ? 0 : 1, scale: reflecting ? 0.94 : 1 }}
          transition={{ duration: 0.6, ...layoutTransition }}
          style={{ pointerEvents: reflecting ? "none" : "auto" }}
        >
          {/*
            Reordered per your request: the verse (+ translation + "show
            another verse") now sits ABOVE the book, and the book itself
            settles lower in the section. That also happens to match the
            very first reference images for this feature — light coming
            down and the illuminated text rising up above where it meets
            the book, the same idea as the beam-onto-boat imagery reused
            in the reflection scene. The verse card used to be absolutely
            layered on top of the book (that's the old "knappen är
            borta" bug from before it was moved into normal flow); it's
            still in normal flow here, just reordered above instead of
            below, so a tall verse simply pushes the book down rather
            than covering anything.
          */}
          <motion.div layout className="flex min-h-0 w-full flex-col items-center gap-3" transition={layoutTransition}>
            {/* The one shrinkable, scrollable element in this whole
                section — see the comment on <section> above. min-h-0
                overrides the default flex-item floor (normally a flex
                item won't shrink below its own content's natural size,
                which is exactly what was letting the book get pushed
                off-screen before); overflow-y-auto is what makes the
                now-possibly-smaller-than-content box scrollable instead
                of just clipping silently. Deliberately NOT flex-1 — it
                should only ever be as tall as its content wants, never
                stretch to fill leftover space, so the closed-book /
                short-verse look stays exactly as compact as before. */}
            {/*
              scrollbar-gutter:stable reserves the native scrollbar's own
              width up front (whether or not it's actually showing right
              now), so a verse that newly triggers scrolling doesn't
              shift the available content width out from under the card
              below. The actual off-centering bug, though, was simpler
              and separate from the scrollbar entirely: this div is a
              plain block, not a flex container, so the card's `mx-auto`
              is what was missing — without it a `max-w-md` block
              narrower than its full-width parent defaults to the start
              edge (left), not the center. It worked by accident before
              this scroll-wrapper div existed, back when the card was a
              direct child of the outer `items-center` flex row (flexbox
              centers a narrower flex item on its own, no margin needed)
              — wrapping it in here for the scroll fix quietly dropped
              that. mx-auto fixes it regardless of flex vs. block context
              and regardless of whether a scrollbar is actually present.
            */}
            <div className="min-h-0 w-full overflow-y-auto [scrollbar-gutter:stable]">
              <AnimatePresence mode="wait">
                {showText && (
                  <motion.div
                    key={`${verse.surah}-${verse.ayah}`}
                    className="mx-auto w-full max-w-md rounded-2xl border border-gold/20 bg-black/40 px-6 py-4 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.4 } }}
                    transition={{ duration: 0.8 }}
                  >
                    <VerseDisplay
                      verse={verse}
                      onShowReflection={() => setReflecting(true)}
                      onSizeTier={setBookHeight}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={showAnotherVerse}
              className="shrink-0 text-xs uppercase tracking-widest text-gold underline underline-offset-4"
            >
              Show another verse
            </button>
          </motion.div>

          {/* shrink-0: the book must never be the thing that shrinks or
              gets clipped when space is tight — see the <section>
              comment above, this is the other half of that guarantee.
              height is driven by bookHeight (see state above) rather
              than a fixed value, so the canvas itself ALSO shrinks a
              little in step with the text on long verses — see point 4.
              `layout` is what makes this div's own position glide
              smoothly when it moves, whether that's from the verse card
              appearing above it or from this height value changing. */}
          <motion.div
            layout
            className="relative w-full shrink-0"
            style={{ height: bookHeight }}
            transition={layoutTransition}
          >
            <BookScene isOpen={bookOpen} onOpen={openBook} />

            {/*
              Masks the hard swap inside BookModel between the real GLB
              closed-book model and the procedural open-page geometry —
              they're two separate objects (the GLB can't animate open
              itself), so at the moment one replaces the other this flash
              covers the cut, reading as "the light catches the page as
              it turns" rather than a visible pop. Re-keyed on bookOpen so
              it replays on both opening and closing. Timed from the
              book's own easing curve (progress ≈ 1 − e^(−1.8·t), and the
              swap fires when that crosses ~0.6) rather than a round
              guess — worked out to ~450ms in, but I can't render the
              canvas to confirm the swap and the flash actually line up,
              so nudge this delay if they look off in practice.
            */}
            <motion.div
              key={bookOpen ? "opening" : "closing"}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.5, times: [0, 0.4, 1], delay: 0.45 }}
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(255,244,214,0.95) 0%, rgba(255,244,214,0) 70%)",
              }}
            />

            {!bookOpen && (
              <button
                type="button"
                onClick={openBook}
                aria-label="Open the book"
                className="absolute inset-0"
              />
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {reflecting && (
            <ReflectionScene reminder={verse.reminder} onBack={() => setReflecting(false)} />
          )}
        </AnimatePresence>
      </section>

      {/*
        justify-start, not justify-center like the placeholder had: with
        99 real cards this section is reliably taller than one viewport,
        and centering tall content inside a min-h-screen box pushes the
        heading down past the fold — you'd scroll into empty space
        before reaching anything. Starting from the top means the
        heading is the first thing visible as soon as the section comes
        into view, same reasoning applied to the Themes section below.
      */}
      <section
        id="names"
        className="flex min-h-screen flex-col items-center justify-start gap-6 px-6 py-16 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="font-arabic text-2xl text-gold">الأسماء الحسنى</p>
          <h2 className="font-serif text-lg uppercase tracking-[0.3em] text-muted-foreground">
            The 99 Names
          </h2>
        </div>
        <NamesGrid />
      </section>

      <section
        id="themes"
        className="flex min-h-screen flex-col items-center justify-start gap-6 px-6 py-16 text-center"
      >
        <h2 className="font-serif text-lg uppercase tracking-[0.3em] text-muted-foreground">
          Themes
        </h2>
        <ThemesBrowser />
      </section>

      {/*
        Required by the CC-BY-4.0 license on both 3D book models —
        attribution has to be given somewhere; this is a placeholder spot
        until there's a proper About/credits page.
      */}
      <footer className="px-6 py-8 text-center text-[11px] text-muted-foreground/60">
        <p>
          Closed book model:{" "}
          <a
            href="https://skfb.ly/osXrA"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground"
          >
            &quot;Quran 3D Free&quot;
          </a>{" "}
          by Muhammed Reca Mermutluoğlu, licensed under{" "}
          <a
            href="http://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground"
          >
            CC BY 4.0
          </a>
          .
        </p>
        <p className="mt-1">
          Open book model:{" "}
          <a
            href="https://skfb.ly/69SVR"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground"
          >
            &quot;Book&quot;
          </a>{" "}
          by Pixel, licensed under{" "}
          <a
            href="http://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground"
          >
            CC BY 4.0
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
