import Link from "next/link";
import { Icoon } from "@/components/shop/Zekerheden";

// Smalle balk met winkelbeloftes direct onder de hero. Alleen beloftes die we
// waarmaken (zie lib/winkel.ts); geen keurmerken, scores of gratis verzending.

const PUNTEN = [
  { icoon: "selectie" as const, titel: "Uitgekozen op stijl", tekst: "materiaal, vorm en maat eerst" },
  { icoon: "vraag" as const, titel: "Eerlijke plus- en minpunten", tekst: "bij elk product" },
  { icoon: "bedenktijd" as const, titel: "14 dagen bedenktijd", tekst: "vanaf ontvangst", href: "/herroepingsrecht/" },
  { icoon: "slot" as const, titel: "Veilig afrekenen", tekst: "verzendkosten vooraf zichtbaar" },
];

export default function UspBalk() {
  return (
    <section className="bg-papier border-b border-lijn">
      <ul className="max-w-wide mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 m-0 list-none">
        {PUNTEN.map((p) => {
          const inhoud = (
            <>
              <span className="text-walnoot shrink-0 mt-0.5">
                <Icoon soort={p.icoon} />
              </span>
              <span className="flex flex-col">
                <span className="text-[0.95rem] font-medium leading-snug">{p.titel}</span>
                <span className="text-sm text-klei leading-snug">{p.tekst}</span>
              </span>
            </>
          );
          return (
            <li key={p.titel} className="m-0 p-0">
              {p.href ? (
                <Link href={p.href} className="flex items-start gap-3 no-underline hover:text-walnoot transition-colors">
                  {inhoud}
                </Link>
              ) : (
                <div className="flex items-start gap-3">{inhoud}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
