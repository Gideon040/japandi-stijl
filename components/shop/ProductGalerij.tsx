"use client";

import { useState } from "react";
import type { Beeld } from "@/lib/shopify";

// Fotogalerij op de productpagina: grote foto met klikbare miniaturen.
export default function ProductGalerij({ beelden, naam }: { beelden: Beeld[]; naam: string }) {
  const [actief, setActief] = useState(0);
  if (beelden.length === 0) {
    return <div className="aspect-square bg-zand rounded-sm" aria-hidden />;
  }
  const groot = beelden[Math.min(actief, beelden.length - 1)];
  return (
    <div>
      <div className="aspect-square bg-zand rounded-sm p-6 sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={groot.url}
          alt={groot.altText ?? naam}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
      {beelden.length > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3 list-none p-0 m-0">
          {beelden.slice(0, 10).map((b, i) => (
            <li key={b.url} className="list-none m-0 p-0">
              <button
                type="button"
                onClick={() => setActief(i)}
                aria-label={`Foto ${i + 1} van ${naam}`}
                aria-pressed={i === actief}
                className={`block w-full aspect-square bg-zand rounded-sm p-1.5 border transition-colors ${
                  i === actief ? "border-walnoot" : "border-transparent hover:border-lijn"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.url}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
