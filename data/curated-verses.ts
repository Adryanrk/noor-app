export type Theme =
  | "patience"
  | "hope"
  | "trust"
  | "mercy"
  | "gratitude"
  | "guidance"
  | "peace"
  | "self-reflection";

export const THEME_LABELS: Record<Theme, string> = {
  patience: "Patience",
  hope: "Hope",
  trust: "Trust in Allah",
  mercy: "Mercy & Forgiveness",
  gratitude: "Gratitude",
  guidance: "Guidance",
  peace: "Peace of Heart",
  "self-reflection": "Self-Reflection",
};

export interface CuratedVerse {
  surah: number;
  ayah: number;
  themes: Theme[];
  /**
   * A short, personal reflection tied strictly to this verse's own Sahih
   * International meaning. Written as a heartfelt note, never as a
   * scholarly ruling, hadith citation, or historical claim about why the
   * verse was revealed. Every entry here is a first draft the user
   * reviews and approves before anything goes live.
   */
  reminder: string;
}

export const curatedVerses: CuratedVerse[] = [
  {
    surah: 94,
    ayah: 6,
    themes: ["hope", "patience"],
    reminder:
      "No matter what you're carrying right now, this promise sits right next to it — ease isn't a maybe here, it's already on its way.",
  },
  {
    surah: 2,
    ayah: 286,
    themes: ["trust", "patience"],
    reminder:
      "You're never given more than you can bear — and you're never expected to carry it alone, without asking for mercy, forgiveness, and a little more ease.",
  },
  {
    surah: 65,
    ayah: 3,
    themes: ["trust"],
    reminder:
      "Let go of the part that was never yours to control — the outcome isn't yours to force, only to trust.",
  },
  {
    surah: 39,
    ayah: 53,
    themes: ["mercy", "hope"],
    reminder:
      "Whatever you're carrying from your past, this verse exists to close that door, not keep it open. Forgiveness here isn't rationed — it's promised in full.",
  },
  {
    surah: 2,
    ayah: 153,
    themes: ["patience"],
    reminder:
      "Patience isn't passive waiting — it's a companion you're never asked to sit with alone.",
  },
  {
    surah: 13,
    ayah: 28,
    themes: ["peace", "trust"],
    reminder:
      "If your chest feels tight today, this is the remedy the Qur'an names by name: remembrance, not distraction.",
  },
  {
    surah: 12,
    ayah: 87,
    themes: ["hope"],
    reminder:
      "Even when the search feels hopeless, despair is the one door this verse tells you to never walk through.",
  },
  {
    surah: 3,
    ayah: 139,
    themes: ["patience", "hope"],
    reminder:
      "Grief and weakness are allowed to visit — just don't let them move in. You're still the one being asked to rise.",
  },
  {
    surah: 29,
    ayah: 69,
    themes: ["guidance"],
    reminder:
      "The guidance doesn't wait for the effort to finish — it walks beside it. Every honest step is already being met halfway.",
  },
  {
    surah: 20,
    ayah: 25,
    themes: ["peace", "patience"],
    reminder:
      "Sometimes the most powerful prayer is the simplest one — just asking for a little more room to breathe.",
  },
  {
    surah: 14,
    ayah: 7,
    themes: ["gratitude"],
    reminder:
      "Gratitude isn't just a reaction to having enough — it's often the very thing that invites more.",
  },
  {
    surah: 53,
    ayah: 39,
    themes: ["guidance", "self-reflection"],
    reminder:
      "Nothing you've genuinely put effort into is wasted — not even the parts no one else ever saw.",
  },
  {
    surah: 2,
    ayah: 152,
    themes: ["gratitude", "peace"],
    reminder:
      "It's a two-way remembrance — the moment you turn toward Him, He's already turning toward you.",
  },
  {
    surah: 13,
    ayah: 11,
    themes: ["self-reflection"],
    reminder:
      "Real change rarely starts on the outside. This verse points inward first — to what's already sitting in your own heart.",
  },
];
