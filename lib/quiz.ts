// Datalaag van de Japandi-stijltest. Puur statische data plus scoring-helpers,
// zodat het client-component (components/Quiz.tsx) dit kan importeren zonder
// server-only afhankelijkheden. Alle koopgids-links zijn gepubliceerde pagina's.

export type ProfielId = "licht" | "walnoot" | "wabisabi";

export type Punten = Partial<Record<ProfielId, number>>;

export type Antwoord = {
  label: string;
  sub?: string;
  textuurId?: string; // beeld uit de textuurbibliotheek
  swatch?: string; // css-kleur of -gradient als fallback voor het beeld
  punten?: Punten; // alleen bij stijlvragen
  waarde?: string; // alleen bij context/ruimte-vragen
};

export type Vraag = {
  id: string;
  vraag: string;
  hint?: string;
  soort: "stijl" | "ruimtes" | "context";
  meerkeuze?: boolean;
  antwoorden: Antwoord[];
};

export type Link = { label: string; href: string };

export type Profiel = {
  id: ProfielId;
  naam: string;
  aanloop: string;
  omschrijving: string;
  texturen: { id: string; swatch: string; label: string }[];
  palet: { swatch: string; naam: string; textuurId?: string }[];
  materialen: string[];
  vermijd: { swatch: string; naam: string; reden: string; textuurId?: string }[];
};

// Eiken-gradient hergebruikt op de houttint- en vloervraag.
const EIKEN = "linear-gradient(135deg,#D7B98C,#BE9C68)";
const WALNOOT = "linear-gradient(135deg,#9E7A4F,#5C4633)";

export const VRAGEN: Vraag[] = [
  {
    id: "hout",
    vraag: "Welke houttint trekt je het meest?",
    soort: "stijl",
    antwoorden: [
      { label: "Licht eiken", sub: "honingkleurig, fijne nerf", textuurId: "textuur-eiken-licht", swatch: EIKEN, punten: { licht: 2 } },
      { label: "Warm walnoot", sub: "donker, diepe nerf", textuurId: "textuur-walnoot", swatch: WALNOOT, punten: { walnoot: 2 } },
      { label: "Levendig mango", sub: "wisselende, ruwe nerf", textuurId: "textuur-mango-acacia", swatch: "linear-gradient(135deg,#B5895C,#7A5836)", punten: { wabisabi: 2 } },
    ],
  },
  {
    id: "muur",
    vraag: "Welke muurkleur wil je om je heen?",
    soort: "stijl",
    antwoorden: [
      { label: "Gebroken wit", sub: "warm en helder", textuurId: "textuur-gebroken-wit", swatch: "#F4EFE6", punten: { licht: 2 } },
      { label: "Warm bruin of terracotta", sub: "diep en omhullend", textuurId: "textuur-warm-bruin", swatch: "#7A5C42", punten: { walnoot: 2 } },
      { label: "Zand met steenlook", sub: "mat en mineraal", textuurId: "textuur-zand", swatch: "#E4D7C0", punten: { wabisabi: 2 } },
    ],
  },
  {
    id: "bank",
    vraag: "Waar zou je bank van zijn?",
    soort: "stijl",
    antwoorden: [
      { label: "Licht linnen", sub: "naturel, ademend", textuurId: "textuur-linnen", swatch: "#E5DCCC", punten: { licht: 2 } },
      { label: "Leer in cognac", sub: "warm, veroudert mooi", textuurId: "textuur-leer", swatch: "#8A5A3B", punten: { walnoot: 2 } },
      { label: "Grove bouclé", sub: "lusjes, veel structuur", textuurId: "textuur-boucle", swatch: "#ECE4D6", punten: { wabisabi: 2 } },
    ],
  },
  {
    id: "accent",
    vraag: "Welk accentmateriaal spreekt je aan?",
    soort: "stijl",
    antwoorden: [
      { label: "Rotan en voile", sub: "licht vlechtwerk", textuurId: "textuur-rotan", swatch: "#D2BE8E", punten: { licht: 2 } },
      { label: "Messing en leer", sub: "warme metaalglans", textuurId: "textuur-messing", swatch: "linear-gradient(135deg,#C9A24B,#9C7A2E)", punten: { walnoot: 2 } },
      { label: "Travertijn en keramiek", sub: "ruwe natuursteen", textuurId: "textuur-travertijn", swatch: "#E4DBC8", punten: { wabisabi: 2 } },
    ],
  },
  {
    id: "vloer",
    vraag: "Welke vloer past bij jou?",
    soort: "stijl",
    antwoorden: [
      { label: "Licht eiken", sub: "helder en rustig", textuurId: "textuur-eiken-licht", swatch: EIKEN, punten: { licht: 2 } },
      { label: "Donker hout", sub: "warm en gelaagd", textuurId: "textuur-eiken-donker", swatch: "linear-gradient(135deg,#5C4633,#3E2E20)", punten: { walnoot: 2 } },
      { label: "Natuursteen met jute kleed", sub: "aards en tactiel", textuurId: "textuur-jute", swatch: "#C9B488", punten: { wabisabi: 2 } },
    ],
  },
  {
    id: "sfeer",
    vraag: "Welke sfeer wil je dat je huis uitstraalt?",
    soort: "stijl",
    antwoorden: [
      { label: "Licht en rustig", punten: { licht: 2 } },
      { label: "Warm en gelaagd", punten: { walnoot: 2 } },
      { label: "Ruw en verweerd", punten: { wabisabi: 2 } },
    ],
  },
  {
    id: "ruimtes",
    vraag: "Welke ruimtes ga je inrichten?",
    hint: "Kies er een of meer. Je krijgt straks alleen advies voor wat je aanvinkt.",
    soort: "ruimtes",
    meerkeuze: true,
    antwoorden: [
      { label: "Woonkamer", waarde: "woonkamer" },
      { label: "Slaapkamer", waarde: "slaapkamer" },
      { label: "Eetkamer", waarde: "eetkamer" },
      { label: "Keuken", waarde: "keuken" },
      { label: "Badkamer", waarde: "badkamer" },
      { label: "Hal", waarde: "hal" },
    ],
  },
  {
    id: "grootte",
    vraag: "Hoe is de ruimte waar je mee begint?",
    soort: "context",
    antwoorden: [
      { label: "Klein en aan de donkere kant", waarde: "klein-donker" },
      { label: "Gemiddeld", waarde: "gemiddeld" },
      { label: "Groot en licht", waarde: "groot-licht" },
    ],
  },
  {
    id: "kinderen",
    vraag: "Zijn er kinderen of huisdieren in huis?",
    soort: "context",
    antwoorden: [
      { label: "Ja", waarde: "ja" },
      { label: "Nee", waarde: "nee" },
    ],
  },
  {
    id: "budget",
    vraag: "Wat is je uitgangspunt qua budget per kernstuk?",
    soort: "context",
    antwoorden: [
      { label: "Budgetbewust", waarde: "budget" },
      { label: "Middensegment", waarde: "midden" },
      { label: "Ruimer budget, kwaliteit eerst", waarde: "hoger" },
    ],
  },
];

