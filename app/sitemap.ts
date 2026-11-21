import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/content";
import { getAlleProductHandles } from "@/lib/shopify";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://japandi-stijl.nl";
  // Faalt zacht: zonder Shopify blijft de sitemap gewoon de contentpagina's tonen.
  const producten = await getAlleProductHandles();
  return [
    { url: `${base}/`, lastModified: new Date() },
    ...getAllPages().map((p) => ({
      url: `${base}/${p.slug}/`,
      lastModified: p.datum ? new Date(p.datum) : new Date(),
    })),
    ...producten.map((p) => ({
      url: `${base}/product/${p.handle}/`,
      lastModified: new Date(p.updatedAt),
    })),
  ];
}
