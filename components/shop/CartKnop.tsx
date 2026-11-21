"use client";

import { useCart } from "./CartProvider";

// Winkelwagen-icoon in de header. Blijft onzichtbaar zolang de winkelwagen
// leeg is, zodat de gidsen er voor gewone lezers niet anders uitzien.
export default function CartKnop() {
  const { cart, zetOpen } = useCart();
  const aantal = cart?.totalQuantity ?? 0;
  if (aantal === 0) return null;
  return (
    <button
      type="button"
      onClick={() => zetOpen(true)}
      aria-label={`Winkelwagen openen, ${aantal} ${aantal === 1 ? "artikel" : "artikelen"}`}
      className="relative p-2 text-inkt hover:text-walnoot transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M5 8h14l-1.2 11H6.2L5 8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
      </svg>
      <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-walnoot text-papier text-[11px] leading-[1.1rem] text-center">
        {aantal}
      </span>
    </button>
  );
}