export const PROFIELEN: Record<ProfielId, Profiel> = {
  licht: {
    id: "licht",
    naam: "Licht & Scandi",
    aanloop: "Jouw profiel",
    omschrijving:
      "Jij houdt van een heldere, luchtige kamer. Licht eiken en essen, linnen en katoen in gebroken wit en beige, en zo veel mogelijk daglicht. Dit is de Scandinavische kant van Japandi: rustig, zacht en open, met rotan en voile als natuurlijke accenten. De warmte komt van textuur en hout, niet van donkere kleuren.",
    texturen: [
      { id: "textuur-eiken-licht", swatch: EIKEN, label: "Licht eiken" },
      { id: "textuur-essen", swatch: "linear-gradient(135deg,#E9DBB8,#D2BE8E)", label: "Essen" },
      { id: "textuur-linnen", swatch: "#E5DCCC", label: "Linnen" },
      { id: "textuur-rotan", swatch: "#D2BE8E", label: "Rotan" },
    ],
    palet: [
      { swatch: "#F4EFE6", naam: "Gebroken wit", textuurId: "textuur-gebroken-wit" },
      { swatch: "#E4D7C0", naam: "Zand en creme", textuurId: "textuur-zand" },
      { swatch: "#D7B98C", naam: "Licht eiken", textuurId: "textuur-eiken-licht" },
      { swatch: "#B9AFA0", naam: "Warm grijs", textuurId: "textuur-warm-grijs" },
    ],
    materialen: ["Licht eiken en essen", "Linnen en katoen", "Rotan en bamboe", "Wol in naturel"],
    vermijd: [
      { swatch: "linear-gradient(135deg,#FFFFFF,#D8D8DA)", naam: "Hoogglans wit", reden: "te klinisch, breekt de zachte rust van het lichte palet", textuurId: "textuur-hoogglans-wit" },
      { swatch: "#7C8A9A", naam: "Koel blauwgrijs", reden: "haalt de warmte eruit, kies een beige ondertoon", textuurId: "textuur-blauwgrijs" },
    ],
  },
  walnoot: {
    id: "walnoot",
    naam: "Warm & Walnoot",
    aanloop: "Jouw profiel",
    omschrijving:
      "Jij wilt diepte en warmte. Donker walnoot of teak, leer in cognac, en een palet van zand en warm bruin met een terracotta- of olijfaccent. Dit is de richting die nu veel voorbijkomt in interieurvideo's: walnoot naast beige, ronde vormen en gedempt licht. Omhullend in plaats van koel, maar zonder de rust te verliezen.",
    texturen: [
      { id: "textuur-walnoot", swatch: WALNOOT, label: "Walnoot" },
      { id: "textuur-teak", swatch: "linear-gradient(135deg,#A9763E,#7A5126)", label: "Teak" },
      { id: "textuur-leer", swatch: "#8A5A3B", label: "Leer cognac" },
      { id: "textuur-messing", swatch: "linear-gradient(135deg,#C9A24B,#9C7A2E)", label: "Messing" },
    ],
    palet: [
      { swatch: "#5C4633", naam: "Walnoot", textuurId: "textuur-walnoot" },
      { swatch: "#E4D7C0", naam: "Zand", textuurId: "textuur-zand" },
      { swatch: "#A64D39", naam: "Terracotta", textuurId: "textuur-terracotta" },
      { swatch: "#7A5C42", naam: "Warm bruin", textuurId: "textuur-warm-bruin" },
    ],
    materialen: ["Massief walnoot en teak", "Leer in cognac", "Messing als metaalaccent", "Wol en gedempt velours"],
    vermijd: [
      { swatch: "linear-gradient(135deg,#FFFFFF,#D8D8DA)", naam: "Hoogglans en chroom", reden: "koud en hard naast het warme hout", textuurId: "textuur-hoogglans-wit" },
      { swatch: "#B8B8BC", naam: "Koel aluminium", reden: "vloekt met walnoot en terracotta, kies messing of mat zwart", textuurId: "textuur-aluminium" },
    ],
  },
  wabisabi: {
    id: "wabisabi",
    naam: "Wabi-sabi & mineraal",
    aanloop: "Jouw profiel",
    omschrijving:
      "Jij valt op ruwe, natuurlijke materialen. Matte steenlook, travertijn en ongeglazuurd keramiek, jute en papierkoord, in zand en greige. De wabi-sabi-kant van Japandi waardeert onregelmatigheid en patina: een vaas met een oneffen rand, een muur met zichtbare structuur. Aards en tactiel, nooit glad of glanzend.",
    texturen: [
      { id: "textuur-steenlook-wabisabi", swatch: "#E7E0D2", label: "Steenlook" },
      { id: "textuur-travertijn", swatch: "#E4DBC8", label: "Travertijn" },
      { id: "textuur-keramiek-mat", swatch: "#CFC3B0", label: "Mat keramiek" },
      { id: "textuur-jute", swatch: "#C9B488", label: "Jute" },
    ],
    palet: [
      { swatch: "#F4EFE6", naam: "Gebroken wit", textuurId: "textuur-gebroken-wit" },
      { swatch: "#CFC3B0", naam: "Greige", textuurId: "textuur-greige" },
      { swatch: "#E4D7C0", naam: "Zand", textuurId: "textuur-zand" },
      { swatch: "#C9B488", naam: "Naturel steen", textuurId: "textuur-travertijn" },
    ],
    materialen: ["Matte steenlook en travertijn", "Ongeglazuurd keramiek", "Jute en papierkoord", "Linnen met grove structuur"],
    vermijd: [
      { swatch: "linear-gradient(135deg,#FFFFFF,#D8D8DA)", naam: "Hoogglans kunststof", reden: "mist de diepte en onregelmatigheid van echt materiaal", textuurId: "textuur-hoogglans-wit" },
      { swatch: "#EDE7DC", naam: "Faux fur", reden: "glanzend en synthetisch, het tegenovergestelde van mat en mineraal", textuurId: "textuur-faux-fur" },
      { swatch: "#9C7B57", naam: "Houtprint op melamine", reden: "een vlakke namaaknerf verraadt zich naast echte structuur", textuurId: "textuur-houtlook-imitatie" },
    ],
  },
};

