import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ProductKoop from "@/components/shop/ProductKoop";
import InWinkelwagenKnop from "@/components/shop/InWinkelwagenKnop";
import ProductGalerij from "@/components/shop/ProductGalerij";
import Zekerheden from "@/components/shop/Zekerheden";
import UspLijst from "@/components/shop/UspLijst";
import Link from "next/link";
import { getProduct, getAlleProductHandles, getVerwanteProducten, laagstePrijs } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";
import { getPage } from "@/lib/content";
import { STAPPEN } from "@/lib/winkel";
import { SITE_NAAM, SITE_URL } from "@/lib/seo";

// Productpagina voor producten uit de eigen winkel (Shopify). Statisch
// gegenereerd en elke minuut ververst, zodat prijs en voorraad kloppen
// zonder nieuwe deploy. Nieuwe producten krijgen bij het eerste bezoek hun pagina.

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAlleProductHandles()).map((p) => ({ handle: p.handle }));
}

type Params = { params: Promise<{ handle: string }> };

function kort(tekst: string, max = 155): string {
  const schoon = tekst.replace(/\s+/g, " ").trim();
  if (schoon.length <= max) return schoon;
  const grens = schoon.lastIndexOf(" ", max - 1);
  return `${schoon.slice(0, grens > 0 ? grens : max - 1)}.`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  const titel = product.seoTitel ?? product.title;
  const beschrijving = product.seoBeschrijving ?? kort(product.description);
  const beeld = product.featuredImage?.url;
  return {
    title: titel,
    description: beschrijving,
    alternates: { canonical: `/product/${handle}/` },
    openGraph: {
      type: "website",
      title: titel,
      description: beschrijving,
      url: `/product/${handle}/`,
      siteName: SITE_NAAM,
      ...(beeld ? { images: [{ url: beeld }] } : {}),
    },
  };
}

