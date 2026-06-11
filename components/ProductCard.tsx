import { winkelLink, winkelRel } from "@/lib/affiliate";
import Sterren from "./Sterren";

type Props = {
  naam: string;
  merk?: string;
  prijs: string; // alleen het bedrag, bijv. "118" of "89,95"; rendert als "ca. € 118"
  url: string; // kale product-URL, affiliate wrapping gebeurt via de router
  winkel?: string; // verplicht in nieuwe content; default Bol.com voor bestaande MDX
  afmetingen?: string;
  materiaal?: string;
  score?: number; // reviewscore 0-5, bijv. 4.2
  reviews?: number; // aantal reviews; zonder reviews tonen we geen sterren
  voordelen: string[];
  nadeel?: string;
  stijltip?: string; // combinatieadvies; component rendert het label "Combineer met:"
  beeld?: string; // officiele productfoto van de winkel, geen AI-beeld
};

export default function ProductCard(p: Props) {
  const winkel = p.winkel ?? "Bol.com";
  const isBol = winkel.toLowerCase().includes("bol");
  return (
    <div className="bg-papier rounded-sm shadow-sm flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
      {p.beeld && (
        <div className="aspect-square overflow-hidden rounded-t-sm p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.beeld}
            alt={p.naam}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        {p.merk && (
          <span className="text-[0.76rem] uppercase tracking-[0.1em] text-klei">{p.merk}</span>
        )}
        <h3 className="font-display text-[1.3rem] leading-snug mt-0.5">{p.naam}</h3>
        <span className="text-walnoot font-semibold mt-1">
          ca. &euro; {p.prijs}{" "}
          <span className="text-xs text-klei font-normal">(prijs bij publicatie)</span>
        </span>
        <div className="mt-2">
          <Sterren score={p.score} reviews={p.reviews} />
        </div>
        <dl className="text-[0.85rem] text-klei mt-3 space-y-1">
          {p.afmetingen && (
            <div>
              <dt className="inline font-medium text-inkt">Afmetingen: </dt>
              <dd className="inline">{p.afmetingen}</dd>
            </div>
          )}
          {p.materiaal && (
            <div>
              <dt className="inline font-medium text-inkt">Materiaal: </dt>
              <dd className="inline">{p.materiaal}</dd>
            </div>
          )}
        </dl>
        <ul className="mt-4 space-y-2 text-sm list-none pl-0 mb-0">
          {p.voordelen.map((v) => (
            <li key={v} className="list-none pl-0 mb-0 flex items-start gap-3">
              <span
                className="w-[1.15rem] h-[1.15rem] rounded-full bg-groen/15 text-groen flex items-center justify-center text-[11px] leading-none shrink-0 mt-0.5"
                aria-hidden
              >
                +
              </span>
              <span>{v}</span>
            </li>
          ))}
          {p.nadeel && (
            <li className="list-none pl-0 mb-0 flex items-start gap-3">
              <span
                className="w-[1.15rem] h-[1.15rem] rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center text-[11px] leading-none shrink-0 mt-0.5"
                aria-hidden
              >
                &#8722;
              </span>
              <span>{p.nadeel}</span>
            </li>
          )}
        </ul>
        {p.stijltip && (
          <p className="bg-zand rounded-sm px-4 py-3 mt-4 mb-0 text-[0.85rem] leading-relaxed">
            <b className="font-display italic font-normal text-walnoot">Combineer met:</b>{" "}
            {p.stijltip}
          </p>
        )}
        <div className="mt-auto pt-5">
          <a
            href={winkelLink(winkel, p.url)}
            rel={winkelRel(winkel)}
            target="_blank"
            className={`knop-pill ${
              isBol ? "bg-bolblauw hover:bg-bolblauw-donker" : "bg-walnoot hover:bg-walnoot/90"
            }`}
          >
            Bekijk bij {winkel}
          </a>
        </div>
      </div>
    </div>
  );
}
