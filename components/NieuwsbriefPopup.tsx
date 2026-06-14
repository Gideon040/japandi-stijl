"use client";

import { useEffect, useState } from "react";

// Nieuwsbrief-inschrijving als modal. Verschijnt 5 seconden na het laden en een
// functionele cookie onthoudt 30 dagen dat hij weg is, zodat hij niet bij elke
// paginalading terugkomt. Geen localStorage (projectregel); een first-party
// cookie valt daarbuiten.
const COOKIE = "nb_popup_gezien";

function alGezien() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
}

function onthoudGesloten() {
  const tot = new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = `${COOKIE}=1; expires=${tot}; path=/; SameSite=Lax`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "bezig" | "klaar";

export default function NieuwsbriefPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fout, setFout] = useState("");
  const [beeldOk, setBeeldOk] = useState(true);

  useEffect(() => {
    if (alGezien()) return;
    const timer = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") sluit();
    }
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = vorige;
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  function sluit() {
    setOpen(false);
    onthoudGesloten();
  }

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email)) {
      setFout("Vul een geldig e-mailadres in.");
      return;
    }
    setFout("");
    setStatus("bezig");
    try {
      // Placeholder: hier komt straks de echte inschrijving (POST /api/nieuwsbrief
      // gekoppeld aan de e-maildienst, met double opt-in). Nu alleen UI.
      await new Promise((r) => setTimeout(r, 700));
      setStatus("klaar");
      onthoudGesloten();
    } catch {
      setStatus("idle");
      setFout("Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inkt/50 p-4"
      onClick={sluit}
      role="dialog"
      aria-modal="true"
      aria-label="Nieuwsbrief inschrijven"
    >
      <div
        className="relative bg-papier rounded-sm shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={sluit}
          aria-label="Sluiten"
          className="absolute top-3 right-3 z-10 rounded-full bg-papier/80 p-2 text-klei hover:text-inkt transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {beeldOk && (
          <div className="aspect-[3/2] w-full overflow-hidden rounded-t-sm bg-zand-diep">
            {/* Client component: ImagePlaceholder is server-only, dus een gewone
                img met fallback. Hergebruikt een bestaand sfeerbeeld. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home-sectie-1.webp"
              alt="Japandi interieur met lage horizontale meubellijn, warm hout en een rustig neutraal palet"
              className="h-full w-full object-cover"
              onError={() => setBeeldOk(false)}
            />
          </div>
        )}

        <div className="p-7 sm:p-9">
          {status === "klaar" ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zand-diep">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-walnoot">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-5 font-display text-2xl text-inkt">Bijna klaar</h2>
              <p className="mt-3 text-inkt leading-relaxed">
                Check je inbox en bevestig je inschrijving via de mail die we net stuurden. Daarna
                ben je erbij.
              </p>
            </div>
          ) : (
            <>
              <p className="font-display italic text-klei text-lg leading-tight">Wekelijkse Japandi-vondsten</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl text-inkt leading-tight">
                De mooiste nieuwe stukken in je inbox
              </h2>
              <p className="mt-4 text-inkt leading-relaxed">
                We speuren elke week het web af naar nieuwe meubels en accessoires die echt bij
                Japandi passen: warm walnoot, natuurlijke materialen en de matte steenlook. De beste
                selecteren we met de hand. Eén mail per week, geen spam.
              </p>
              <form onSubmit={verstuur} className="mt-6">
                <label htmlFor="nb-email" className="sr-only">
                  E-mailadres
                </label>
                <input
                  id="nb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  autoComplete="email"
                  className="w-full rounded-sm border border-lijn bg-papier px-4 py-2.5 text-inkt placeholder:text-klei focus:border-walnoot focus:outline-none"
                />
                {fout && <p className="mt-2 text-sm text-terracotta">{fout}</p>}
                <button
                  type="submit"
                  disabled={status === "bezig"}
                  className="knop-pill bg-walnoot mt-4 w-full justify-center disabled:opacity-60"
                >
                  {status === "bezig" ? "Bezig..." : "Inschrijven"}
                </button>
              </form>
              <p className="mt-4 text-xs text-klei leading-relaxed">
                Je krijgt eerst een bevestigingsmail. Uitschrijven kan altijd met één klik.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
