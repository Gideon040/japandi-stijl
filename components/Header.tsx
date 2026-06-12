"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavGroep } from "@/lib/navigatie";

// Sfeerbeeld in de dropdown. Verbergt zichzelf netjes als het webp-bestand
// nog niet bestaat, zodat er nooit een gebroken-beeld-icoon verschijnt.
function DropdownBeeld({ id }: { id: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className="relative shrink-0 w-40 self-stretch bg-zand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${id}.webp`}
        alt=""
        aria-hidden
        onError={() => setOk(false)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default function Header({ nav }: { nav: NavGroep[] }) {
  const [openGroep, setOpenGroep] = useState<string | null>(null);
  const [mobielOpen, setMobielOpen] = useState(false);
  const [mobielGroep, setMobielGroep] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Sluit desktop-dropdown bij klik buiten de nav en bij Escape.
  useEffect(() => {
    function buiten(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroep(null);
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenGroep(null);
        setMobielOpen(false);
      }
    }
    document.addEventListener("mousedown", buiten);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", buiten);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Topbalk: positionering en belofte */}
      <div className="bg-walnoot text-papier/90 text-xs">
        <div className="max-w-wide mx-auto px-6 h-9 flex items-center justify-between">
          <span className="tracking-wide">
            Onafhankelijke Japandi koopgids
            <span className="hidden sm:inline">{" · "}eerlijke, geteste selectie</span>
          </span>
          <nav className="hidden sm:flex items-center gap-5">
            <Link href="/#definitie" className="hover:text-papier transition-colors">
              Wat is Japandi
            </Link>
            <Link href="/over-ons/" className="hover:text-papier transition-colors">
              Over ons
            </Link>
            <Link href="/contact/" className="hover:text-papier transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Hoofdbalk */}
      <div className="bg-papier/95 backdrop-blur border-b border-lijn">
        <div ref={navRef} className="max-w-wide mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl sm:text-2xl shrink-0" onClick={() => setMobielOpen(false)}>
            japandi-stijl<span className="text-klei">.nl</span>
          </Link>

          {/* Desktop-nav met dropdowns */}
          <nav className="hidden md:flex items-stretch gap-1 text-sm">
            {nav.map((groep) => {
              const open = openGroep === groep.titel;
              return (
                <div
                  key={groep.titel}
                  className="relative flex items-center"
                  onMouseEnter={() => setOpenGroep(groep.titel)}
                  onMouseLeave={() => setOpenGroep((v) => (v === groep.titel ? null : v))}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setOpenGroep(open ? null : groep.titel)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-sm transition-colors ${
                      open ? "text-walnoot" : "text-inkt hover:text-walnoot"
                    }`}
                  >
                    {groep.titel}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      aria-hidden
                      className={`transition-transform ${open ? "rotate-180" : ""}`}
                    >
                      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>

                  {open && (
                    <div className="absolute left-0 top-full pt-2 w-[32rem]">
                      <div className="bg-papier border border-lijn rounded-sm shadow-lg overflow-hidden flex h-64">
                        {groep.beeld && <DropdownBeeld id={groep.beeld} />}
                        <div className="flex-1 min-w-0 flex flex-col">
                          {groep.href && (
                            <Link
                              href={groep.href}
                              className="block px-4 py-3 bg-zand text-walnoot font-display border-b border-lijn hover:bg-zand-diep transition-colors"
                              onClick={() => setOpenGroep(null)}
                            >
                              {groep.hubLabel ?? "Bekijk alles"}
                              <span className="ml-1">&rarr;</span>
                            </Link>
                          )}
                          <ul className="p-2 grid grid-cols-2 gap-x-2 content-start flex-1 overflow-y-auto">
                            {groep.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block px-3 py-2 rounded-sm text-inkt hover:bg-zand hover:text-walnoot transition-colors"
                                  onClick={() => setOpenGroep(null)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobiel: hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-inkt"
            aria-label={mobielOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={mobielOpen}
            onClick={() => setMobielOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {mobielOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobiel paneel */}
      {mobielOpen && (
        <div className="md:hidden bg-papier border-b border-lijn max-h-[calc(100vh-6.25rem)] overflow-y-auto">
          <nav className="max-w-wide mx-auto px-6 py-3">
            <Link
              href="/#definitie"
              className="block py-3 border-b border-lijn text-inkt"
              onClick={() => setMobielOpen(false)}
            >
              Wat is Japandi
            </Link>
            {nav.map((groep) => {
              const open = mobielGroep === groep.titel;
              return (
                <div key={groep.titel} className="border-b border-lijn">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setMobielGroep(open ? null : groep.titel)}
                    className="w-full flex items-center justify-between py-3 text-inkt"
                  >
                    <span className="font-display text-lg">{groep.titel}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 10 10"
                      aria-hidden
                      className={`transition-transform ${open ? "rotate-180" : ""}`}
                    >
                      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>
                  {open && (
                    <ul className="pb-3">
                      {groep.href && (
                        <li>
                          <Link
                            href={groep.href}
                            className="block py-2 pl-3 text-walnoot"
                            onClick={() => setMobielOpen(false)}
                          >
                            {groep.hubLabel ?? "Bekijk alles"}
                            <span className="ml-1">&rarr;</span>
                          </Link>
                        </li>
                      )}
                      {groep.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block py-2 pl-3 text-klei hover:text-walnoot"
                            onClick={() => setMobielOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <Link
              href="/over-ons/"
              className="block py-3 border-b border-lijn text-inkt"
              onClick={() => setMobielOpen(false)}
            >
              Over ons
            </Link>
            <Link
              href="/contact/"
              className="block py-3 text-inkt"
              onClick={() => setMobielOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
