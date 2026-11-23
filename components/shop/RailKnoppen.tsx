"use client";

// Vorige/volgende-knoppen voor een horizontaal scrollende rij, zelfde stijl
// als in ClusterCarousel. De rij zelf blijft een server component; deze
// knoppen zoeken hem op via het id.
export default function RailKnoppen({ doel }: { doel: string }) {
  function scroll(richting: 1 | -1) {
    const el = document.getElementById(doel);
    if (!el) return;
    const kaart = el.firstElementChild as HTMLElement | null;
    const stap = kaart ? (kaart.offsetWidth + 20) * 2 : Math.round(el.clientWidth * 0.5);
    el.scrollBy({ left: richting * stap, behavior: "smooth" });
  }
  const knop =
    "w-10 h-10 rounded-full bg-papier ring-1 ring-lijn text-inkt hover:ring-walnoot hover:text-walnoot transition-colors flex items-center justify-center";
  return (
    <div className="hidden sm:flex gap-2 shrink-0">
      <button type="button" onClick={() => scroll(-1)} aria-label="Vorige" className={knop}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="Volgende" className={knop}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
