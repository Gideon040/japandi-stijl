"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { ClusterKaart } from "@/lib/clusters";

// Beeld met nette fallback: toont een zandvlak met initiaal als het
// hero-webp nog niet bestaat, zodat er nooit een gebroken beeld verschijnt.
function KaartBeeld({ id, titel }: { id: string; titel: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zand-diep text-walnoot/40 font-display text-3xl">
        {titel.replace(/^Japandi\s+/i, "").charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${id}.webp`}
      alt=""
      aria-hidden
      onError={() => setOk(false)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function ClusterCarousel({ titel, kaarten }: { titel: string; kaarten: ClusterKaart[] }) {
  const spoor = useRef<HTMLDivElement>(null);

  function scroll(richting: 1 | -1) {
    const el = spoor.current;
    if (!el) return;
    // Stap van ongeveer 2 kaarten per klik (kaartbreedte plus gap).
    const kaart = el.firstElementChild as HTMLElement | null;
    const stap = kaart ? (kaart.offsetWidth + 16) * 2 : Math.round(el.clientWidth * 0.5);
    el.scrollBy({ left: richting * stap, behavior: "smooth" });
  }

  return (
    <section className="bg-zand border-t border-lijn">
      <div className="max-w-wide mx-auto px-6 pt-4 pb-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl sm:text-3xl text-inkt m-0">{titel}</h2>
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Vorige"
              className="w-10 h-10 rounded-full bg-papier ring-1 ring-lijn text-inkt hover:ring-walnoot hover:text-walnoot transition-colors flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Volgende"
              className="w-10 h-10 rounded-full bg-papier ring-1 ring-lijn text-inkt hover:ring-walnoot hover:text-walnoot transition-colors flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={spoor}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {kaarten.map((kaart) => (
            <Link
              key={kaart.href}
              href={kaart.href}
              className="group shrink-0 snap-start w-44 sm:w-56 no-underline"
            >
              <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-zand-diep ring-1 ring-lijn">
                <KaartBeeld id={kaart.beeldId} titel={kaart.titel} />
              </div>
              <span className="mt-3 flex items-center justify-between gap-2 font-display text-base text-inkt leading-snug">
                {kaart.titel}
                <span className="text-klei transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
                  &#8594;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