export const RUIMTE_LABEL: Record<string, string> = {
  woonkamer: "Woonkamer",
  slaapkamer: "Slaapkamer",
  eetkamer: "Eetkamer",
  keuken: "Keuken",
  badkamer: "Badkamer",
  hal: "Hal",
};

const RUIMTE_BASIS: Record<string, Link[]> = {
  woonkamer: [
    { label: "Bank", href: "/japandi-bank/" },
    { label: "Salontafel", href: "/japandi-salontafel/" },
    { label: "Vloerkleed", href: "/japandi-vloerkleed/" },
    { label: "Fauteuil", href: "/japandi-fauteuil/" },
    { label: "Vloerlamp", href: "/japandi-vloerlamp/" },
  ],
  slaapkamer: [
    { label: "Bed", href: "/japandi-bed/" },
    { label: "Nachtkastje", href: "/japandi-nachtkastje/" },
    { label: "Dekbedovertrek", href: "/japandi-dekbedovertrek/" },
    { label: "Kussens", href: "/japandi-kussen/" },
  ],
  eetkamer: [
    { label: "Eettafel", href: "/japandi-eettafel/" },
    { label: "Eetkamerstoel", href: "/japandi-eetkamerstoel/" },
    { label: "Dressoir", href: "/japandi-dressoir/" },
    { label: "Hanglamp", href: "/japandi-hanglamp/" },
  ],
  keuken: [
    { label: "Keuken inrichten", href: "/japandi-keuken/" },
    { label: "Servies", href: "/japandi-servies/" },
    { label: "Klok", href: "/japandi-klok/" },
  ],
  badkamer: [
    { label: "Badkamer inrichten", href: "/japandi-badkamer/" },
    { label: "Spiegel", href: "/japandi-spiegel/" },
    { label: "Plafondlamp", href: "/japandi-plafondlamp/" },
  ],
  hal: [
    { label: "Kapstok", href: "/japandi-kapstok/" },
    { label: "Deurmat", href: "/japandi-deurmat/" },
    { label: "Spiegel", href: "/japandi-spiegel/" },
  ],
};

