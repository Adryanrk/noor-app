const BASE_URL = "https://api.alquran.cloud/v1";

export interface QuranEditionEntry {
  number: number;
  text: string;
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
  };
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  juz: number;
  page: number;
}

interface QuranApiResponse {
  code: number;
  status: string;
  data: QuranEditionEntry[];
}

export interface AyahBundle {
  surah: number;
  ayah: number;
  surahName: string;
  surahNameArabic: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

/**
 * Fetches a single ayah in three editions at once: the Uthmani Arabic
 * script, the Sahih International English translation, and an English
 * transliteration. One request gives everything the verse card needs.
 */
export async function fetchAyahEditions(
  surah: number,
  ayah: number
): Promise<AyahBundle> {
  const res = await fetch(
    `${BASE_URL}/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih,en.transliteration`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Al Quran Cloud API request failed with status ${res.status}`);
  }

  const json: QuranApiResponse = await res.json();

  if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 3) {
    throw new Error("Unexpected response shape from Al Quran Cloud API");
  }

  const arabicEntry = json.data.find((e) => e.edition.identifier === "quran-uthmani");
  const translationEntry = json.data.find((e) => e.edition.identifier === "en.sahih");
  const transliterationEntry = json.data.find(
    (e) => e.edition.identifier === "en.transliteration"
  );

  if (!arabicEntry || !translationEntry || !transliterationEntry) {
    throw new Error("Missing an expected edition in the Al Quran Cloud API response");
  }

  return {
    surah: arabicEntry.surah.number,
    ayah: arabicEntry.numberInSurah,
    surahName: arabicEntry.surah.englishName,
    surahNameArabic: arabicEntry.surah.name,
    arabic: arabicEntry.text,
    transliteration: transliterationEntry.text,
    translation: translationEntry.text,
  };
}
