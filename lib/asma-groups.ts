import { asmaUlHusna, type AsmaName } from "@/data/asma-ul-husna";

// Shared by NamesGrid (the scroll-reveal grid) and NamesQuiz (the
// flashcard practice groups) — same reasoning as verse-sizing.ts being
// shared between VerseDisplay and page.tsx: one source of truth for
// "how the 99 are chunked" means the grid's section labels and the
// quiz's group picker can't quietly drift out of sync with each other.
export const ASMA_GROUP_SIZE = 10;

export interface AsmaGroup {
  label: string;
  names: AsmaName[];
}

function buildGroups(): AsmaGroup[] {
  const groups: AsmaGroup[] = [];
  for (let i = 0; i < asmaUlHusna.length; i += ASMA_GROUP_SIZE) {
    const chunk = asmaUlHusna.slice(i, i + ASMA_GROUP_SIZE);
    const label =
      chunk.length > 1
        ? `${chunk[0].number}–${chunk[chunk.length - 1].number}`
        : `${chunk[0].number}`;
    groups.push({ label, names: chunk });
  }
  return groups;
}

export const ASMA_GROUPS: AsmaGroup[] = buildGroups();
