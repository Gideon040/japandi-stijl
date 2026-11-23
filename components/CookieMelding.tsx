"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bewaarKeuze, laadAnalytics, leesKeuze, trekToestemmingIn } from "@/lib/analytics";

// Rustige cookiemelding onderaan het scherm. Vraagt alleen toestemming voor
// Google Analytics; functionele cookies (winkelwagen, deze keuze) hebben geen
// toestemming nodig. Weigeren is net zo makkelijk als accepteren.
export default function CookieMelding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const keuze = leesKeuze();
    if (keuze === "ja") laadAnalytics();
    if (keuze === null) setOpen(true);
    function heropen() {
      setOpen(true);
    }
    window.addEventListener("cookiemelding:open", heropen);
    return () => window.removeEventListener("cookiemelding:open", heropen);
  }, []);

  if (!open) return null;

  function kies(keuze: "ja" | "nee") {
    const vorige = leesKeuze();
    if (keuze === "nee" && vorige === "ja") {
      trekToestemmingIn();
      return;
    }
    bewaarKeuze(keuze);
    if (keuze === "ja") laadAnalytics();
    setOpen(false);
  }

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookies" className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-wide bg-papier shadow-lg rounded-sm border border-lijn px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-inkt m-0">
          Mogen we met Google Analytics meten hoe de site wordt gebruikt? Zo zien we welke gidsen en
          producten helpen. Zonder toestemming plaatsen we alleen de cookies die nodig zijn voor de
          winkelwagen.{" "}
          <Link href="/privacyverklaring/#cookies" className="underline hover:text-walnoot">
            Meer over cookies
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => kies("nee")} className="rounded-full px-5 py-2.5 text-sm border border-lijn text-inkt hover:border-walnoot transition-colors">
            Weigeren
          </button>
          <button type="button" onClick={() => kies("ja")} className="rounded-full px-5 py-2.5 text-sm bg-walnoot text-papier hover:bg-walnoot/90 transition-colors">
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieInstellingenKnop() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("cookiemelding:open"))}
      className="text-left hover:text-walnoot transition-colors"
    >
      Cookie-instellingen
    </button>
  );
}
