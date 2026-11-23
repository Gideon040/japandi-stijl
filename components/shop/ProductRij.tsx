import Link from "next/link";
import { getAlleProductenKort, type ProductKort } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";

// Horizontaal scrollende productrij voor de homepage, gefilterd op een
// maximumprijs. Groeit vanzelf mee met het assortiment. Rendert niets als er
// te weinig producten zijn.

type Props = {
  aanloop: string;
  titel: string;
  tekst?: string;
  maxPrijs: number;
  achtergrond?: "papier" | "zand" | "zand-diep";
  max?: number;
};

const BG = { papier: "bg-papier", zand: "bg-zand", "zand-diep": "bg-zand-diep" };

function Kaart({ p }: { p: ProductKort }) {
  return (
    <li className="m-0 p-0 snap-start shrink-0 w-[62%] sm:w-[38%] lg:w-[calc((100%-4*1.25rem)/5)]">
      <Link
        href={`/product/${p.handle}/`}
        className="group flex flex-col h-full bg-papier rounded-sm shadow-sm no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md"
      >
        <div className="aspect-[4/3] bg-zand rounded-t-sm overflow-hidden">
          {p.beeld && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.beeld.url} alt={p.beeld.altText ?? p.title} loading="lazy" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {p.vendor && <span className="text-[0.65rem] uppercase tracking-[0.1em] text-klei">{p.vendor}</span>}
          <span className="font-display text-base leading-snug mt-0.5 group-hover:text-walnoot transition-colors">{p.title}</span>
          <span className="mt-auto pt-2 text-walnoot font-semibold text-sm">{formatPrijs(p.prijs.amount, p.prijs.currencyCode)}</span>
        </div>
      </Link>
    </li>
  );
}

export default async function ProductRij(props: Props) {
  let alle: ProductKort[] = [];
  try {
    alle = await getAlleProductenKort();
  } catch {
    return null;
  }
  const producten = alle
    .filter((p) => p.beeld && Number(p.prijs.amount) > 0 && Number(p.prijs.amount) <= props.maxPrijs)
    .sort((a, b) => Number(a.prijs.amount) - Number(b.prijs.amount))
    .slice(0, props.max ?? 12);
  if (producten.length < 3) return null;

  return (
    <section className={BG[props.achtergrond ?? "papier"]}>
      <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="kop font-display text-3xl sm:text-4xl">
            <em>{props.aanloop}</em>
            {props.titel}
          </h2>
          <span className="text-sm text-klei">Swipe voor meer &#8594;</span>
        </div>
        {props.tekst && <p className="prose-japandi mt-4 max-w-content">{props.tekst}</p>}
        <ul className="mt-8 -mx-6 px-6 scroll-pl-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 list-none [scrollbar-width:thin]">
          {producten.map((p) => (
            <Kaart key={p.handle} p={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
