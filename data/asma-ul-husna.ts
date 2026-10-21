// The 99 Names (Asma al-Husna) of Allah. Static, canonical content — unlike
// the curated verses, this never changes, so it's hardcoded here rather
// than fetched live, matching the existing pattern of "stable content lives
// in a data file, only the verse-of-the-day's actual Qur'anic text is
// fetched live" (see lib/quran.ts).
//
// Sourced from the traditional, widely-used ordering of the 99 names (the
// same order you'll see on virtually every poster/app), cross-checked
// against a Qur'an-usage-based table before writing this file so the
// Arabic and meanings are verified, not just typed from memory. The
// transliteration here is deliberately the simple/popular spelling
// (no macrons or ayn/hamza diacritics — "Ar-Rahman", not "Ar-Raḥmān") to
// match the plain-ASCII style already used for verse transliterations
// elsewhere in the app (see the "Fazkurooneee azkurkum..." style in
// VerseDisplay). Where a name has several possible English renderings,
// one concise meaning was picked rather than a long comma-separated list,
// to match the site's minimal aesthetic.
//
// `explanation` added later, for the click-a-name detail card: one or two
// sentences expanding on `meaning`, kept in an explanatory/factual register
// (per your choice of "kort förklaring" over a personal-reflection tone) —
// deliberately NOT written in the same warm, second-person "you" voice as
// the verse `reminder` texts in curated-verses.ts, since that's a different
// kind of content with a different job. No hadith citations or scholarly
// rulings, same restraint as the verse reminders, just a plain description
// of what the name points to.
export interface AsmaName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  explanation: string;
}

