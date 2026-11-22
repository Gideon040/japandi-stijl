import Link from "next/link";

// Brede sfeerbanner over de volle schermbreedte met tekst in het midden en
// een of twee knoppen. Voor afwisseling tussen de collectiebanners.

type Props = {
  aanloop: string;
  titel: string;
  tekst: string;
  beeld: string;
  beeldAlt: string;
  knoppen: { href: string; label: string }[];
};

export default function BreedBanner(props: Props) {
  return (
    <section className="relative overflow-hidden min-h-[420px] sm:min-h-[520px] flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.beeld} alt={props.beeldAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-inkt/45" />
      <div className="relative max-w-wide mx-auto px-6 py-16 text-center text-papier">
        <p className="font-display italic text-papier/90 text-lg">{props.aanloop}</p>
        <p className="font-display text-4xl sm:text-5xl leading-tight mt-1">{props.titel}</p>
        <p className="mt-4 mx-auto max-w-xl text-[16px] leading-relaxed text-papier/90">{props.tekst}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {props.knoppen.map((k, i) => (
            <Link
              key={k.href}
              href={k.href}
              className={
                i === 0
                  ? "inline-flex items-center gap-2 rounded-full bg-papier px-5 py-2.5 text-sm font-medium text-inkt no-underline"
                  : "inline-flex items-center gap-2 rounded-full border border-papier/80 px-5 py-2.5 text-sm font-medium text-papier no-underline hover:bg-papier/10"
              }
            >
              {k.label} <span aria-hidden>&#8594;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
