import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ProductKoop from "@/components/shop/ProductKoop";
import { getProduct, getAlleProductHandles, laagstePrijs } from "@/lib/shopify";
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

export default async function ProductPagina({ params }: Params) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const url = `${SITE_URL}/product/${handle}/`;
  const crumbs: Crumb[] = [{ naam: "Home", href: "/" }, { naam: product.title }];
  const prijs = laagstePrijs(product);
  const beelden = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.title,
        description: kort(product.description, 500),
        url,
        ...(beelden.length ? { image: beelden.map((b) => b.url) } : {}),
        ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
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

  return (
    <article className="max-w-wide mx-auto px-6 pt-10 pb-20">
      <Breadcrumb items={crumbs} />
      <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-start">
        <div className="space-y-4">
          {beelden.slice(0, 1).map((b) => (
            <div key={b.url} className="aspect-square bg-zand rounded-sm p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.url}
                alt={b.altText ?? product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          ))}
          {beelden.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {beelden.slice(1, 7).map((b) => (
                <div key={b.url} className="aspect-square bg-zand rounded-sm p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.url}
                    alt={b.altText ?? product.title}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-32">
          {product.vendor && (
            <span className="text-[0.76rem] uppercase tracking-[0.1em] text-klei">{product.vendor}</span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl leading-tight mt-1 mb-5">{product.title}</h1>
          {prijs && (
            <ProductKoop
              naam={product.title}
              merk={product.vendor}
              levertijd={product.levertijd}
              varianten={product.variants}
            />
          )}
          {(product.afmetingen || product.materiaal) && (
            <dl className="mt-8 pt-6 border-t border-lijn text-sm space-y-2">
              {product.afmetingen && (
                <div>
                  <dt className="inline font-medium text-inkt">Afmetingen: </dt>
                  <dd className="inline text-klei">{product.afmetingen}</dd>
                </div>
              )}
              {product.materiaal && (
                <div>
                  <dt className="inline font-medium text-inkt">Materiaal: </dt>
                  <dd className="inline text-klei">{product.materiaal}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      {product.descriptionHtml && (
        <section className="max-w-content mt-16">
          <h2 className="font-display text-2xl sm:text-3xl mb-4">Over dit product</h2>
          {/* Beschrijving komt uit de eigen Shopify-admin, dus vertrouwde content. */}
          <div
            className="leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </section>
      )}
      <JsonLd data={schema} />
    </article>
  );
}
