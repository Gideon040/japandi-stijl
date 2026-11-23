"use client";

import { useState, type ReactNode } from "react";

// Toont de eerste collecties en klapt de rest uit met een knop, zodat de
// homepage rustig blijft. De overige kaarten staan wel in de HTML (verborgen),
// zodat zoekmachines alle collectielinks zien.
export default function CollectieLijst({ kaarten, zichtbaar }: { kaarten: ReactNode[]; zichtbaar: number }) {
  const [open, setOpen] = useState(false);
  const meer = kaarten.length - zichtbaar;
  return (
    <>
      <ul className="mt-10 mb-0 p-0 grid gap-6 grid-cols-2 lg:grid-cols-4">
        {kaarten.map((k, i) => (
          <li key={i} className={`list-none m-0 p-0${!open && i >= zichtbaar ? " hidden" : ""}`}>
            {k}
          </li>
        ))}
      </ul>
      {meer > 0 && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="rounded-full border border-walnoot px-6 py-2.5 text-sm text-walnoot hover:bg-walnoot hover:text-papier transition-colors"
          >
            {open ? "Minder collecties" : `Meer collecties (${meer})`}
          </button>
        </div>
      )}
    </>
  );
}
