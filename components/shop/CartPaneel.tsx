"use client";

import BetaalLogos from "./BetaalLogos";
import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrijs } from "@/lib/prijs";
import { track } from "@/lib/track";

// Uitschuifpaneel met de winkelwagen. Afrekenen gaat naar de checkout van
// Shopify (cart.checkoutUrl).
export default function CartPaneel() {
  const { cart, open, zetOpen, wijzig, verwijder, bezig, fout } = useCart();

  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => e.key === "Escape" && zetOpen(false);
    document.addEventListener("keydown", escape);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = vorige;
    };
  }, [open, zetOpen]);

  if (!open) return null;
  const regels = cart?.regels ?? [];

  function naarKassa() {
    if (!cart) return;
    track(
      "begin_checkout",
      Number(cart.subtotaal.amount),
      cart.regels.map((r) => ({
        item_id: r.variantId,
        item_name: r.productTitel,
        item_variant: r.variantTitel,
        price: Number(r.totaal.amount) / r.quantity,
        quantity: r.quantity,
      }))
    );
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Winkelwagen">
      <button
        type="button"
        aria-label="Winkelwagen sluiten"
        className="absolute inset-0 bg-inkt/40 cursor-default"
        onClick={() => zetOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-papier shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-6 h-16 border-b border-lijn shrink-0">
          <h2 className="font-display text-xl m-0">Winkelwagen</h2>
          <button
            type="button"
            onClick={() => zetOpen(false)}
            aria-label="Sluiten"
            className="p-2 -mr-2 text-inkt hover:text-walnoot transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {regels.length === 0 ? (
          <div className="flex-1 px-6 py-10 text-klei">
            <p className="m-0">Je winkelwagen is leeg.</p>
          </div>
        ) : (
          <ul className={`flex-1 overflow-y-auto px-6 py-2 m-0 list-none ${bezig ? "opacity-60" : ""}`}>
            {regels.map((r) => (
              <li key={r.id} className="flex gap-4 py-5 border-b border-lijn list-none m-0 p-0">
                <div className="w-20 h-20 shrink-0 bg-zand rounded-sm overflow-hidden p-1.5">
                  {r.beeld && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.beeld.url}
                      alt={r.beeld.altText ?? r.productTitel}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <Link
                    href={`/product/${r.productHandle}/`}
                    onClick={() => zetOpen(false)}
                    className="font-display text-base leading-snug no-underline hover:text-walnoot"
                  >
                    {r.productTitel}
                  </Link>
                  {r.variantTitel !== "Default Title" && <p className="m-0 text-klei">{r.variantTitel}</p>}
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center border border-lijn rounded-full">
                      <button
                        type="button"
                        aria-label="Een minder"
                        disabled={bezig}
                        onClick={() => wijzig(r.id, r.quantity - 1)}
                        className="w-8 h-8 text-inkt hover:text-walnoot"
                      >
                        &#8722;
                      </button>
                      <span className="w-6 text-center tabular-nums">{r.quantity}</span>
                      <button
                        type="button"
                        aria-label="Een meer"
                        disabled={bezig}
                        onClick={() => wijzig(r.id, r.quantity + 1)}
                        className="w-8 h-8 text-inkt hover:text-walnoot"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-walnoot font-semibold">
                      {formatPrijs(r.totaal.amount, r.totaal.currencyCode)}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={bezig}
                    onClick={() => verwijder(r.id)}
                    className="mt-2 text-xs text-klei underline hover:text-terracotta"
                  >
                    Verwijderen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {fout && <p className="px-6 py-2 m-0 text-sm text-terracotta">{fout}</p>}

        {cart && regels.length > 0 && (
          <div className="border-t border-lijn px-6 py-5 bg-zand shrink-0">
            <div className="flex items-baseline justify-between">
              <span className="text-klei text-sm">Subtotaal</span>
              <span className="font-display text-xl">
                {formatPrijs(cart.subtotaal.amount, cart.subtotaal.currencyCode)}
              </span>
            </div>
            <p className="mt-1 mb-4 text-xs text-klei">Inclusief btw. Verzending € 5,95, gratis vanaf € 100.</p>
            <a
              href={cart.checkoutUrl}
              onClick={naarKassa}
              className="knop-pill bg-walnoot hover:bg-walnoot/90 w-full justify-center"
            >
              Afrekenen
            </a>
            <BetaalLogos className="mt-3" />
          </div>
        )}
      </div>
    </div>
  );
}
