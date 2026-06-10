import fs from "fs";
import path from "path";
import { getAllPages } from "./content";

export type GidsLink = { href: string; titel: string; template: string; datum?: string };

// Leest de keyword-mapping en kruist die met de gepubliceerde pagina's:
// alleen pagina's die echt bestaan komen in LinkLijsten en linkkaarten,
// zodat die automatisch meegroeien met elke publicatie.
function parseCsvRegel(regel: string): string[] {
  const velden: string[] = [];
  let veld = "";
  let inQuotes = false;
  for (const teken of regel) {
    if (teken === '"') inQuotes = !inQuotes;
    else if (teken === "," && !inQuotes) {
      velden.push(veld);
      veld = "";
    } else veld += teken;
  }
  velden.push(veld);
  return velden;
}

export function getGepubliceerdeGidsen(template?: "koopgids" | "gids"): GidsLink[] {
  const csv = fs.readFileSync(path.join(process.cwd(), "docs", "keyword-mapping.csv"), "utf-8");
  const [header, ...regels] = csv.split(/\r?\n/).filter(Boolean);
  const kolommen = parseCsvRegel(header);
  const iCluster = kolommen.indexOf("cluster");
  const iTemplate = kolommen.indexOf("template");
  const iUrl = kolommen.indexOf("nieuwe_url");

  const paginas = new Map(getAllPages().map((p) => [p.slug, p]));

  return regels
    .map(parseCsvRegel)
    .map((velden) => ({
      cluster: velden[iCluster],
      template: velden[iTemplate],
      url: velden[iUrl],
    }))
    .filter((r) => r.url && (!template || r.template === template))
    .map((r): GidsLink | null => {
      const slug = r.url.replace(/^\/|\/$/g, "");
      const pagina = paginas.get(slug);
      if (!pagina) return null;
      return {
        href: `/${slug}/`,
        titel: r.cluster.charAt(0).toUpperCase() + r.cluster.slice(1),
        template: r.template,
        datum: pagina.datum,
      };
    })
    .filter((r): r is GidsLink => r !== null);
}
