"use client";

import { useEffect, useState } from "react";

type Item = {
  staal: string; // CSS-kleur of gradient voor de materiaalstaal (fallback)
  textuur?: string; // textuur-key, resolvet naar /images/textuur-{key}.webp
  naam: string;
  subtitel?: string;
  prijs?: string; // prijsindicatie, bijv. "vanaf 150 euro"
  opmerking: string; // let-op of korte typering
};

type Props = { items: Item[]; caption?: string };

// Staal met optionele textuurfoto. Toont de close-up als het webp bestaat,
// valt anders netjes terug op de platte kleur. Met textuur is het een knop
// die de zoom-lightbox opent.
function Staal({ item, onOpen, omhoog }: { item: Item; onOpen: () => void; omhoog?: boolean }) {
  const [ok, setOk] = useState(Boolean(item.textuur));
  const toonTextuur = Boolean(item.textuur) && ok;

  const inhoud = (
    <span
      className="block w-full h-full rounded-sm overflow-hidden"
      style={{ background: item.staal }}
      aria-hidden
    >
      {item.textuur && ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/textuur-${item.textuur}.webp`}
          alt=""
          onError={() => setOk(false)}
          className="w-full h-full object-cover"
        />
      )}
    </span>
  );

  if (!toonTextuur) {
    return <span className="w-[3.4rem] h-[3.4rem] row-span-2 sm:row-span-1">{inhoud}</span>;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Bekijk de structuur van ${item.naam} van dichtbij`}
      className="group relative w-[3.4rem] h-[3.4rem] row-span-2 sm:row-span-1 rounded-sm ring-1 ring-lijn hover:ring-walnoot transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-walnoot"
    >
      {inhoud}
      {/* Altijd zichtbaar loep-badge: maakt duidelijk dat hier een close-up zit */}
      <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-papier ring-1 ring-lijn shadow-sm text-walnoot group-hover:opacity-0 transition-opacity" aria-hidden>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11 11l4 4M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      {/* Hover-preview: vouwt naast het staal uit met een zachte animatie */}
      <span
        className={`pointer-events-none absolute z-30 left-full ml-4 w-64 md:w-[24rem] scale-90 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 ${
          omhoog ? "bottom-0 origin-bottom-left" : "top-1/2 -translate-y-1/2 origin-left"
        }`}
        aria-hidden
      >
        <span className="block overflow-hidden rounded-lg bg-papier ring-1 ring-lijn shadow-2xl">
          <span className="block w-full aspect-square" style={{ background: item.staal }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/textuur-${item.textuur}.webp`} alt="" className="w-full h-full object-cover" />
          </span>
          <span className="block px-4 py-3 font-display text-lg leading-snug text-inkt">{item.naam}</span>
        </span>
      </span>
    </button>
  );
}

// Editoriale rijenlijst voor materiaal- of kleurvergelijkingen
// (designreferentie): dikke lijn boven, gekleurde staal of textuurfoto,
// naam groot, prijsindicatie in walnoot, opmerking cursief. In MDX ook
// bruikbaar als <KleurenKaart /> voor kleurpaletten.
export default function MateriaalKaart({ items, caption }: Props) {
  const [zoom, setZoom] = useState<Item | null>(null);
  const heeftTextuur = items.some((i) => i.textuur);

  useEffect(() => {
    if (!zoom) return;
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") setZoom(null);
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [zoom]);

  return (
    <div className="max-w-[54rem] my-10">
      {heeftTextuur && (
        <p className="flex items-center gap-2 text-sm text-klei italic mb-3 mt-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-papier ring-1 ring-lijn text-walnoot not-italic" aria-hidden>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M11 11l4 4M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          Beweeg over een staal om de structuur van dichtbij te zien.
        </p>
      )}
      <div className="border-t-2 border-inkt">
      {items.map((item, i) => (
        <div
          key={item.naam}
          className="grid grid-cols-[3.4rem_1fr] sm:grid-cols-[3.4rem_1.3fr_1fr_1.6fr] gap-x-5 gap-y-1 items-center border-b border-lijn py-5"
        >
          <Staal item={item} onOpen={() => setZoom(item)} omhoog={items.length > 3 && i >= items.length - 2} />
          <span>
            <span className="font-display text-xl block leading-snug">{item.naam}</span>
            {item.subtitel && <span className="text-sm text-klei block">{item.subtitel}</span>}
          </span>
          <span className="text-walnoot font-medium text-sm col-start-2 sm:col-start-3">
            {item.prijs}
          </span>
          <span className="italic text-sm text-inkt/80 col-start-2 sm:col-start-4">
            {item.opmerking}
          </span>
        </div>
      ))}
      </div>
      {caption && <p className="italic text-sm text-klei text-right mt-3 mb-0">{caption}</p>}

      {zoom && zoom.textuur && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inkt/70 p-6"
          onClick={() => setZoom(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Structuur van ${zoom.naam}`}
        >
          <div
            className="bg-papier rounded-sm overflow-hidden max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/textuur-${zoom.textuur}.webp`}
              alt={`Structuur van ${zoom.naam} van dichtbij`}
              className="w-full aspect-square object-cover"
            />
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <span>
                <span className="font-display text-lg block leading-snug">{zoom.naam}</span>
                {zoom.subtitel && <span className="text-sm text-klei block">{zoom.subtitel}</span>}
              </span>
              <button
                type="button"
                onClick={() => setZoom(null)}
                aria-label="Sluiten"
                className="shrink-0 text-klei hover:text-inkt transition-colors -mr-1"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
