"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { track } from "@/lib/track";

type Props = {
  variantId: string;
  beschikbaar: boolean;
  // Alleen voor de meting, niet voor de prijs in de winkelwagen (die komt van Shopify).
  meting: { naam: string; merk?: string; variant?: string; prijs: number };
  breed?: boolean; // volle breedte en groter, voor de productpagina
};

export default function InWinkelwagenKnop({ variantId, beschikbaar, meting, breed }: Props) {
  const { voegToe } = useCart();
  const [bezig, setBezig] = useState(false);

  if (!beschikbaar) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-zand text-klei ${
          breed ? "w-full px-6 py-4 text-base" : "px-5 py-2.5 text-sm"
        }`}
      >
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
      className={`knop-pill bg-walnoot hover:bg-walnoot/90 disabled:opacity-60 ${
        breed ? "w-full justify-center !px-6 !py-4 !text-base" : ""
      }`}
    >
      {bezig ? "Bezig" : "In winkelwagen"}
    </button>
  );
}
