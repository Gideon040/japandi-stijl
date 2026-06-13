import { getAllPages } from "./content";

export type NavLink = { href: string; label: string };
export type NavGroep = {
  titel: string;
  href?: string; // overzichts- of hubpagina van de groep
  hubLabel?: string; // label voor de overzichtslink in de dropdown
  beeld?: string; // manifest-id van een sfeerbeeld in de dropdown
  items: NavLink[];
};

// Curated categorie-indeling. De slugs worden gefilterd op wat echt
// gepubliceerd is, zodat de header automatisch meegroeit met publicaties
// en nooit naar een 404 wijst.
// Slugs die nog niet gepubliceerd zijn worden automatisch uitgefilterd
// (zie getNavigatie). Daarom mogen geplande pagina's hier alvast staan:
// ze verschijnen vanzelf in het menu zodra ze gebouwd zijn.
const GROEPEN: { titel: string; href?: string; hubLabel?: string; beeld?: string; slugs: { slug: string; label: string }[] }[] = [
  {
    titel: "Stijl & ruimte",
    beeld: "japandi-woonkamer-hero",
    slugs: [
      { slug: "japandi-kleuren", label: "Kleuren" },
      { slug: "japandi-vs-wabi-sabi", label: "Japandi vs wabi-sabi" },
      { slug: "japandi-woonkamer", label: "Woonkamer" },
      { slug: "japandi-slaapkamer", label: "Slaapkamer" },
      { slug: "japandi-eetkamer", label: "Eetkamer" },
      { slug: "japandi-keuken", label: "Keuken" },
      { slug: "japandi-badkamer", label: "Badkamer" },
      { slug: "japandi-toilet", label: "Toilet" },
      { slug: "japandi-hal", label: "Hal" },
      { slug: "japandi-kantoor", label: "Kantoor" },
      { slug: "japandi-tuin", label: "Tuin" },
    ],
  },
  {
    titel: "Meubels",
    href: "/japandi-meubels/",
    hubLabel: "Alle meubels",
    beeld: "japandi-meubels-hero",
    slugs: [
      { slug: "japandi-bank", label: "Bank" },
      { slug: "japandi-fauteuil", label: "Fauteuil" },
      { slug: "japandi-salontafel", label: "Salontafel" },
      { slug: "japandi-bijzettafel", label: "Bijzettafel" },
      { slug: "japandi-eettafel", label: "Eettafel" },
      { slug: "japandi-eetkamerstoel", label: "Eetkamerstoel" },
      { slug: "japandi-barkruk", label: "Barkruk" },
      { slug: "japandi-eetkamerbank", label: "Eetkamerbank" },
      { slug: "japandi-tv-meubel", label: "Tv-meubel" },
      { slug: "japandi-tv-kast", label: "Tv-kast" },
      { slug: "japandi-dressoir", label: "Dressoir" },
      { slug: "japandi-kast", label: "Kast" },
      { slug: "japandi-boekenkast", label: "Boekenkast" },
      { slug: "japandi-buffetkast", label: "Buffetkast" },
      { slug: "japandi-bed", label: "Bed" },
      { slug: "japandi-nachtkastje", label: "Nachtkastje" },
      { slug: "japandi-bureau", label: "Bureau" },
      { slug: "japandi-poef", label: "Poef" },
      { slug: "japandi-kapstok", label: "Kapstok" },
    ],
  },
  {
    titel: "Verlichting",
    href: "/japandi-lamp/",
    hubLabel: "Alle verlichting",
    beeld: "japandi-lamp-hero",
    slugs: [
      { slug: "japandi-plafondlamp", label: "Plafondlamp" },
      { slug: "japandi-hanglamp", label: "Hanglamp" },
      { slug: "japandi-vloerlamp", label: "Vloerlamp" },
      { slug: "japandi-tafellamp", label: "Tafellamp" },
      { slug: "japandi-wandlamp", label: "Wandlamp" },
    ],
  },
  {
    titel: "Textiel",
    beeld: "japandi-kussen-hero",
    slugs: [
      { slug: "japandi-vloerkleed", label: "Vloerkleed" },
      { slug: "japandi-kussen", label: "Kussen" },
      { slug: "japandi-gordijnen", label: "Gordijnen" },
      { slug: "japandi-dekbedovertrek", label: "Dekbedovertrek" },
      { slug: "japandi-deurmat", label: "Deurmat" },
    ],
  },
  {
    titel: "Decoratie",
    beeld: "japandi-vaas-hero",
    slugs: [
      { slug: "japandi-vaas", label: "Vaas" },
      { slug: "japandi-bloempot", label: "Bloempot" },
      { slug: "japandi-servies", label: "Servies" },
      { slug: "japandi-spiegel", label: "Spiegel" },
      { slug: "japandi-schilderij", label: "Schilderij" },
      { slug: "japandi-poster", label: "Poster" },
      { slug: "japandi-wanddecoratie", label: "Wanddecoratie" },
      { slug: "japandi-klok", label: "Klok" },
      { slug: "japandi-behang", label: "Behang" },
    ],
  },
];

export function getNavigatie(): NavGroep[] {
  const gepubliceerd = new Set(getAllPages().map((p) => p.slug));
  return GROEPEN.map((groep) => {
    const items = groep.slugs
      .filter((s) => gepubliceerd.has(s.slug))
      .map((s) => ({ href: `/${s.slug}/`, label: s.label }));
    const hrefBestaat = !groep.href || gepubliceerd.has(groep.href.replace(/^\/|\/$/g, ""));
    return {
      titel: groep.titel,
      href: hrefBestaat ? groep.href : undefined,
      hubLabel: hrefBestaat ? groep.hubLabel : undefined,
      beeld: groep.beeld,
      items,
    };
  }).filter((g) => g.items.length > 0);
}
