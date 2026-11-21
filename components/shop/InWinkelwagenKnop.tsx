"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { track } from "@/lib/track";

type Props = {
  variantId: string;
  beschikbaar: boolean;
  // Alleen voor de meting, niet voor de prijs in de winkelwagen (die komt van Shopify).
  meting: { naam: string; merk?: string; variant?: string; prijs: number };
};

export default function InWinkelwagenKnop({ variantId, beschikbaar, meting }: Props) {
  const { voegToe } = useCart();
  const [bezig, setBezig] = useState(false);

  if (!beschikbaar) {
    return (
      <span className="inline-flex items-center rounded-full px-5 py-2.5 text-sm bg-zand text-klei">
        Tijdelijk uitverkocht
      </span>
    );
  }

  async function klik() {
    setBezig(true);
    const gelukt = await voegToe(variantId, 1);
    setBezig(false);
    if (gelukt) {
      track("add_to_cart", meting.prijs, [
        {
          item_id: variantId,
          item_name: meting.naam,
          item_brand: meting.merk,
          item_variant: meting.variant,
          price: meting.prijs,
          quantity: 1,
        },
      ]);
    }
  }

  return (
    <button
      type="button"
      onClick={klik}
      disabled={bezig}
      className="knop-pill bg-walnoot hover:bg-walnoot/90 disabled:opacity-60"
    >
      {bezig ? "Bezig" : "In winkelwagen"}
    </button>
  );
}
