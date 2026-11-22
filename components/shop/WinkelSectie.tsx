import fs from "fs";
import path from "path";
import Link from "next/link";
import { getAlleProductenKort, type ProductKort } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";
import { getAllPages } from "@/lib/content";

// Homepage-blok "Uit onze winkel": een handvol uitgelichte producten en een
// rij met alle categorieën waarin we zelf verkopen, met het aantal producten.
// Rendert niets als Shopify niet bereikbaar is.

// Mix van categorieën, materialen en prijsklassen. Een handle die niet (meer)
// bestaat wordt overgeslagen en aangevuld met andere producten.
const UITGELICHT = [
  "angel-cerda-ronde-spiegel-walnoot-leren-band",
  "bazar-bizar-wabi-sabi-salontafel-rond",
  "mooisa-travertijn-fruitschaal-rond-24",
  "raw-materials-corda-hanglamp-touw",
  "mooisa-agano-vaas-travertijn",
  "angel-cerda-walnoten-dressoir-3077",
  "house-nordic-wanaka-staande-kapstok-bamboe",
  "ragaba-luka-bureau-essen",
];

const LABELS: Record<string, string> = {
  "japandi-tv-kast": "TV-kast",
  "japandi-tv-meubel": "TV-meubel",
  "japandi-eettafel-rond": "Ronde eettafel",
};

function label(slug: string) {
  if (LABELS[slug]) return LABELS[slug];
  const s = slug.replace(/^japandi-/, "").replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Sfeerbeeld van de gids als categoriebeeld: eerst de hero, anders een
// collage- of sectiebeeld van dezelfde pagina.
function categorieBeeld(slug: string): string | null {
  for (const slot of ["hero", "collage-1", "collage-2", "sectie-1", "faq"]) {
    const id = `${slug}-${slot}`;
    if (fs.existsSync(path.join(process.cwd(), "public", "images", `${id}.webp`))) return `/images/${id}.webp`;
  }
  return null;
}

function Tegel({ p }: { p: ProductKort }) {
  return (
    <li className="list-none m-0 p-0">
      <Link
        href={`/product/${p.handle}/`}
        className="group flex flex-col h-full bg-papier rounded-sm shadow-sm no-underline transition-shadow duration-200 hover:shadow-md"
      >
        <div className="aspect-square bg-zand rounded-t-sm p-5">
          {p.beeld && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.beeld.url} alt={p.beeld.altText ?? p.title} loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
          )}
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {p.vendor && <span className="text-[0.7rem] uppercase tracking-[0.1em] text-klei">{p.vendor}</span>}
          <span className="font-display text-lg leading-snug mt-0.5 group-hover:text-walnoot transition-colors">{p.title}</span>
          <span className="mt-auto pt-3 text-walnoot font-semibold">
            {formatPrijs(p.prijs.amount, p.prijs.currencyCode)}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default async function WinkelSectie() {
  let alle: ProductKort[] = [];
  try {
    alle = await getAlleProductenKort();
  } catch {
    return null;
  }
  if (!alle.length) return null;

  const opHandle = new Map(alle.map((p) => [p.handle, p]));
  const gekozen: ProductKort[] = UITGELICHT.map((h) => opHandle.get(h)).filter((p): p is ProductKort => !!p);
  for (const p of alle) {
    if (gekozen.length >= 8) break;
    if (!gekozen.includes(p) && p.gids && !gekozen.some((g) => g.gids === p.gids)) gekozen.push(p);
  }

  // Koppel elk product aan een bestaande gidspagina. Een gids-waarde als
  // "japandi-tv-meubel-walnoot" valt terug op "japandi-tv-meubel".
  const bestaand = new Set(getAllPages().map((p) => p.slug));
  const naarPagina = (g: string | null) => {
    let s = g ?? "";
    // Kleurvarianten (tv-meubel-beige, -walnoot) horen bij de hoofdcategorie.
    const kaal = s.replace(/-(beige|walnoot|eiken|zwart|wit)$/, "");
    if (kaal !== s && bestaand.has(kaal)) s = kaal;
    while (s && !bestaand.has(s)) s = s.includes("-") ? s.slice(0, s.lastIndexOf("-")) : "";
    return s && s !== "japandi" ? s : null;
  };
  const perGids = new Map<string, number>();
  const productBeeld = new Map<string, string>();
  for (const p of alle) {
    const g = naarPagina(p.gids);
    if (!g) continue;
    perGids.set(g, (perGids.get(g) ?? 0) + 1);
    if (p.beeld && !productBeeld.has(g)) productBeeld.set(g, p.beeld.url);
  }
  const categorieen = [...perGids.entries()].sort((a, b) => label(a[0]).localeCompare(label(b[0]), "nl"));

  return (
    <section id="winkel" className="bg-zand-diep scroll-mt-20">
      <div className="max-w-wide mx-auto px-6 py-16 sm:py-20">
        <h2 className="kop font-display text-3xl sm:text-4xl">
          <em>Uit onze winkel</em>
          Japandi meubels en accessoires die we zelf verkopen
        </h2>
        <p className="mt-5 max-w-content text-[17px] leading-relaxed">
          Naast de gidsen verkopen we een kleine selectie van {alle.length} producten, elk uitgekozen op vorm, materiaal,
          maat en prijs. Bij ieder product staat eerlijk wat ons bevalt en wat niet. We houden geen voorraad: je product
          komt rechtstreeks van de leverancier.
        </p>
        <ul className="mt-10 grid gap-5 grid-cols-2 lg:grid-cols-4 p-0 m-0">
          {gekozen.slice(0, 8).map((p) => (
            <Tegel key={p.handle} p={p} />
          ))}
        </ul>
        <h3 className="font-display text-2xl mt-14">Alle categorieën in de winkel</h3>
        <ul className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-0 m-0">
          {categorieen.map(([gids, aantal]) => {
            const sfeer = categorieBeeld(gids);
            const beeld = sfeer ?? productBeeld.get(gids) ?? null;
            return (
              <li key={gids} className="list-none m-0 p-0">
                <Link
                  href={`/${gids}/`}
                  className="group block bg-papier shadow-sm rounded-sm overflow-hidden no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md"
                >
                  <div className="aspect-[4/3] bg-zand overflow-hidden">
                    {beeld && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={beeld}
                        alt={`Japandi ${label(gids).toLowerCase()} in een interieur`}
                        loading="lazy"
                        className={`w-full h-full ${sfeer ? "object-cover" : "object-contain p-4 mix-blend-multiply"} transition-transform duration-300 group-hover:scale-[1.03]`}
                      />
                    )}
                  </div>
                  <span className="flex items-baseline justify-between gap-2 px-4 py-3">
                    <span className="font-display text-lg leading-snug">{label(gids)}</span>
                    <span className="text-sm text-klei whitespace-nowrap">
                      {aantal} {aantal === 1 ? "product" : "producten"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
