import Link from "next/link";
import { getAlleProductenKort, type ProductKort } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";

// Collectiebanner voor de homepage: groot sfeerbeeld met titel en knop,
// daarnaast vier producten uit die collectie. Wissel beeldLinks per banner
// voor afwisseling. Rendert niets als er geen producten gevonden worden.

type Props = {
  aanloop: string;
  titel: string;
  tekst: string;
  beeld: string;
  beeldAlt: string;
  href: string;
  knop: string;
  handles: string[];
  beeldLinks?: boolean;
  achtergrond?: "papier" | "zand" | "zand-diep";
  id?: string;
};

const BG = { papier: "bg-papier", zand: "bg-zand", "zand-diep": "bg-zand-diep" };

function Tegel({ p }: { p: ProductKort }) {
  return (
    <li className="list-none m-0 p-0">
      <Link
        href={`/product/${p.handle}/`}
        className="group flex flex-col h-full bg-papier rounded-sm shadow-sm no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md"
      >
        <div className="aspect-square bg-zand rounded-t-sm p-4">
          {p.beeld && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.beeld.url} alt={p.beeld.altText ?? p.title} loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
          )}
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {p.vendor && <span className="text-[0.65rem] uppercase tracking-[0.1em] text-klei">{p.vendor}</span>}
          <span className="font-display text-base sm:text-lg leading-snug mt-0.5 group-hover:text-walnoot transition-colors">{p.title}</span>
          <span className="mt-auto pt-2 text-walnoot font-semibold text-sm sm:text-base">
            {formatPrijs(p.prijs.amount, p.prijs.currencyCode)}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default async function CollectieBanner(props: Props) {
  let alle: ProductKort[] = [];
  try {
    alle = await getAlleProductenKort();
  } catch {
    return null;
  }
  const opHandle = new Map(alle.map((p) => [p.handle, p]));
  const producten = props.handles.map((h) => opHandle.get(h)).filter((p): p is ProductKort => !!p).slice(0, 4);
  if (!producten.length) return null;

  const beeldBlok = (
    <Link href={props.href} className="group relative block overflow-hidden rounded-sm no-underline min-h-[340px] lg:min-h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={props.beeld}
        alt={props.beeldAlt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-inkt/70 via-inkt/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-papier">
        <p className="font-display italic text-papier/90">{props.aanloop}</p>
        <p className="font-display text-3xl sm:text-4xl leading-tight mt-1">{props.titel}</p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-papier/90">{props.tekst}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-papier px-5 py-2.5 text-sm font-medium text-inkt">
          {props.knop} <span aria-hidden>&#8594;</span>
        </span>
      </div>
    </Link>
  );

  const productBlok = (
    <ul className="grid grid-cols-2 gap-4 p-0 m-0 content-start">
      {producten.map((p) => (
        <Tegel key={p.handle} p={p} />
      ))}
    </ul>
  );

  return (
    <section id={props.id} className={`${BG[props.achtergrond ?? "papier"]} scroll-mt-20`}>
      <div className="max-w-wide mx-auto px-6 py-14 sm:py-16">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-stretch">
          {props.beeldLinks === false ? (
            <>
              <div className="order-2 lg:order-1">{productBlok}</div>
              <div className="order-1 lg:order-2">{beeldBlok}</div>
            </>
          ) : (
            <>
              {beeldBlok}
              {productBlok}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