// Profielafhankelijk tv-meubel: walnoot krijgt de walnoot-variant, licht de
// beige, wabi-sabi de neutrale hoofdpagina.
const TV_PER_PROFIEL: Record<ProfielId, Link> = {
  walnoot: { label: "Tv-meubel walnoot", href: "/japandi-tv-meubel-walnoot/" },
  licht: { label: "Tv-meubel beige", href: "/japandi-tv-meubel-beige/" },
  wabisabi: { label: "Tv-meubel", href: "/japandi-tv-meubel/" },
};

export function ruimteLinks(profiel: ProfielId, ruimte: string): Link[] {
  const basis = RUIMTE_BASIS[ruimte] ?? [];
  if (ruimte !== "woonkamer") return basis;
  // Voeg het profielspecifieke tv-meubel toe na de salontafel.
  const out = [...basis];
  out.splice(2, 0, TV_PER_PROFIEL[profiel]);
  return out;
}

export function legeScores(): Record<ProfielId, number> {
  return { licht: 0, walnoot: 0, wabisabi: 0 };
}

const TIEBREAK: ProfielId[] = ["walnoot", "licht", "wabisabi"];

// Hoogste score wint; bij gelijke stand beslist de vaste prioriteit
// (walnoot als meest gevraagde richting eerst).
export function bepaalProfiel(scores: Record<ProfielId, number>): ProfielId {
  let best: ProfielId = TIEBREAK[0];
  for (const p of TIEBREAK) {
    if (scores[p] > scores[best]) best = p;
  }
  return best;
}

export function grootteTip(waarde: string | undefined): string | null {
  if (waarde === "klein-donker")
    return "Je begint in een kleine, donkere ruimte. Houd vloer en muren licht, kies de warmere houttinten boven koel grijs, en werk met meerdere warme lichtbronnen op ooghoogte in plaats van een fel plafondlicht.";
  if (waarde === "groot-licht")
    return "Je hebt veel ruimte en licht. Je kunt een donker anker toevoegen, zoals een walnoot dressoir of een dieper vloerkleed, zonder dat het zwaar wordt, en durf vlakken bewust leeg te laten.";
  return null;
}

export function kinderenTip(waarde: string | undefined): string | null {
  if (waarde === "ja")
    return "Met kinderen of huisdieren: kies wasbaar katoen of een dicht geweven stof boven licht linnen en lichte bouclé, en geolied of gelakt hout dat tegen een stootje kan. Een beetje slijtage hoort bij wabi-sabi, maar niet iedereen wil dat.";
  return null;
}

export function budgetTip(waarde: string | undefined): string | null {
  if (waarde === "budget")
    return "Op een kleiner budget: kies massief hout voor het ene stuk dat je het meest ziet, zoals de eettafel of het tv-meubel, en accepteer fineer voor de rest. Glanzende houtprint verraadt zich het snelst, die laat je staan.";
  if (waarde === "hoger")
    return "Met ruimer budget: investeer in massief hout en echt leer of wol op de stukken die je dagelijks gebruikt. Daar betaalt kwaliteit zich terug in hoelang het mooi blijft.";
  return null;
}