export const asmaUlHusna: AsmaName[] = [
  { number: 1, arabic: "الرحمن", transliteration: "Ar-Rahman", meaning: "The Most Gracious", explanation: "A mercy that reaches every living thing without exception, freely given before anything is asked for it." },
  { number: 2, arabic: "الرحيم", transliteration: "Ar-Raheem", meaning: "The Most Merciful", explanation: "A closer, ongoing mercy — the kind extended again and again to those who turn back." },
  { number: 3, arabic: "الملك", transliteration: "Al-Malik", meaning: "The King", explanation: "A sovereignty that owns everything and depends on nothing, unlike any human rule that borrows its authority from elsewhere." },
  { number: 4, arabic: "القدوس", transliteration: "Al-Quddus", meaning: "The Most Holy", explanation: "Entirely free of flaw, limitation, or imperfection — perfect in a way nothing created could ever be." },
  { number: 5, arabic: "السلام", transliteration: "As-Salam", meaning: "The Source of Peace", explanation: "The origin of all safety and wholeness, and the one true freedom from fear." },
  { number: 6, arabic: "المؤمن", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith", explanation: "The one who grants security and confirms the truth of every promise made." },
  { number: 7, arabic: "المهيمن", transliteration: "Al-Muhaymin", meaning: "The Protector", explanation: "Watching over all things closely, missing nothing, overseeing creation without ever needing rest." },
  { number: 8, arabic: "العزيز", transliteration: "Al-Aziz", meaning: "The Almighty", explanation: "Possessing a strength and honor that cannot be overpowered or diminished by anything." },
  { number: 9, arabic: "الجبار", transliteration: "Al-Jabbar", meaning: "The Compeller", explanation: "The one whose will nothing can resist — and who also mends what is broken." },
  { number: 10, arabic: "المتكبر", transliteration: "Al-Mutakabbir", meaning: "The Majestic", explanation: "A greatness that belongs to no one else, free of any trace of the pride that in people usually comes from insecurity." },
  { number: 11, arabic: "الخالق", transliteration: "Al-Khaliq", meaning: "The Creator", explanation: "The one who brings everything into being from nothing, with purpose and precision." },
  { number: 12, arabic: "البارئ", transliteration: "Al-Bari", meaning: "The Evolver", explanation: "Shaping creation into its given form, each part fitting exactly as it was meant to." },
  { number: 13, arabic: "المصور", transliteration: "Al-Musawwir", meaning: "The Fashioner", explanation: "Giving every created thing its own particular shape and likeness — no two alike." },
  { number: 14, arabic: "الغفار", transliteration: "Al-Ghaffar", meaning: "The Repeatedly Forgiving", explanation: "A forgiveness that doesn't run out, extended again each time it's sincerely sought." },
  { number: 15, arabic: "القهار", transliteration: "Al-Qahhar", meaning: "The Subduer", explanation: "Holding complete power over all things — before which nothing stands as an equal." },
  { number: 16, arabic: "الوهاب", transliteration: "Al-Wahhab", meaning: "The Bestower", explanation: "Giving generously and without condition, expecting nothing in return." },
  { number: 17, arabic: "الرزاق", transliteration: "Ar-Razzaq", meaning: "The Provider", explanation: "Supplying sustenance to every living thing, seen and unseen, without ever running short." },
  { number: 18, arabic: "الفتاح", transliteration: "Al-Fattah", meaning: "The Opener", explanation: "Opening what was closed — doors, hearts, and understanding alike." },
  { number: 19, arabic: "العليم", transliteration: "Al-Alim", meaning: "The All-Knowing", explanation: "Aware of everything, visible or hidden, down to the smallest detail." },
  { number: 20, arabic: "القابض", transliteration: "Al-Qabid", meaning: "The Constrictor", explanation: "Withholding or narrowing provision and ease exactly as wisdom requires, never without reason." },
  { number: 21, arabic: "الباسط", transliteration: "Al-Basit", meaning: "The Expander", explanation: "Opening up provision, ease, or relief exactly when it's needed most." },
  { number: 22, arabic: "الخافض", transliteration: "Al-Khafid", meaning: "The Abaser", explanation: "Bringing down what was wrongly raised up, restoring things to their rightful place." },
  { number: 23, arabic: "الرافع", transliteration: "Ar-Rafi'", meaning: "The Exalter", explanation: "Raising up in honor and rank whoever deserves it, regardless of how the world happened to see them." },
  { number: 24, arabic: "المعز", transliteration: "Al-Mu'izz", meaning: "The Giver of Honor", explanation: "Granting dignity and strength to whoever it's given to, on no one else's terms." },
  { number: 25, arabic: "المذل", transliteration: "Al-Mudhill", meaning: "The Giver of Dishonor", explanation: "Bringing low whatever pride or falsehood had wrongly lifted up." },
  { number: 26, arabic: "السميع", transliteration: "As-Sami'", meaning: "The All-Hearing", explanation: "Hearing every voice, spoken or silent, near or distant, all at once." },
  { number: 27, arabic: "البصير", transliteration: "Al-Basir", meaning: "The All-Seeing", explanation: "Seeing everything exactly as it is, with nothing hidden from view." },
  { number: 28, arabic: "الحكم", transliteration: "Al-Hakam", meaning: "The Judge", explanation: "The final, fair arbiter whose judgment needs no appeal." },
  { number: 29, arabic: "العدل", transliteration: "Al-Adl", meaning: "The Utterly Just", explanation: "Never unfair in the smallest measure, to anyone, under any circumstance." },
  { number: 30, arabic: "اللطيف", transliteration: "Al-Latif", meaning: "The Subtly Kind", explanation: "A gentleness that reaches into the smallest, quietest details of a life." },
  { number: 31, arabic: "الخبير", transliteration: "Al-Khabir", meaning: "The All-Aware", explanation: "Knowing the inner truth of things, not just their surface." },
  { number: 32, arabic: "الحليم", transliteration: "Al-Halim", meaning: "The Forbearing", explanation: "Patient with mistakes, in no hurry to punish what could still be corrected." },
  { number: 33, arabic: "العظيم", transliteration: "Al-Azim", meaning: "The Magnificent", explanation: "Vast beyond comparison — too great to be measured against anything else." },
  { number: 34, arabic: "الغفور", transliteration: "Al-Ghafur", meaning: "The Forgiving", explanation: "Covering over faults rather than exposing them." },
  { number: 35, arabic: "الشكور", transliteration: "Ash-Shakur", meaning: "The Appreciative", explanation: "Recognizing and rewarding even the smallest sincere effort." },
  { number: 36, arabic: "العلي", transliteration: "Al-Ali", meaning: "The Most High", explanation: "Elevated above every limitation, beyond comparison to anything beneath." },
  { number: 37, arabic: "الكبير", transliteration: "Al-Kabir", meaning: "The Greatest", explanation: "Greater than anything that could be imagined alongside it." },
  { number: 38, arabic: "الحفيظ", transliteration: "Al-Hafiz", meaning: "The Preserver", explanation: "Guarding and keeping safe what would otherwise be lost." },
  { number: 39, arabic: "المقيت", transliteration: "Al-Muqit", meaning: "The Sustainer", explanation: "Supplying exactly what's needed to keep every living thing going." },
  { number: 40, arabic: "الحسيب", transliteration: "Al-Hasib", meaning: "The Reckoner", explanation: "Keeping a perfectly accurate account — sufficient on His own, with no need of anyone else's tally." },
  { number: 41, arabic: "الجليل", transliteration: "Al-Jalil", meaning: "The Majestic", explanation: "Possessing a grandeur that commands awe rather than fear alone." },
  { number: 42, arabic: "الكريم", transliteration: "Al-Karim", meaning: "The Generous", explanation: "Giving nobly and abundantly, far beyond what's asked for." },
  { number: 43, arabic: "الرقيب", transliteration: "Ar-Raqib", meaning: "The Watchful", explanation: "Attentively present over every moment, never distracted or absent." },
  { number: 44, arabic: "المجيب", transliteration: "Al-Mujib", meaning: "The Responsive", explanation: "Answering every sincere call, even the quietest one." },
  { number: 45, arabic: "الواسع", transliteration: "Al-Wasi'", meaning: "The All-Encompassing", explanation: "Vast enough to hold every need, every mercy, every possibility at once." },
  { number: 46, arabic: "الحكيم", transliteration: "Al-Hakim", meaning: "The Wise", explanation: "Placing everything exactly where it belongs, for reasons that always hold up." },
  { number: 47, arabic: "الودود", transliteration: "Al-Wadud", meaning: "The Loving", explanation: "A love that is warm, genuine, and freely given." },
  { number: 48, arabic: "المجيد", transliteration: "Al-Majid", meaning: "The Glorious", explanation: "Possessing a nobility and honor that need no outside recognition." },
  { number: 49, arabic: "الباعث", transliteration: "Al-Ba'ith", meaning: "The Resurrector", explanation: "The one who brings the dead back to life, and revives what felt irreversibly lost." },
  { number: 50, arabic: "الشهيد", transliteration: "Ash-Shahid", meaning: "The Witness", explanation: "Present and aware of everything that happens, with nothing passing unnoticed." },
  { number: 51, arabic: "الحق", transliteration: "Al-Haqq", meaning: "The Truth", explanation: "The one unshakeable reality everything else is measured against." },
  { number: 52, arabic: "الوكيل", transliteration: "Al-Wakil", meaning: "The Trustee", explanation: "The one fully worthy of being relied upon when every other plan runs out." },
  { number: 53, arabic: "القوي", transliteration: "Al-Qawiyy", meaning: "The Strong", explanation: "Possessing a strength that never weakens or runs low." },
  { number: 54, arabic: "المتين", transliteration: "Al-Matin", meaning: "The Firm", explanation: "Unshaken and unmovable, no matter the pressure." },
  { number: 55, arabic: "الولي", transliteration: "Al-Waliyy", meaning: "The Protecting Friend", explanation: "A close, personal guardian to those who turn toward Him." },
  { number: 56, arabic: "الحميد", transliteration: "Al-Hamid", meaning: "The Praiseworthy", explanation: "Deserving of praise in every circumstance, whether or not it's given." },
  { number: 57, arabic: "المحصي", transliteration: "Al-Muhsi", meaning: "The Accounter", explanation: "Keeping precise count of everything, down to what seems too small to matter." },
  { number: 58, arabic: "المبدئ", transliteration: "Al-Mubdi'", meaning: "The Originator", explanation: "Bringing things into existence for the very first time, with nothing prior to copy from." },
  { number: 59, arabic: "المعيد", transliteration: "Al-Mu'id", meaning: "The Restorer", explanation: "Bringing back what once existed and was lost." },
  { number: 60, arabic: "المحيي", transliteration: "Al-Muhyi", meaning: "The Giver of Life", explanation: "The source of life itself, in every form it takes." },
  { number: 61, arabic: "المميت", transliteration: "Al-Mumit", meaning: "The Bringer of Death", explanation: "The one who ordains the end of life, as surely as its beginning." },
  { number: 62, arabic: "الحي", transliteration: "Al-Hayy", meaning: "The Ever-Living", explanation: "Alive in a way that never began and will never end." },
  { number: 63, arabic: "القيوم", transliteration: "Al-Qayyum", meaning: "The Self-Subsisting", explanation: "Sustaining all existence while depending on nothing outside Himself." },
  { number: 64, arabic: "الواجد", transliteration: "Al-Wajid", meaning: "The Perceiver", explanation: "Finding and recognizing all things, missing nothing that exists." },
  { number: 65, arabic: "الماجد", transliteration: "Al-Maajid", meaning: "The Noble", explanation: "Possessing an honor so complete it needs no outside praise to be real." },
  { number: 66, arabic: "الواحد", transliteration: "Al-Wahid", meaning: "The One", explanation: "Singular and without partner in every sense that matters." },
  { number: 67, arabic: "الأحد", transliteration: "Al-Ahad", meaning: "The Unique", explanation: "Without equal, without comparison, utterly singular." },
  { number: 68, arabic: "الصمد", transliteration: "As-Samad", meaning: "The Eternal", explanation: "The one everything else turns to, who turns to no one." },
  { number: 69, arabic: "القادر", transliteration: "Al-Qadir", meaning: "The All-Powerful", explanation: "Able to do anything willed, without limit or effort." },
  { number: 70, arabic: "المقتدر", transliteration: "Al-Muqtadir", meaning: "The Creator of All Power", explanation: "The source every other strength ultimately borrows from." },
  { number: 71, arabic: "المقدم", transliteration: "Al-Muqaddim", meaning: "The Expediter", explanation: "Bringing forward whoever and whatever deserves to go first." },
  { number: 72, arabic: "المؤخر", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer", explanation: "Holding back what isn't yet time for, for reasons that often only become clear later." },
  { number: 73, arabic: "الأول", transliteration: "Al-Awwal", meaning: "The First", explanation: "Existing before anything else began." },
  { number: 74, arabic: "الآخر", transliteration: "Al-Akhir", meaning: "The Last", explanation: "Remaining after everything else has ended." },
  { number: 75, arabic: "الظاهر", transliteration: "Az-Zahir", meaning: "The Manifest", explanation: "Evident in creation itself, visible in everything that exists." },
  { number: 76, arabic: "الباطن", transliteration: "Al-Batin", meaning: "The Hidden", explanation: "Beyond full comprehension — closer than what's visible, yet never fully grasped." },
  { number: 77, arabic: "الوالي", transliteration: "Al-Wali", meaning: "The Governor", explanation: "Overseeing and managing the affairs of everything that exists." },
  { number: 78, arabic: "المتعالي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted", explanation: "Elevated far above any limitation others might try to place on Him." },
  { number: 79, arabic: "البر", transliteration: "Al-Barr", meaning: "The Source of Goodness", explanation: "The origin of every genuine kindness, wherever it's found." },
  { number: 80, arabic: "التواب", transliteration: "At-Tawwab", meaning: "The Ever-Accepting of Repentance", explanation: "Welcoming a sincere return again and again, however many times it's needed." },
  { number: 81, arabic: "المنتقم", transliteration: "Al-Muntaqim", meaning: "The Avenger", explanation: "Setting right what injustice has wronged." },
  { number: 82, arabic: "العفو", transliteration: "Al-Afuww", meaning: "The Pardoner", explanation: "Not just forgiving a fault, but erasing it entirely." },
  { number: 83, arabic: "الرؤوف", transliteration: "Ar-Ra'uf", meaning: "The Most Kind", explanation: "Gentle in a way that goes beyond even mercy — a particular tenderness toward the weak and struggling." },
  { number: 84, arabic: "مالك الملك", transliteration: "Malik-ul-Mulk", meaning: "Owner of All Sovereignty", explanation: "Holding ownership over every kingdom and authority that has ever existed." },
  { number: 85, arabic: "ذو الجلال والإكرام", transliteration: "Dhul-Jalali wal-Ikram", meaning: "Lord of Majesty and Generosity", explanation: "Combining a grandeur that commands awe with a generosity that invites closeness." },
  { number: 86, arabic: "المقسط", transliteration: "Al-Muqsit", meaning: "The Equitable", explanation: "Giving every single thing exactly its due, no more and no less." },
  { number: 87, arabic: "الجامع", transliteration: "Al-Jami'", meaning: "The Gatherer", explanation: "Bringing together what was scattered — people, deeds, and everything in between." },
  { number: 88, arabic: "الغني", transliteration: "Al-Ghani", meaning: "The Self-Sufficient", explanation: "Needing nothing from anyone, while everything needs Him." },
  { number: 89, arabic: "المغني", transliteration: "Al-Mughni", meaning: "The Enricher", explanation: "The one who frees from need, and provides what's genuinely lacking." },
  { number: 90, arabic: "المانع", transliteration: "Al-Mani'", meaning: "The Preventer", explanation: "Holding back harm before it ever reaches you." },
  { number: 91, arabic: "الضار", transliteration: "Ad-Darr", meaning: "The Distressor", explanation: "Permitting hardship when it serves a purpose beyond what's immediately visible." },
  { number: 92, arabic: "النافع", transliteration: "An-Nafi'", meaning: "The Benefactor", explanation: "The true source of benefit behind every good that reaches you." },
  { number: 93, arabic: "النور", transliteration: "An-Nur", meaning: "The Light", explanation: "The light by which everything else becomes visible and understood." },
  { number: 94, arabic: "الهادي", transliteration: "Al-Hadi", meaning: "The Guide", explanation: "Showing the way to those who sincerely seek it." },
  { number: 95, arabic: "البديع", transliteration: "Al-Badi'", meaning: "The Incomparable", explanation: "Original beyond any precedent, with nothing prior to model Himself after." },
  { number: 96, arabic: "الباقي", transliteration: "Al-Baqi", meaning: "The Everlasting", explanation: "Remaining after everything temporary has passed away." },
  { number: 97, arabic: "الوارث", transliteration: "Al-Warith", meaning: "The Inheritor", explanation: "The one to whom everything ultimately returns, after all else has gone." },
  { number: 98, arabic: "الرشيد", transliteration: "Ar-Rashid", meaning: "The Guide to the Right Path", explanation: "Leading unerringly toward what is sound and true." },
  { number: 99, arabic: "الصبور", transliteration: "As-Sabur", meaning: "The Patient", explanation: "Patient beyond any human measure, never rushing to punish what deserves time to change." },
];
