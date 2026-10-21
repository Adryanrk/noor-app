Noor — A Verse to Reflect On

A daily Qur'an verse experience. A 3D book opens to reveal a curated verse — Arabic script, transliteration, and translation — alongside a short personal reflection. Also includes a browsable grid of the 99 Names of Allah (with a flashcard quiz to help memorize them) and a Themes section for browsing curated verses by topic (patience, hope, trust, and more).

Tech stack
Next.js (App Router, TypeScript)
Tailwind CSS v4 + Base UI / shadcn ("base-nova" style) for styling and components
React Three Fiber + drei + Three.js for the animated 3D book (two real GLB models — see Credits below)
Framer Motion for layout, scroll-reveal, and overlay animations throughout
Al Quran Cloud API (api.alquran.cloud) for live verse text — Arabic (Uthmani script), Sahih International translation, and transliteration, fetched per verse at request time
Features
Verse of the day — a random verse drawn from a curated pool (data/curated-verses.ts), each with its own short written reflection. "Show another verse" draws a different one without repeating the current pick.
3D book — closed book stands upright; tapping it opens to a flat spread with a camera angle that eases from a steeper, standing-book-friendly pitch to a flatter, more side-on angle as it opens, keeping the (intentionally blank) interior pages out of direct view.
Reflection view — a second tap reveals the verse's personal reflection over the ambient background scene.
The 99 Names — all 99 names (Arabic, transliteration, short meaning), grouped in tens with scroll-reveal animation. Tap a name for a short explanation of what it signifies; a "Practice the Names" button opens a flashcard quiz (pick a group of 10, flip through, no scoring).
Themes — browse the curated verse pool by theme (patience, hope, trust in Allah, mercy & forgiveness, gratitude, guidance, peace of heart, self-reflection); each theme pill shows how many curated verses it currently has.
Setup
git clone https://github.com/Adryanrk/noor-app.git
cd noor-app
npm install
Environment variables

None needed. The only external data source is the Al Quran Cloud API, which is public and keyless — nothing to configure locally or in Vercel's environment variable settings.

Running locally
npm run dev

Opens at http://localhost:3000.

To verify a production build before deploying:

npm run build
Security

No authentication, user accounts, or stored user data anywhere in this app — it's a static client experience with one outgoing call to a public, keyless API. There's no secret to leak and no per-user data to isolate, so there isn't a meaningful attack surface beyond what any static Next.js site has.

Credits

Both 3D book models are used under CC BY 4.0 and credited in the page footer:

Closed book: "Quran 3D Free" by Muhammed Reca Mermutluoğlu, licensed under CC BY 4.0.
Open book: "Book" by Pixel, licensed under CC BY 4.0.

Verse text (Arabic, translation, transliteration) is served by the Al Quran Cloud API.

Live deployment

https://noor-app-ruby.vercel.app/
