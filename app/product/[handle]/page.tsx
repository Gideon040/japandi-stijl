import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ProductKoop from "@/components/shop/ProductKoop";
import ProductGalerij from "@/components/shop/ProductGalerij";
import Zekerheden from "@/components/shop/Zekerheden";
import UspLijst from "@/components/shop/UspLijst";
import Link from "next/link";
import { getProduct, getAlleProductHandles, laagstePrijs } from "@/lib/shopify";
import { getPage } from "@/lib/content";
import { LEVERING_UITLEG, RETOUR_UITLEG } from "@/lib/winkel";
import { SITE_NAAM, SITE_URL } from "@/lib/seo";

// Productpagina voor producten uit de eigen winkel (Shopify). Statisch
// gegenereerd en elke 5 minuten ververst, zodat prijs en voorraad kloppen
// zonder nieuwe deploy. Nieuwe producten krijgen bij het eerste bezoek hun pagina.

export const revalidate = 300;
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

  const prijs = laagstePrijs(product);
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
  const sfeer = beelden.slice(1, 5);

  return (
    <article>
      <div className="max-w-wide mx-auto px-6 pt-8 pb-16">
        <Breadcrumb items={crumbs} />
        <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-14 items-start">
          <ProductGalerij beelden={beelden} naam={product.title} />

          <div className="md:sticky md:top-32">
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
          <div className="grid md:grid-cols-[1.6fr_1fr] rounded-sm overflow-hidden">
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
        </section>
      )}

      {sfeerbeeld && (
        <section className="max-w-wide mx-auto px-6 pb-16">
          <figure className="m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sfeerbeeld.url}
              alt={sfeerAlt}
              loading="lazy"
              className="w-full aspect-[3/2] sm:aspect-[16/9] object-cover rounded-sm"
            />
            <figcaption className="mt-3 text-sm text-klei">
              Sfeerimpressie, gemaakt met AI. Het echte product kan in kleur, formaat en afwerking afwijken:
              ga uit van de productfoto&apos;s bovenaan.
            </figcaption>
          </figure>
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
        <section className="bg-zand">
          <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
            <Kop aanloop="Eerlijk gezegd">De plus- en minpunten</Kop>
            <div className="grid gap-5 sm:grid-cols-2">
              {product.pluspunten.length > 0 && (
                <div className="bg-papier rounded-sm p-6 sm:p-8">
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
                <div className="bg-papier rounded-sm p-6 sm:p-8">
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
          <div className="max-w-wide mx-auto px-6 py-12 sm:py-16 grid gap-10 md:grid-cols-2 md:gap-14">
            {product.descriptionHtml && (
              <div>
                <Kop aanloop="In detail">Over dit product</Kop>
                {/* Beschrijving komt uit de eigen Shopify-admin, dus vertrouwde content. */}
                <div
                  className="leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            )}
            {specs.length > 0 && (
              <div>
                <Kop aanloop="Op een rij">Specificaties</Kop>
                <dl className="m-0 border-t border-lijn">
                  {specs.map(([label, waarde]) => (
                    <div key={label} className="flex gap-6 py-3 border-b border-lijn">
                      <dt className="w-32 shrink-0 text-klei">{label}</dt>
                      <dd className="m-0">{waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-zand-diep">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="Goed om te weten">Levering en retour</Kop>
          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl leading-relaxed">
            <div>
              <h3 className="font-display text-xl mb-2">Levering</h3>
              <p className="m-0 text-groen text-sm mb-2">{product.levertijd}</p>
              <p className="m-0">{LEVERING_UITLEG}</p>
            </div>
            <div>
              <h3 className="font-display text-xl mb-2">Retour</h3>
              <p className="m-0">
                {RETOUR_UITLEG}{" "}
                <Link href="/contact/" className="underline decoration-lijn underline-offset-4 hover:decoration-walnoot">
                  Naar de contactpagina
                </Link>
              </p>
            </div>
          </div>
          {gids && gidsNaam && (
            <p className="mt-10 mb-0">
              <Link href={`/${product.gids}/`} className="knop-pill bg-walnoot hover:bg-walnoot/90">
                Lees de koopgids: {gidsNaam}
              </Link>
            </p>
          )}
        </div>
      </section>
      <JsonLd data={schema} />
    </article>
  );
}
