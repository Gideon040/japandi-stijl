"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShopVariant } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";
import { track } from "@/lib/track";
import InWinkelwagenKnop from "./InWinkelwagenKnop";

// Koopblok op de productpagina: uitvoering kiezen, prijs, levertijd en knop.

type Props = {
  naam: string;
  merk: string;
  levertijd: string;
  varianten: ShopVariant[];
};

export default function ProductKoop({ naam, merk, levertijd, varianten }: Props) {
  const eerste = varianten.find((v) => v.availableForSale) ?? varianten[0];
  const [variantId, setVariantId] = useState(eerste?.id);
  const variant = useMemo(() => varianten.find((v) => v.id === variantId) ?? eerste, [varianten, variantId, eerste]);
  const meerdere = varianten.length > 1;

  useEffect(() => {
    if (!eerste) return;
    track("view_item", Number(eerste.price.amount), [
      { item_id: eerste.id, item_name: naam, item_brand: merk, price: Number(eerste.price.amount), quantity: 1 },
    ]);
    // Eenmalig per productpagina.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!variant) return null;
  const vergelijk = variant.compareAtPrice;
  const afgeprijsd = vergelijk && Number(vergelijk.amount) > Number(variant.price.amount);

  return (
    <div>
      <p className="m-0 flex items-baseline gap-3">
        <span className="font-display text-3xl text-walnoot">
          {formatPrijs(variant.price.amount, variant.price.currencyCode)}
        </span>
        {afgeprijsd && (
          <s className="text-klei">{formatPrijs(vergelijk.amount, vergelijk.currencyCode)}</s>
        )}
      </p>
      <p className="mt-1 mb-0 text-sm text-klei">Inclusief btw</p>

      {meerdere && (
        <fieldset className="mt-6 border-0 p-0 m-0">
          <legend className="text-sm font-medium text-inkt mb-2 p-0">Uitvoering</legend>
          <div className="flex flex-wrap gap-2">
            {varianten.map((v) => {
              const actief = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={actief}
                  disabled={!v.availableForSale}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    actief
                      ? "border-walnoot bg-walnoot text-papier"
                      : "border-lijn bg-papier text-inkt hover:border-walnoot"
                  } ${!v.availableForSale ? "opacity-40 line-through" : ""}`}
                >
                  {v.title}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className="mt-6 mb-4 text-sm text-groen">{levertijd}</p>
      <InWinkelwagenKnop
        variantId={variant.id}
        beschikbaar={variant.availableForSale}
        meting={{
          naam,
          merk,
          variant: meerdere ? variant.title : undefined,
          prijs: Number(variant.price.amount),
        }}
      />
    </div>
  );
}
