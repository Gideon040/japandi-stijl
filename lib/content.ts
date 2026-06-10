import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export type PageMeta = {
  slug: string;
  titel: string;
  beschrijving: string;
  template: "pillar" | "gids" | "koopgids" | "longtail";
  gepubliceerd?: boolean;
  datum?: string;
  kerncijfers?: { waarde: string; label: string }[];
};

export function getAllPages(): PageMeta[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PAGES_DIR, f), "utf-8");
      const { data } = matter(raw);
      return { slug: f.replace(/\.mdx$/, ""), ...data } as PageMeta;
    })
    .filter((p) => p.gepubliceerd !== false);
}

export function getPage(slug: string) {
  const file = path.join(PAGES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  return matter(raw);
}
