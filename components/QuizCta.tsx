"use client";

import { Suspense, useEffect, useState } from "react";
import Quiz from "@/components/Quiz";

// Opent de stijltest als modal. De losse pagina /japandi-quiz/ blijft bestaan
// voor direct verkeer en deelbare resultaat-URL's; in de modal schrijven we de
// URL niet, zodat de homepage-URL niet verandert.
export default function QuizCta({ label = "Doe de stijltest" }: { label?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = vorige;
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="knop-pill bg-walnoot">
        {label}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inkt/50 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Japandi stijltest"
        >
          <div
            className="relative bg-papier rounded-sm shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sluiten"
              className="absolute top-3 right-3 z-10 p-2 text-klei hover:text-inkt transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="overflow-y-auto p-6 sm:p-10">
              <Suspense fallback={<p className="text-klei">De stijltest laden...</p>}>
                <Quiz schrijfUrl={false} vol />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
