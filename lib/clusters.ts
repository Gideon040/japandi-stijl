import { getAllPages } from "./content";

// Topical clusters op ruimte en gebruik. Elke pagina heeft een primair
// cluster en mag in een paar extra clusters meeliften (kruisverwijzing),
// zodat de related-carousel gericht blijft en niet teruggaat naar
// "alles linkt naar alles". De carousel op een pagina toont de andere
// pagina's die het primaire cluster van die pagina delen.

export type ClusterKey =
  | "woonkamer"
  | "slaapkamer"
  | "eetkamer"
  | "badkamer"
  | "hal"
  | "werkplek"
  | "verlichting"
  | "decoratie"
  | "stijl";

export const CLUSTERS: Record<ClusterKey, { carouselTitel: string }> = {
  woonkamer: { carouselTitel: "Meer voor je woonkamer" },
  slaapkamer: { carouselTitel: "Meer voor je slaapkamer" },
  eetkamer: { carouselTitel: "Meer voor je eetkamer en keuken" },
  badkamer: { carouselTitel: "Meer voor je badkamer" },
  hal: { carouselTitel: "Meer voor je hal en entree" },
  werkplek: { carouselTitel: "Meer voor je werkplek" },
  verlichting: { carouselTitel: "Meer Japandi verlichting" },
  decoratie: { carouselTitel: "Meer Japandi decoratie en sfeer" },
  stijl: { carouselTitel: "Meer over de Japandi stijl" },
};

type Toewijzing = { primair: ClusterKey; ook?: ClusterKey[] };

const TOEWIJZING: Record<string, Toewijzing> = {
  // Woonkamer
  "japandi-woonkamer": { primair: "woonkamer" },
  "japandi-meubels": { primair: "woonkamer", ook: ["stijl"] },
  "japandi-bank": { primair: "woonkamer" },
  "japandi-fauteuil": { primair: "woonkamer" },
  "japandi-salontafel": { primair: "woonkamer" },
  "japandi-bijzettafel": { primair: "woonkamer" },
  "japandi-tv-meubel": { primair: "woonkamer" },
  "japandi-tv-meubel-beige": { primair: "woonkamer" },
  "japandi-tv-meubel-walnoot": { primair: "woonkamer" },
  "japandi-tv-kast": { primair: "woonkamer" },
  "japandi-cinewall": { primair: "woonkamer" },
  "japandi-dressoir": { primair: "woonkamer", ook: ["eetkamer"] },
  "japandi-boekenkast": { primair: "woonkamer", ook: ["werkplek"] },
  "japandi-vitrinekast": { primair: "woonkamer" },
  "japandi-buffetkast": { primair: "woonkamer", ook: ["eetkamer"] },
  "japandi-kast": { primair: "woonkamer", ook: ["slaapkamer"] },
  "japandi-ladekast": { primair: "woonkamer", ook: ["slaapkamer"] },
  "japandi-poef": { primair: "woonkamer" },
  "japandi-vloerkleed": { primair: "woonkamer", ook: ["slaapkamer"] },
  "japandi-vloerlamp": { primair: "woonkamer", ook: ["verlichting"] },
  "japandi-gordijnen": { primair: "woonkamer", ook: ["slaapkamer"] },
  "japandi-kussen": { primair: "woonkamer", ook: ["slaapkamer"] },
  "japandi-plant": { primair: "woonkamer", ook: ["decoratie"] },

  // Slaapkamer
  "japandi-slaapkamer": { primair: "slaapkamer" },
  "japandi-bed": { primair: "slaapkamer" },
  "japandi-boxspring": { primair: "slaapkamer" },
  "japandi-nachtkastje": { primair: "slaapkamer" },
  "japandi-dekbedovertrek": { primair: "slaapkamer" },

  // Eetkamer en keuken
  "japandi-eetkamer": { primair: "eetkamer" },
  "japandi-keuken": { primair: "eetkamer" },
  "japandi-eettafel": { primair: "eetkamer" },
  "japandi-eettafel-ovaal": { primair: "eetkamer" },
  "japandi-eettafel-rond": { primair: "eetkamer" },
  "japandi-eetkamerstoel": { primair: "eetkamer" },
  "japandi-eetkamerbank": { primair: "eetkamer" },
  "japandi-barkruk": { primair: "eetkamer" },
  "japandi-servies": { primair: "eetkamer", ook: ["decoratie"] },
  "japandi-fruitschaal": { primair: "eetkamer", ook: ["decoratie"] },
  "japandi-dienblad": { primair: "eetkamer", ook: ["decoratie"] },
  "japandi-onderzetters": { primair: "eetkamer" },
  "japandi-hanglamp": { primair: "eetkamer", ook: ["verlichting"] },

  // Badkamer en toilet
  "japandi-badkamer": { primair: "badkamer" },
  "japandi-badkamermeubel": { primair: "badkamer" },
  "japandi-tegels": { primair: "badkamer" },
  "japandi-wasmand": { primair: "badkamer" },
  "japandi-prullenbak": { primair: "badkamer" },
  "japandi-toilet": { primair: "badkamer" },

  // Hal en entree
  "japandi-hal": { primair: "hal" },
  "japandi-kapstok": { primair: "hal" },
  "japandi-deurmat": { primair: "hal" },
  "japandi-deur": { primair: "hal" },

  // Werkplek
  "japandi-bureau": { primair: "werkplek" },
  "japandi-kantoor": { primair: "werkplek" },

  // Verlichting (cross-room)
  "japandi-lamp": { primair: "verlichting" },
  "japandi-plafondlamp": { primair: "verlichting" },
  "japandi-tafellamp": { primair: "verlichting", ook: ["woonkamer"] },
  "japandi-wandlamp": { primair: "verlichting", ook: ["hal"] },

  // Decoratie en sfeer (cross-room)
  "japandi-decoratie": { primair: "decoratie" },
  "japandi-accessoires": { primair: "decoratie" },
  "japandi-vaas": { primair: "decoratie", ook: ["woonkamer"] },
  "japandi-bloempot": { primair: "decoratie", ook: ["woonkamer"] },
  "japandi-spiegel": { primair: "decoratie", ook: ["hal", "slaapkamer"] },
  "japandi-schilderij": { primair: "decoratie", ook: ["woonkamer"] },
  "japandi-poster": { primair: "decoratie" },
  "japandi-wanddecoratie": { primair: "decoratie", ook: ["woonkamer"] },
  "japandi-klok": { primair: "decoratie" },
  "japandi-fotolijst": { primair: "decoratie" },
  "japandi-behang": { primair: "decoratie" },

  // Stijl en basis
  "japandi-kleuren": { primair: "stijl" },
  "japandi-vs-wabi-sabi": { primair: "stijl" },
  "japandi-chique": { primair: "stijl" },
  "japandi-textiel": { primair: "stijl", ook: ["woonkamer"] },
  "japandi-tuin": { primair: "stijl" },
};

