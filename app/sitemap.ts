import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://japandi-stijl.nl";
  return [
    { url: `${base}/`, lastModified: new Date() },
    ...getAllPages().map((p) => ({
      url: `${base}/${p.slug}/`,
      lastModified: p.datum ? new Date(p.datum) : new Date(),
    })),
  ];
}
