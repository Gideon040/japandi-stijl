import { Fragment } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPages, getPage } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import remarkHeadingId from "@/lib/remark-heading-id";
import remarkLayout from "@/lib/remark-layout";
import AuteurBlok from "@/components/AuteurBlok";
import ClusterCarousel from "@/components/ClusterCarousel";
import { getClusterCarousels, type ClusterRij } from "@/lib/clusters";
import PageHero from "@/components/PageHero";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import type { PageMeta } from "@/lib/content";
import { paginaSchema, productLijstSchema, extractProducts, ogBeeld, SITE_NAAM } from "@/lib/seo";

// Intro (direct antwoord) plus hero-beeld worden uit de MDX-body getild
// en in de PageHero gerenderd; de rest van de body krijgt het sectieritme.
const HERO_PATTERN = /^([\s\S]*?)<ImagePlaceholder\s+id="([^"]+)"\s+priority\s*\/>\s*/;

// Splitst de MDX-body in stukken per H2-kop, zodat de cluster-rijen tussen
// hele secties geplaatst kunnen worden (elke kop begint een nieuw deel).
function splitsOpH2(body: string): string[] {
  const regels = body.split("\n");
  const delen: string[] = [];
  let huidig: string[] = [];
  for (const regel of regels) {
    if (/^##\s/.test(regel) && huidig.length) {
      delen.push(huidig.join("\n"));
      huidig = [regel];
    } else {
      huidig.push(regel);
    }
  }
  if (huidig.length) delen.push(huidig.join("\n"));
  return delen;
}

export function generateStaticParams() {
  return getAllPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  const titel = page.data.title_tag ?? page.data.titel;
  const beschrijving = page.data.beschrijving;
  const beeld = ogBeeld(slug);
  return {
    title: titel,
    description: beschrijving,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      type: "article",
      title: titel,
      description: beschrijving,
      url: `/${slug}/`,
      siteName: SITE_NAAM,
      images: [{ url: beeld }],
      ...(page.data.datum ? { publishedTime: page.data.datum } : {}),
    },
    twitter: { card: "summary_large_image", title: titel, description: beschrijving, images: [beeld] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const heroMatch = page.content.match(HERO_PATTERN);
  const intro = heroMatch ? heroMatch[1].trim() : "";
  const heroId = heroMatch ? heroMatch[2] : undefined;
  const body = heroMatch ? page.content.slice(heroMatch[0].length) : page.content;

  // Kruimelpad: zelfde databron voor de zichtbare Breadcrumb en het schema.
  // De korte naam is het deel voor de dubbele punt in de paginatitel.
  const korteNaam = page.data.titel.split(":")[0].trim();
  const crumbs: Crumb[] = [{ naam: "Home", href: "/" }];
  if (slug.startsWith("japandi-") && slug !== "japandi-stijl")
    crumbs.push({ naam: "Japandi stijl", href: "/japandi-stijl/" });
  crumbs.push({ naam: korteNaam });

  const meta = page.data as unknown as PageMeta;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.naam,
      item: `https://japandi-stijl.nl${c.href ?? `/${slug}/`}`,
    })),
  };

  // Cluster-rijen verspreid over de body: eerste rij na de eerste sectie, de
  // overige gespreid, nooit na de laatste sectie (daar staat de FAQ). Elke
  // chunk wordt apart gerenderd zodat de carousels ertussen passen; de
  // zand-band van de carousel scheidt de blokken visueel.
  const rijen = getClusterCarousels(slug);
  const delen = splitsOpH2(body);
  const maxNa = delen.length - 2;
  const grenzen: number[] = [];
  for (let r = 0; r < rijen.length && maxNa >= 0; r++) {
    let idx = r === 0 ? 0 : Math.round((delen.length * (r + 1)) / (rijen.length + 1));
    idx = Math.min(Math.max(idx, 0), maxNa);
    const vorige = grenzen.length ? grenzen[grenzen.length - 1] : -1;
    if (idx <= vorige) idx = vorige + 1;
    if (idx > maxNa) break;
    grenzen.push(idx);
  }
  const blokken: { mdx: string; rij?: ClusterRij }[] = [];
  let cursor = 0;
  grenzen.forEach((g, i) => {
    blokken.push({ mdx: delen.slice(cursor, g + 1).join("\n"), rij: rijen[i] });
    cursor = g + 1;
  });
  blokken.push({ mdx: delen.slice(cursor).join("\n") });
  const restRijen = rijen.slice(grenzen.length);

  const graph: object[] = [paginaSchema(meta, slug), breadcrumb];
  if (meta.template === "koopgids") {
    const producten = extractProducts(page.content);
    if (producten.length > 0) graph.push(productLijstSchema(slug, producten));
  }

  return (
    <article>
      <PageHero
        titel={page.data.titel}
        heroId={heroId}
        kerncijfers={page.data.kerncijfers}
        breadcrumb={<Breadcrumb items={crumbs} />}
      >
        {intro && (
          <MDXRemote
            source={intro}
            components={mdxComponents}
            options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkHeadingId] } }}
          />
        )}
      </PageHero>
      <div className="prose-japandi pb-16">
        {/* blockJS=false: v6 blokkeert JS-expressies in MDX standaard; onze props
            (items, ids, score, kerncijfers) zijn vertrouwde repo-content. */}
        {blokken.map((blok, i) => (
          <Fragment key={i}>
            {blok.mdx.trim() && (
              <MDXRemote
                source={blok.mdx}
                components={mdxComponents}
                options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkHeadingId, remarkLayout] } }}
              />
            )}
            {blok.rij && <ClusterCarousel titel={blok.rij.titel} kaarten={blok.rij.kaarten} />}
          </Fragment>
        ))}
        {restRijen.map((rij) => (
          <ClusterCarousel key={rij.titel} titel={rij.titel} kaarten={rij.kaarten} />
        ))}
      </div>
      <AuteurBlok />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
    </article>
  );
}
