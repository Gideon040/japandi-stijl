// Kernpunten onder de producttitel, elk met een lijnicoon. Het icoon volgt uit
// de tekst (maat, geluid, materiaal, gewicht, kleur, onderhoud), met een vinkje
// als terugval. Schrijfwijze in Shopify: "Titel: toelichting", een per regel.

type Soort = "maat" | "stil" | "materiaal" | "licht" | "kleur" | "onderhoud" | "vink";

const REGELS: [Soort, RegExp][] = [
  ["maat", /\b(cm|mm|meter|formaat|doorsnede|breed|hoog|diep|maat|afmeting|compact|ruimte)/i],
  ["stil", /(stil|geruisloos|tik|geluid)/i],
  ["materiaal", /(hout|eiken|walnoot|bamboe|rotan|keramiek|linnen|katoen|steen|travertijn|metaal|kunststof|materiaal|papier)/i],
  ["licht", /(licht van gewicht|lichtgewicht|gewicht|\bkg\b)/i],
  ["kleur", /(kleur|tint|beige|zand|bruin|zwart|wit|naturel)/i],
  ["onderhoud", /(onderhoud|schoon|afneembaar|wasbaar|montage|monteren|ophangen)/i],
];

function soortVan(tekst: string): Soort {
  return REGELS.find(([, re]) => re.test(tekst))?.[0] ?? "vink";
}

function Icoon({ soort }: { soort: Soort }) {
  const gemeen = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  switch (soort) {
    case "maat":
      return (
        <svg {...gemeen}>
          <rect x="3" y="8" width="18" height="8" rx="1" />
          <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
        </svg>
      );
    case "stil":
      return (
        <svg {...gemeen}>
          <path d="M4 10v4h3l4 3V7l-4 3H4z" />
          <path d="M16 10l4 4M20 10l-4 4" />
        </svg>
      );
    case "materiaal":
      return (
        <svg {...gemeen}>
          <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
          <path d="M5 19c3-5 6-8 10-10" />
        </svg>
      );
    case "licht":
      return (
        <svg {...gemeen}>
          <path d="M20 4c-8 0-13 5-13 12v4" />
          <path d="M20 4c0 7-4 11-10 12" />
          <path d="M7 14h6M9 10h7" />
        </svg>
      );
    case "kleur":
      return (
        <svg {...gemeen}>
          <path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" />
        </svg>
      );
    case "onderhoud":
      return (
        <svg {...gemeen}>
          <path d="M14 6a4 4 0 005 5l-8 8a2.1 2.1 0 01-3-3l8-8" />
          <path d="M14 6l3-3 4 4-3 3" />
        </svg>
      );
    default:
      return (
        <svg {...gemeen}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l3 3 5-6" />
        </svg>
      );
  }
}

export default function UspLijst({ punten }: { punten: string[] }) {
  if (punten.length === 0) return null;
  return (
    <ul className="mt-5 space-y-2.5 list-none p-0 m-0">
      {punten.slice(0, 5).map((punt) => {
        const i = punt.indexOf(":");
        const titel = i > 0 ? punt.slice(0, i).trim() : null;
        const rest = i > 0 ? punt.slice(i + 1).trim() : punt;
        return (
          <li key={punt} className="flex items-start gap-3 list-none m-0 p-0 text-[0.95rem] leading-snug">
            <span className="text-terracotta shrink-0">
              <Icoon soort={soortVan(punt)} />
            </span>
            <span className="pt-0.5">
              {titel && <span className="font-medium text-inkt">{titel}. </span>}
              <span className={titel ? "text-klei" : "text-inkt"}>{rest}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
