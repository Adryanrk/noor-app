import { curatedVerses, type CuratedVerse, type Theme } from "@/data/curated-verses";

function verseKey(v: Pick<CuratedVerse, "surah" | "ayah">) {
  return `${v.surah}:${v.ayah}`;
}

/**
 * Picks a random verse from the curated pool. If `excluding` is given,
 * that verse is left out of the draw so "show another verse" never
 * immediately repeats the one already on screen (unless the pool only
 * has one entry, in which case it's returned again).
 */
export function pickRandomVerse(
  excluding?: Pick<CuratedVerse, "surah" | "ayah">
): CuratedVerse {
  const pool = excluding
    ? curatedVerses.filter((v) => verseKey(v) !== verseKey(excluding))
    : curatedVerses;

  const source = pool.length > 0 ? pool : curatedVerses;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
}

export function versesByTheme(theme: Theme): CuratedVerse[] {
  return curatedVerses.filter((v) => v.themes.includes(theme));
}

export function findCuratedVerse(surah: number, ayah: number): CuratedVerse | undefined {
  return curatedVerses.find((v) => v.surah === surah && v.ayah === ayah);
}
