import { bolLink } from "@/lib/affiliate";

type Props = {
  naam: string;
  merk?: string;
  prijs: string; // alleen het bedrag, bijv. "118" of "89,95"; rendert als "ca. € 118"
  url: string; // kale bol.com product-URL, affiliate wrapping gebeurt hier
  afmetingen?: string;
  materiaal?: string;
  reviewscore?: string;
  voordelen: string[];
  nadeel?: string;
  beeld?: string; // officiele Bol-productfoto (media.s-bol.com), geen AI-beeld
};

export default function ProductCard(p: Props) {
  return (
    <div className="bg-papier rounded-sm shadow-sm flex flex-col h-full">
      {p.beeld && (
        <div className="aspect-[4/3] overflow-hidden rounded-t-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.beeld}
            alt={p.naam}
            loading="lazy"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        {p.merk && <span className="text-sm text-klei">{p.merk}</span>}
        <h3 className="font-display text-xl mt-0.5">{p.naam}</h3>
        <span className="text-walnoot font-medium mt-1">
          ca. &euro; {p.prijs}{" "}
          <span className="text-xs text-klei font-normal">(prijs bij publicatie)</span>
        </span>
        <dl className="text-sm text-klei mt-3 space-y-1">
          {p.afmetingen && (
            <div>
              <dt className="inline font-medium">Afmetingen: </dt>
              <dd className="inline">{p.afmetingen}</dd>
            </div>
          )}
          {p.materiaal && (
            <div>
              <dt className="inline font-medium">Materiaal: </dt>
              <dd className="inline">{p.materiaal}</dd>
            </div>
          )}
          {p.reviewscore && (
            <div>
              <dt className="inline font-medium">Reviews: </dt>
              <dd className="inline">{p.reviewscore}</dd>
            </div>
          )}
        </dl>
        <ul className="mt-4 space-y-1 text-sm list-none pl-0 mb-0">
          {p.voordelen.map((v) => (
            <li
              key={v}
              className="list-none pl-4 mb-0 relative before:content-['+'] before:absolute before:left-0 before:text-groen"
            >
              {v}
            </li>
          ))}
          {p.nadeel && (
            <li className="list-none pl-4 mb-0 relative before:content-['-'] before:absolute before:left-0 before:text-walnoot">
              {p.nadeel}
            </li>
          )}
        </ul>
        <div className="mt-auto pt-5">
          <a
            href={bolLink(p.url)}
            rel="sponsored noopener"
            target="_blank"
            className="inline-block px-5 py-2.5 bg-walnoot text-papier rounded-sm text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Bekijk bij Bol.com
          </a>
        </div>
      </div>
    </div>
  );
}
