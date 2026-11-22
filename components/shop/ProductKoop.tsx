"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShopVariant } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";
import { track } from "@/lib/track";
import { LEVERING_LABEL } from "@/lib/winkel";
import InWinkelwagenKnop from "./InWinkelwagenKnop";

// Koopblok op de productpagina: uitvoering kiezen, leveringskaart met prijs en
// levertijd, en de brede winkelwagenknop.

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
  // Veel of lange uitvoeringen passen niet als knoppen naast elkaar: dan een keuzelijst.
  const alsLijst = varianten.length > 3 || varianten.some((v) => v.title.length > 12);

  // Laat de fotogalerij de foto van de gekozen uitvoering tonen.
  function kies(id: string) {
    setVariantId(id);
    const beeld = varianten.find((v) => v.id === id)?.image?.url;
    if (beeld) window.dispatchEvent(new CustomEvent("variant-beeld", { detail: beeld }));
  }

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
    <div className="mt-7">
      {meerdere && alsLijst && (
        <div className="mb-6">
          <label
            htmlFor="uitvoering"
            className="block text-[0.76rem] uppercase tracking-[0.1em] text-klei mb-3"
          >
            Kies je uitvoering
          </label>
          <div className="relative">
            <select
              id="uitvoering"
              value={variant.id}
              onChange={(e) => kies(e.target.value)}
              className="w-full appearance-none rounded-sm border border-lijn bg-papier py-3 pl-4 pr-10 text-base text-inkt focus:border-walnoot focus:outline-none"
            >
              {varianten.map((v) => (
                <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                  {v.title}, {formatPrijs(v.price.amount, v.price.currencyCode)}
                  {!v.availableForSale ? " (niet leverbaar)" : ""}
                </option>
              ))}
            </select>
            <svg
              width="12"
              height="12"
              viewBox="0 0 10 10"
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-klei"
            >
              <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
        </div>
      )}

      {meerdere && !alsLijst && (
        <fieldset className="border-0 p-0 m-0 mb-6 min-w-0">
          <legend className="text-[0.76rem] uppercase tracking-[0.1em] text-klei mb-3 p-0">Kies je uitvoering</legend>
          <div className="flex flex-wrap gap-2">
            {varianten.map((v) => {
              const actief = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={actief}
                  disabled={!v.availableForSale}
                  onClick={() => kies(v.id)}
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

      <p className="text-[0.76rem] uppercase tracking-[0.1em] text-klei m-0 mb-3 pb-3 border-b border-lijn">
        Levering
      </p>
      <div className="rounded-sm border border-walnoot bg-papier px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full border-[5px] border-walnoot shrink-0" aria-hidden />
            <span className="font-medium">{LEVERING_LABEL}</span>
          </span>
          <span className="flex items-baseline gap-2">
            {afgeprijsd && (
              <s className="text-klei text-sm">{formatPrijs(vergelijk.amount, vergelijk.currencyCode)}</s>
            )}
            <span className="font-display text-2xl text-walnoot">
              {formatPrijs(variant.price.amount, variant.price.currencyCode)}
            </span>
          </span>
        </div>
        <p className="mt-2 mb-0 pl-7 text-sm text-groen">{levertijd}</p>
        <p className="mt-0.5 mb-0 pl-7 text-sm text-klei">Prijs inclusief btw</p>
      </div>

      <div className="mt-4">
        <InWinkelwagenKnop
          breed
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
    </div>
  );
}