export type ClusterKaart = { href: string; titel: string; beeldId: string };

function clustersVan(slug: string): ClusterKey[] {
  const t = TOEWIJZING[slug];
  if (!t) return [];
  return [t.primair, ...(t.ook ?? [])];
}

function korteTitel(titel: string): string {
  return titel.split(":")[0].trim();
}

export type ClusterRij = { titel: string; kaarten: ClusterKaart[] };

function kaartenVoorCluster(slug: string, doel: ClusterKey, paginas: Map<string, ReturnType<typeof getAllPages>[number]>): ClusterKaart[] {
  return Object.keys(TOEWIJZING)
    .filter((s) => s !== slug && paginas.has(s) && clustersVan(s).includes(doel))
    .map((s) => {
      const p = paginas.get(s)!;
      return { slug: s, datum: p.datum, titel: korteTitel(p.titel) };
    })
    .sort((a, b) => (b.datum ?? "").localeCompare(a.datum ?? ""))
    .slice(0, 14)
    .map((p): ClusterKaart => ({ href: `/${p.slug}/`, titel: p.titel, beeldId: `${p.slug}-hero` }));
}

// Geeft de cluster-rijen voor een pagina: een rij per cluster waar de pagina
// in zit (primair eerst, dan de kruisverwijzingen). Elke rij bevat de andere
// pagina's uit dat cluster, nieuwste eerst, max 14. De paginaroute verspreidt
// deze rijen over de body zodat het natuurlijk leest in plaats van een lange
// "alles linkt naar alles"-lijst onderaan.
export function getClusterCarousels(slug: string): ClusterRij[] {
  const eigen = TOEWIJZING[slug];
  if (!eigen) return [];

  const paginas = new Map(getAllPages().map((p) => [p.slug, p]));
  const doelen: ClusterKey[] = [eigen.primair, ...(eigen.ook ?? [])];

  const rijen: ClusterRij[] = [];
  for (const doel of doelen) {
    const kaarten = kaartenVoorCluster(slug, doel, paginas);
    if (kaarten.length > 0) rijen.push({ titel: CLUSTERS[doel].carouselTitel, kaarten });
  }
  return rijen;
}
