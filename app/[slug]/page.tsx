import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPages, getPage } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import remarkHeadingId from "@/lib/remark-heading-id";
import remarkLayout from "@/lib/remark-layout";
import AuteurBlok from "@/components/AuteurBlok";
import PageHero from "@/components/PageHero";

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
  return {
    title: page.data.title_tag ?? page.data.titel,
    description: page.data.beschrijving,
    alternates: { canonical: `/${slug}/` },
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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://japandi-stijl.nl/" },
      { "@type": "ListItem", position: 2, name: page.data.titel, item: `https://japandi-stijl.nl/${slug}/` },
    ],
  };

  return (
    <article>
      <PageHero titel={page.data.titel} heroId={heroId}>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </article>
  );
}
