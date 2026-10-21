// Single source of truth for "how much room does this verse need," shared
// between VerseDisplay (which uses it to pick text classes) and page.tsx
// (which uses it to shrink the book's own canvas a little on the longest
// verses, so the whole stack — header, card, book, button — still fits
// without the book getting pushed out of view). Keeping both reads from
// one table means they can't drift out of sync the way two separately
// hand-written threshold ladders eventually would.
//
// bookHeight values were originally 300/280/250/215 — trimmed down by
// roughly 10% across the board (270/250/225/195) after an actual
// screenshot showed the budget was wrong: even a SHORT verse (tier 0)
// was triggering the card's scroll fallback, because the "always
// present" chrome (header, padding, gaps, book) ate nearly the whole
// viewport on a real laptop-height window, leaving almost nothing for
// even a few lines of text. Shrinking the book height a little is safe
// for its on-screen size specifically because the 3D camera's vertical
// FOV is fixed — a shorter canvas changes how much HORIZONTAL margin is
// visible around the book, not how much of it gets cropped top-to-
// bottom, so this doesn't fight the separate "make the book bigger"
// request (that's CLOSED_MODEL_SCALE in book-model.tsx, a different
// knob entirely). See page.tsx for the matching padding/gap trims.
export interface VerseSizeTier {
  maxLength: number;
  arabic: string;
  translit: string;
  translation: string;
  gap: string;
  bookHeight: number;
}

export const VERSE_SIZE_TIERS: VerseSizeTier[] = [
  { maxLength: 160, arabic: "text-3xl", translit: "text-sm", translation: "text-lg", gap: "gap-4", bookHeight: 270 },
  { maxLength: 260, arabic: "text-2xl", translit: "text-xs", translation: "text-base", gap: "gap-3", bookHeight: 250 },
  { maxLength: 380, arabic: "text-xl", translit: "text-[11px]", translation: "text-sm", gap: "gap-2", bookHeight: 225 },
  { maxLength: Infinity, arabic: "text-lg", translit: "text-[10px]", translation: "text-xs", gap: "gap-1.5", bookHeight: 195 },
];

export function getVerseSizeTier(length: number): VerseSizeTier {
  return VERSE_SIZE_TIERS.find((tier) => length <= tier.maxLength) ?? VERSE_SIZE_TIERS[VERSE_SIZE_TIERS.length - 1];
}
