import Link from "next/link";
import { getProduct, laagstePrijs } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";
import InWinkelwagenKnop from "./shop/InWinkelwagenKnop";

// Productkaart voor producten uit de eigen winkel (Shopify). Zelfde vormgeving
// als ProductCard, maar met vaste prijs, levertijd en een winkelwagenknop.
// Naam, merk, prijs, foto, afmetingen en materiaal komen uit Shopify; de
// redactionele velden (voordelen, nadeel, stijltip) blijven in de MDX.
// Bestaat het product niet (meer) of is Shopify onbereikbaar, dan rendert de
// kaart niets en blijft de rest van de pagina intact.

type Props = {
  handle: string;
  voordelen?: string[];
  nadeel?: string;
  stijltip?: string; // de component rendert zelf het label "Combineer met:"
};

export default async function ShopProduct(p: Props) {
  const product = await getProduct(p.handle);
  if (!product) return null;

  const prijs = laagstePrijs(product);
  const meerdereVarianten = product.variants.length > 1;
  const variant = product.variants[0];
  const href = `/product/${product.handle}/`;
  const beeld = product.featuredImage;

  return (
    <div className="bg-papier rounded-sm shadow-sm flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
      {beeld && (
        <Link href={href} className="block aspect-square overflow-hidden rounded-t-sm bg-zand" tabIndex={-1} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beeld.url}
            alt={beeld.altText ?? product.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-1">
        {product.vendor && (
          <span className="text-[0.76rem] uppercase tracking-[0.1em] text-klei">{product.vendor}</span>
        )}
        <h3 className="font-display text-[1.3rem] leading-snug mt-0.5">
          <Link href={href} className="no-underline hover:text-walnoot transition-colors">
            {product.title}
          </Link>
        </h3>
        {prijs && (
          <span className="text-walnoot font-semibold mt-1">
            {meerdereVarianten && <span className="font-normal text-klei text-sm">vanaf </span>}
            {formatPrijs(prijs.amount, prijs.currencyCode)}
          </span>
        )}
        <span className="text-xs text-groen mt-1">{product.levertijd}</span>
        {(product.afmetingen || product.materiaal) && (
          <dl className="text-[0.85rem] text-klei mt-3 space-y-1">
            {product.afmetingen && (
              <div>
                <dt className="inline font-medium text-inkt">Afmetingen: </dt>
                <dd className="inline">{product.afmetingen}</dd>
              </div>
            )}
            {product.materiaal && (
              <div>
                <dt className="inline font-medium text-inkt">Materiaal: </dt>
                <dd className="inline">{product.materiaal}</dd>
              </div>
            )}
          </dl>
        )}
        {(p.voordelen?.length || p.nadeel) && (
          <ul className="mt-4 space-y-2 text-sm list-none pl-0 mb-0">
            {p.voordelen?.map((v) => (
              <li key={v} className="list-none pl-0 mb-0 flex items-start gap-3">
                <span
                  className="w-[1.15rem] h-[1.15rem] rounded-full bg-groen/15 text-groen flex items-center justify-center text-[11px] leading-none shrink-0 mt-0.5"
                  aria-hidden
                >
                  +
                </span>
                <span>{v}</span>
              </li>
            ))}
            {p.nadeel && (
              <li className="list-none pl-0 mb-0 flex items-start gap-3">
                <span
                  className="w-[1.15rem] h-[1.15rem] rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center text-[11px] leading-none shrink-0 mt-0.5"
                  aria-hidden
                >
                  &#8722;
                </span>
                <span>{p.nadeel}</span>
              </li>
            )}
          </ul>
        )}
        {p.stijltip && (
          <p className="bg-zand rounded-sm px-4 py-3 mt-4 mb-0 text-[0.85rem] leading-relaxed">
            <b className="font-display italic font-normal text-walnoot">Combineer met:</b> {p.stijltip}
          </p>
        )}
        <div className="mt-auto pt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {meerdereVarianten || !variant ? (
            <Link href={href} className="knop-pill bg-walnoot hover:bg-walnoot/90">
              Kies je uitvoering
            </Link>
          ) : (
            <>
              <InWinkelwagenKnop
                variantId={variant.id}
                beschikbaar={variant.availableForSale}
                meting={{ naam: product.title, merk: product.vendor, prijs: Number(variant.price.amount) }}
              />
              <Link href={href} className="text-sm text-klei hover:text-walnoot transition-colors">
                Meer details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
