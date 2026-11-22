"use client";

import { useEffect, useState } from "react";
import type { Beeld } from "@/lib/shopify";

// Fotogalerij op de productpagina: grote foto met klikbare miniaturen. Op
// desktop staan de miniaturen links in het vlak, mobiel eronder.
export default function ProductGalerij({ beelden, naam }: { beelden: Beeld[]; naam: string }) {
  const [actief, setActief] = useState(0);
  // Foto van een gekozen uitvoering die niet tussen de eerste zes miniaturen staat.
  const [extra, setExtra] = useState<string | null>(null);

  useEffect(() => {
    function opVariant(e: Event) {
      const url = (e as CustomEvent<string>).detail;
      const i = beelden.slice(0, 6).findIndex((b) => b.url === url);
      if (i > -1) {
        setActief(i);
        setExtra(null);
      } else if (beelden.some((b) => b.url === url)) {
        setExtra(url);
      }
    }
    window.addEventListener("variant-beeld", opVariant);
    return () => window.removeEventListener("variant-beeld", opVariant);
  }, [beelden]);

  if (beelden.length === 0) {
    return <div className="aspect-square bg-zand rounded-sm" aria-hidden />;
  }
  const aantal = Math.min(beelden.length, 6);
  const huidig = Math.min(actief, aantal - 1);
  const groot = extra ? (beelden.find((b) => b.url === extra) ?? beelden[huidig]) : beelden[huidig];
  const kiesFoto = (i: number) => {
    setExtra(null);
    setActief(i);
  };
  const stap = (delta: number) => kiesFoto((huidig + delta + aantal) % aantal);

  return (
    <div className="min-w-0 md:flex md:flex-row-reverse md:gap-4">
      <div className="relative min-w-0 flex-1 aspect-square bg-zand rounded-sm p-6 sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={groot.url}
          alt={groot.altText ?? naam}
          className="w-full h-full object-contain mix-blend-multiply"
        />
        {aantal > 1 && (
          <div className="absolute right-3 bottom-3 flex gap-2">
            {[-1, 1].map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => stap(delta)}
                aria-label={delta < 0 ? "Vorige foto" : "Volgende foto"}
                className="w-9 h-9 rounded-full bg-inkt/85 text-papier flex items-center justify-center hover:bg-inkt transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden className={delta < 0 ? "rotate-90" : "-rotate-90"}>
                  <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
      {aantal > 1 && (
        <ul className="mt-3 md:mt-0 flex md:flex-col gap-3 list-none p-0 m-0 md:w-20 shrink-0 overflow-x-auto md:overflow-visible">
          {beelden.slice(0, aantal).map((b, i) => (
            <li key={b.url} className="list-none m-0 p-0 w-16 shrink-0 md:w-full">
              <button
                type="button"
                onClick={() => kiesFoto(i)}
                aria-label={`Foto ${i + 1} van ${naam}`}
                aria-pressed={!extra && i === huidig}
                className={`block w-full aspect-square bg-zand rounded-sm p-1.5 border transition-colors ${
                  !extra && i === huidig ? "border-walnoot" : "border-transparent hover:border-lijn"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.url} alt="" loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
