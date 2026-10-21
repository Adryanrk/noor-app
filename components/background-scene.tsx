/**
 * A dim, ambient background loop: a shaft of light breaking through dark
 * clouds over a still sea, with a small boat at the base of the beam.
 * The source clip is a tall, portrait-ish composition, but the page is
 * usually much wider than that — a plain `object-cover` on a wide screen
 * crops the top and bottom clean off, hiding the boat and leaving only
 * an abstract bright column. To keep the full composition visible at any
 * width, two copies are layered: a blurred, scaled-up copy fills the
 * edges, and a sharp copy sits on top scaled to fit height so nothing is
 * cropped out. Falls back to the same layering with the poster image
 * when the visitor prefers reduced motion.
 */
export function BackgroundScene() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Blurred fill, stretched to cover every edge of the viewport */}
      <video
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/sea-storm.jpg"
      >
        <source src="/media/sea-storm.mp4" type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/sea-storm.jpg"
        alt=""
        className="hidden h-full w-full scale-110 object-cover opacity-40 blur-2xl motion-reduce:block"
      />

      {/* Sharp copy, fit to height so the whole beam-to-boat scene stays visible */}
      <video
        className="absolute inset-0 h-full w-full object-contain opacity-70 motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/sea-storm.jpg"
      >
        <source src="/media/sea-storm.mp4" type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/sea-storm.jpg"
        alt=""
        className="hidden h-full w-full object-contain opacity-70 motion-reduce:block"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/35 to-background/65" />
    </div>
  );
}
