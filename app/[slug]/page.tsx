import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPages, getPage } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import remarkHeadingId from "@/lib/remark-heading-id";
import remarkLayout from "@/lib/remark-layout";
import AuteurBlok from "@/components/AuteurBlok";
import PageHero from "@/components/PageHero";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import type { PageMeta } from "@/lib/content";
import { paginaSchema, productLijstSchema, extractProducts, ogBeeld, SITE_NAAM } from "@/lib/seo";

// Intro (direct antwoord) plus hero-beeld worden uit de MDX-body getild
// en in de PageHero gerenderd; de rest van de body krijgt het sectieritme.
const HERO_PATTERN = /^([\s\S]*?)<ImagePlaceholder\s+id="([^"]+)"\s+priority\s*\/>\s*/;

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
            options={{ mdxOptions: { remarkPlugins: [remarkHeadingId] } }}
          />
        )}
      </PageHero>
      <div className="prose-japandi pb-16">
        <MDXRemote
          source={body}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkHeadingId, remarkLayout] } }}
        />
      </div>
      <AuteurBlok />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
    </article>
  );
}
