import fs from "fs";
import path from "path";
import { AUTEUR_NAAM, auteurFoto } from "@/lib/auteur";
import type { PageMeta } from "@/lib/content";

// Centrale SEO-laag: site-constanten, de site-brede identiteit (Organization,
// WebSite, Person) als @graph, og-beeldresolutie en de JSON-LD-builders per
// paginatype. FAQPage-schema komt uit de FAQ-component, dus dat zit hier niet.

export const SITE_URL = "https://japandi-stijl.nl";
export const SITE_NAAM = "Japandi-stijl.nl";
export const SITE_LOCALE = "nl_NL";
export const SITE_BESCHRIJVING =
  "Onafhankelijke gids over de Japandi interieurstijl: uitleg, inspiratie en eerlijke koopgidsen.";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#lieke`;

// Site-brede fallback voor og:image als een pagina geen eigen hero-bestand heeft.
const DEFAULT_OG = "/images/home-hero.webp";

function abs(p: string): string {
  return p.startsWith("http") ? p : `${SITE_URL}${p}`;
}

// Pad naar het hero-bestand van een pagina, alleen als het echt bestaat.
function heroPad(slug: string): string | null {
  const rel = `/images/${slug}-hero.webp`;
  return fs.existsSync(path.join(process.cwd(), "public", rel)) ? rel : null;
}

// og:image voor Next-metadata (relatief mag, metadataBase maakt het absoluut).
export function ogBeeld(slug?: string): string {
  if (slug) {
    const hero = heroPad(slug);
    if (hero) return hero;
  }
  return DEFAULT_OG;
}

// De site-brede identiteit. Staat op elke pagina, zodat Article/CollectionPage
// via @id naar de uitgever en auteur kunnen verwijzen zonder die te herhalen.
export function identiteitGraph() {
  const foto = auteurFoto();
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAAM,
      url: `${SITE_URL}/`,
      description: SITE_BESCHRIJVING,
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: SITE_NAAM,
      url: `${SITE_URL}/`,
      inLanguage: "nl-NL",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AUTEUR_NAAM,
      url: `${SITE_URL}/over-ons/`,
      ...(foto ? { image: abs(foto) } : {}),
      worksFor: { "@id": ORG_ID },
    },
  ];
}

// Article-schema voor de homepage (de pillar over "japandi stijl").
// De FAQ-component op de homepage levert het FAQPage-schema apart.
export function homepageSchema(titel: string, beschrijving: string) {
  return {
    "@type": "Article",
    "@id": `${SITE_URL}/#pillar`,
    headline: titel,
    description: beschrijving,
    image: [abs(DEFAULT_OG)],
    inLanguage: "nl-NL",
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: `${SITE_URL}/`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };
}

type ExtractedProduct = {
  naam: string;
  merk?: string;
  prijs?: string;
  url: string;
  beeld?: string;
  score?: number;
  reviews?: number;
};

// Trekt de ProductCards uit de MDX-body voor het ItemList-schema. Afraders
// (KoopNietBlok) hebben geen ProductCard en vallen er dus vanzelf buiten.
export function extractProducts(content: string): ExtractedProduct[] {
  const blocks = content.match(/<ProductCard\b[\s\S]*?\/>/g) ?? [];
  const out: ExtractedProduct[] = [];
  for (const b of blocks) {
    const str = (k: string) => b.match(new RegExp(`${k}="([^"]*)"`))?.[1];
    const num = (k: string) => {
      const m = b.match(new RegExp(`${k}=\\{([\\d.]+)\\}`));
      return m ? Number(m[1]) : undefined;
    };
    const naam = str("naam");
    const url = str("url");
    if (!naam || !url || url === "#") continue;
    out.push({
      naam,
      merk: str("merk"),
      prijs: str("prijs"),
      url,
      beeld: str("beeld"),
      score: num("score"),
      reviews: num("reviews"),
    });
  }
  return out;
}

function articleType(template: PageMeta["template"]): string {
  return template === "koopgids" ? "CollectionPage" : "Article";
}

// Hoofdschema van een contentpagina: Article voor gidsen/pillar, CollectionPage
// voor koopgidsen. Verwijst via @id naar de site-brede Person en Organization.
export function paginaSchema(page: PageMeta, slug: string) {
  const url = `${SITE_URL}/${slug}/`;
  const schema: Record<string, unknown> = {
    "@type": articleType(page.template),
    "@id": `${url}#pagina`,
    name: page.titel,
    headline: page.titel,
    description: page.beschrijving,
    image: [abs(ogBeeld(slug))],
    inLanguage: "nl-NL",
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: url,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };
  if (page.datum) {
    schema.datePublished = page.datum;
    schema.dateModified = page.datum;
  }
  return schema;
}

// ItemList van de productselectie op een koopgids.
export function productLijstSchema(slug: string, producten: ExtractedProduct[]) {
  const url = `${SITE_URL}/${slug}/`;
  return {
    "@type": "ItemList",
    "@id": `${url}#producten`,
    numberOfItems: producten.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: producten.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.naam,
        url: p.url,
        ...(p.beeld ? { image: p.beeld } : {}),
        ...(p.merk ? { brand: { "@type": "Brand", name: p.merk } } : {}),
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: p.url,
          ...(p.prijs ? { price: p.prijs } : {}),
        },
        ...(p.score && p.reviews
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: p.score,
                reviewCount: p.reviews,
              },
            }
          : {}),
      },
    })),
  };
}