// Lijnicoon per stap onder "Levering en retour": bestellen, inkopen, bezorgen, retour.
function StapIcoon({ nummer }: { nummer: number }) {
  const gemeen = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  if (nummer === 0)
    return (
      <svg {...gemeen}>
        <path d="M5 8h14l-1.2 11H6.2L5 8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    );
  if (nummer === 1)
    return (
      <svg {...gemeen}>
        <path d="M3 8l9-4 9 4-9 4-9-4z" />
        <path d="M3 8v8l9 4 9-4V8" />
        <path d="M12 12v8" />
      </svg>
    );
  if (nummer === 2)
    return (
      <svg {...gemeen}>
        <path d="M2 7h11v9H2z" />
        <path d="M13 10h4l4 3v3h-8" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </svg>
    );
  return (
    <svg {...gemeen}>
      <path d="M4 12a8 8 0 108-8H7" />
      <path d="M10 1L7 4l3 3" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

// Sectiekop in het koppatroon van de site: cursieve aanloop, statement eronder.
function Kop({ aanloop, children }: { aanloop: string; children: React.ReactNode }) {
  return (
    <h2 className="kop font-display text-3xl sm:text-4xl mb-5">
      <em>{aanloop}</em>
      {children}
    </h2>
  );
}

export default async function ProductPagina({ params }: Params) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const url = `${SITE_URL}/product/${handle}/`;
  // Koopgids waar dit product bij hoort (metafield custom.gids), voor het
  // kruimelpad en de interne link terug naar de gids.
  const gids = product.gids ? getPage(product.gids) : null;
  const gidsNaam = gids ? String(gids.data.titel).split(":")[0].trim() : null;
  const crumbs: Crumb[] = [{ naam: "Home", href: "/" }];
  if (gids && gidsNaam) crumbs.push({ naam: gidsNaam, href: `/${product.gids}/` });
  crumbs.push({ naam: product.title });

  const verwant = product.gids ? await getVerwanteProducten(product.gids, product.handle) : [];
  const prijs = laagstePrijs(product);
  const eersteVariant = product.variants[0] ?? null;
  const alleBeelden = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  // Een foto waarvan de alt-tekst in Shopify met "Sfeerbeeld" begint, is een
  // sfeerimpressie (met AI gemaakt). Die hoort niet tussen de productfoto's en
  // niet in het schema, maar krijgt een eigen plek met een duidelijk bijschrift.
  const isSfeer = (b: { altText: string | null }) => /^sfeerbeeld/i.test(b.altText ?? "");
  const beelden = alleBeelden.filter((b) => !isSfeer(b));
  const sfeerbeeld = alleBeelden.find(isSfeer) ?? null;
  const sfeerAlt = sfeerbeeld?.altText?.replace(/^sfeerbeeld\s*:?\s*/i, "").trim() || product.title;
  const heeftPunten = product.pluspunten.length > 0 || product.minpunten.length > 0;
  const specs: [string, string][] = [];
  if (product.vendor) specs.push(["Merk", product.vendor]);
  if (product.afmetingen) specs.push(["Afmetingen", product.afmetingen]);
  if (product.materiaal) specs.push(["Materiaal", product.materiaal]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.title,
        description: kort(product.description || product.korteOmschrijving || product.title, 500),
        url,
        ...(beelden.length ? { image: beelden.map((b) => b.url) } : {}),
        ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
        ...(product.materiaal ? { material: product.materiaal } : {}),
        offers: product.variants.map((v) => ({
          "@type": "Offer",
          url,
          priceCurrency: v.price.currencyCode,
          price: v.price.amount,
          availability: v.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.naam,
          item: c.href ? `${SITE_URL}${c.href}` : url,
        })),
      },
    ],
  };

  const korteTekst = product.korteOmschrijving ?? (product.description ? kort(product.description, 170) : null);
  // Eerste detailfoto naast de omschrijving; de fotoreeks toont de rest.
  const detailBeeld = beelden[1] ?? null;
  const sfeer = beelden.slice(2, 6);

  return (
    <article>
      <div className="max-w-wide mx-auto px-6 pt-8 pb-16">
        <Breadcrumb items={crumbs} />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-14 items-start">
          <ProductGalerij beelden={beelden} naam={product.title} />

          <div id="koop" className="min-w-0 md:sticky md:top-32 scroll-mt-32">
            {product.vendor && (
              <span className="text-[0.76rem] uppercase tracking-[0.1em] text-klei">{product.vendor}</span>
            )}
            <h1 className="font-display text-3xl sm:text-[2.6rem] leading-[1.1] mt-1 mb-0">{product.title}</h1>
            {korteTekst && <p className="mt-4 mb-0 text-[17px] leading-relaxed text-inkt/85">{korteTekst}</p>}
            <UspLijst punten={product.usps} />
            {prijs && (
              <ProductKoop
                naam={product.title}
                merk={product.vendor}
                levertijd={product.levertijd}
                varianten={product.variants}
              />
            )}
            <Zekerheden toonSpecs={specs.length > 0} />
          </div>
        </div>
      </div>

      {product.waarom && (
        <section className="max-w-wide mx-auto px-6 pb-16">
          <div className="rounded-sm overflow-hidden">
          <div className="grid md:grid-cols-[1.6fr_1fr]">
            <div className="bg-walnoot text-papier px-7 py-10 sm:px-12 sm:py-14">
              <p className="text-[0.76rem] uppercase tracking-[0.12em] text-papier/70 m-0 mb-4">Onze keuze</p>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight m-0 mb-6">
                Waarom dit bij Japandi past
              </h2>
              <div className="text-[17px] leading-relaxed space-y-4 text-papier/90 max-w-content">
                {product.waarom.split(/\n{2,}/).map((alinea) => (
                  <p key={alinea} className="m-0">
                    {alinea}
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-zand-diep px-7 py-10 sm:px-10 sm:py-14 flex flex-col justify-center">
              {product.stijltip ? (
                <>
                  <h3 className="font-display italic font-normal text-2xl text-walnoot m-0 mb-3">Combineer met</h3>
                  <p className="m-0 leading-relaxed">{product.stijltip}</p>
                </>
              ) : (
                <p className="m-0 font-display italic text-2xl text-walnoot leading-snug">
                  Rustige vormen, natuurlijke tinten en niets wat er niet hoeft te zijn.
                </p>
              )}
            </div>
          </div>
          {sfeerbeeld && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sfeerbeeld.url}
              alt={sfeerAlt}
              loading="lazy"
              className="block w-full aspect-[3/2] sm:aspect-[16/9] object-cover"
            />
          )}
          </div>
        </section>
      )}

      {sfeer.length > 0 && (
        <section className="max-w-wide mx-auto px-6 pb-16">
          <Kop aanloop="In beeld">Van dichtbij bekeken</Kop>
          <ul className={`grid gap-4 grid-cols-2 ${sfeer.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} list-none p-0 m-0`}>
            {sfeer.map((b) => (
              <li key={b.url} className="list-none m-0 p-0 aspect-[4/5] bg-zand rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.url} alt={b.altText ?? product.title} loading="lazy" className="w-full h-full object-cover" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {heeftPunten && (
        <section
          className={`relative bg-cover bg-center ${product.gids ? "bg-walnoot text-papier" : "bg-zand"}`}
          style={product.gids ? { backgroundImage: `url(/images/${product.gids}-hero.webp)` } : undefined}
        >
          {/* Sfeerbeeld van de bijbehorende koopgids als achtergrond, met een
              donkere laag erover zodat kop en kaarten leesbaar blijven. Bestaat
              het beeld niet, dan blijft het effen walnoot. */}
          {product.gids && <div className="absolute inset-0 bg-inkt/60" aria-hidden />}
          <div className="relative max-w-wide mx-auto px-6 py-14 sm:py-20">
            <Kop aanloop="Eerlijk gezegd">De plus- en minpunten</Kop>
            <div className="grid gap-5 sm:grid-cols-2">
              {product.pluspunten.length > 0 && (
                <div className="bg-papier text-inkt rounded-sm p-6 sm:p-8 shadow-sm">
                  <h3 className="font-display text-xl m-0 mb-4">Wat ons bevalt</h3>
                  <ul className="space-y-3 list-none p-0 m-0">
                    {product.pluspunten.map((punt) => (
                      <li key={punt} className="flex items-start gap-3 list-none m-0 p-0">
                        <span
                          className="w-5 h-5 rounded-full bg-groen/15 text-groen flex items-center justify-center text-xs leading-none shrink-0 mt-0.5"
                          aria-hidden
                        >
                          +
                        </span>
                        <span>{punt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.minpunten.length > 0 && (
                <div className="bg-papier text-inkt rounded-sm p-6 sm:p-8 shadow-sm">
                  <h3 className="font-display text-xl m-0 mb-4">Waar je op moet letten</h3>
                  <ul className="space-y-3 list-none p-0 m-0">
                    {product.minpunten.map((punt) => (
                      <li key={punt} className="flex items-start gap-3 list-none m-0 p-0">
                        <span
                          className="w-5 h-5 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center text-xs leading-none shrink-0 mt-0.5"
                          aria-hidden
                        >
                          &#8722;
                        </span>
                        <span>{punt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(product.descriptionHtml || specs.length > 0) && (
        <section id="specificaties" className="scroll-mt-28">
          <div className="max-w-wide mx-auto px-6 py-14 sm:py-20 grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16 items-center">
            {detailBeeld && (
              <div className="relative">
                <div className="aspect-[4/5] bg-zand rounded-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={detailBeeld.url}
                    alt={detailBeeld.altText ?? product.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                {prijs && (
                  <div className="absolute -bottom-5 right-4 sm:-right-5 bg-walnoot text-papier rounded-sm px-5 py-4 shadow-md">
                    <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-papier/70">{product.variants.length > 1 ? "Vanaf" : "Prijs"}</span>
                    <span className="block font-display text-2xl leading-none mt-1">
                      {formatPrijs(prijs.amount, prijs.currencyCode)}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div>
              {product.descriptionHtml && (
                <>
                  <Kop aanloop="In detail">Over dit product</Kop>
                  {/* Beschrijving komt uit de eigen Shopify-admin, dus vertrouwde content. */}
                  <div
                    className="text-[17px] leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                </>
              )}
              {specs.length > 0 && (
                <div className="mt-8 bg-zand rounded-sm px-6 py-5 sm:px-8 sm:py-6">
                  <h3 className="font-display italic font-normal text-xl text-walnoot m-0 mb-3">Specificaties</h3>
                  <dl className="m-0">
                    {specs.map(([label, waarde], i) => (
                      <div key={label} className={`flex gap-6 py-3 ${i > 0 ? "border-t border-lijn" : ""}`}>
                        <dt className="w-28 shrink-0 text-[0.76rem] uppercase tracking-[0.1em] text-klei pt-0.5">
                          {label}
                        </dt>
                        <dd className="m-0">{waarde}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {eersteVariant && (
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {product.variants.length > 1 ? (
                    <Link href="#koop" className="knop-pill bg-walnoot hover:bg-walnoot/90">
                      Kies je uitvoering
                    </Link>
                  ) : (
                    <InWinkelwagenKnop
                      variantId={eersteVariant.id}
                      beschikbaar={eersteVariant.availableForSale}
                      meting={{
                        naam: product.title,
                        merk: product.vendor,
                        prijs: Number(eersteVariant.price.amount),
                      }}
                    />
                  )}
                  <span className="text-sm text-groen">{product.levertijd}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-zand-diep">
        <div className="max-w-wide mx-auto px-6 py-14 sm:py-20">
          <Kop aanloop="Zeker van je zaak">Levering en retour</Kop>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
            {STAPPEN.map((stap, i) => (
              <li key={stap.titel} className="list-none m-0 p-6 bg-papier rounded-sm flex flex-col">
                <span className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full border border-terracotta/40 text-terracotta flex items-center justify-center">
                    <StapIcoon nummer={i} />
                  </span>
                  <span className="font-display text-terracotta text-sm tracking-wider">0{i + 1}</span>
                </span>
                <h3 className="font-display text-xl mt-6 mb-2">{stap.titel}</h3>
                {i === 2 && <p className="m-0 mb-1 text-sm text-groen">{product.levertijd}</p>}
                <p className="m-0 text-[0.95rem] leading-relaxed text-inkt/80">{stap.tekst}</p>
                {i === 3 && (
                  <Link
                    href="/contact/"
                    className="mt-auto pt-4 text-sm text-walnoot underline decoration-lijn underline-offset-4 hover:decoration-walnoot"
                  >
                    Neem contact op
                  </Link>
                )}
              </li>
            ))}
          </ol>
          {gids && gidsNaam && (
            <div className="mt-8 bg-walnoot text-papier rounded-sm px-6 py-6 sm:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="m-0 font-display text-xl sm:text-2xl leading-snug">
                Nog niet zeker? In de koopgids vergelijken we alle opties.
              </p>
              <Link href={`/${product.gids}/`} className="knop-pill bg-papier !text-walnoot hover:bg-zand shrink-0">
                Lees de koopgids: {gidsNaam}
              </Link>
            </div>
          )}
        </div>
      </section>

      {verwant.length > 0 && (
        <section>
          <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
            <Kop aanloop="Verder kijken">Meer uit deze categorie</Kop>
            <ul className="grid gap-5 grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
              {verwant.map((v) => (
                <li key={v.handle} className="list-none m-0 p-0">
                  <Link
                    href={`/product/${v.handle}/`}
                    className="group flex flex-col h-full bg-papier rounded-sm shadow-sm no-underline transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="aspect-square bg-zand rounded-t-sm p-5">
                      {v.beeld && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.beeld.url}
                          alt={v.beeld.altText ?? v.title}
                          loading="lazy"
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      {v.vendor && (
                        <span className="text-[0.7rem] uppercase tracking-[0.1em] text-klei">{v.vendor}</span>
                      )}
                      <span className="font-display text-lg leading-snug mt-0.5 group-hover:text-walnoot transition-colors">
                        {v.title}
                      </span>
                      <span className="mt-auto pt-3 text-walnoot font-semibold">
                        {formatPrijs(v.prijs.amount, v.prijs.currencyCode)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <JsonLd data={schema} />
    </article>
  );
}
