import Link from "next/link";
import { getAlleProductenKort, type ProductKort } from "@/lib/shopify";
import { formatPrijs } from "@/lib/prijs";
import CollectieLijst from "./CollectieLijst";

// Overzicht van alle collecties uit de eigen winkel voor de homepage.
// Per collectie: een sfeerbeeld, aantal producten en laagste prijs, in de
// vormgeving van LinkKaart. Producten worden
// ingedeeld op hun gids-metafield, dus nieuwe producten verschijnen vanzelf.
// Een collectie zonder producten wordt overgeslagen.

type Sub = { slug: string; label: string };
type Collectie = { titel: string; beeld: string; href: string; subs: Sub[] };

const COLLECTIES: Collectie[] = [
  {
    titel: "Zitten",
    beeld: "japandi-fauteuil-hero",
    href: "/japandi-fauteuil/",
    subs: [
      { slug: "japandi-bank", label: "Banken" },
      { slug: "japandi-fauteuil", label: "Fauteuils" },
      { slug: "japandi-eetkamerstoel", label: "Eetkamerstoelen" },
      { slug: "japandi-eetkamerbank", label: "Eetkamerbanken" },
      { slug: "japandi-barkruk", label: "Barkrukken" },
      { slug: "japandi-poef", label: "Poefen" },
    ],
  },
  {
    titel: "Tafels",
    beeld: "japandi-eettafel-ovaal-hero",
    href: "/japandi-eettafel/",
    subs: [
      { slug: "japandi-eettafel", label: "Eettafels" },
      { slug: "japandi-eettafel-ovaal", label: "Ovale eettafels" },
      { slug: "japandi-eettafel-rond", label: "Ronde eettafels" },
      { slug: "japandi-salontafel", label: "Salontafels" },
      { slug: "japandi-bijzettafel", label: "Bijzettafels" },
      { slug: "japandi-bureau", label: "Bureaus" },
    ],
  },
  {
    titel: "Kasten en opbergen",
    beeld: "japandi-dressoir-hero",
    href: "/japandi-kast/",
    subs: [
      { slug: "japandi-kast", label: "Kasten" },
      { slug: "japandi-dressoir", label: "Dressoirs" },
      { slug: "japandi-ladekast", label: "Ladekasten" },
      { slug: "japandi-boekenkast", label: "Boekenkasten" },
      { slug: "japandi-tv-kast", label: "Tv-kasten" },
      { slug: "japandi-tv-meubel-walnoot", label: "Tv-meubels walnoot" },
      { slug: "japandi-tv-meubel-beige", label: "Tv-meubels beige" },
      { slug: "japandi-schoenenkast", label: "Schoenenkasten" },
      { slug: "japandi-kapstok", label: "Kapstokken" },
      { slug: "japandi-wasmand", label: "Wasmanden" },
    ],
  },
  {
    titel: "Slapen",
    beeld: "japandi-bed-hero",
    href: "/japandi-bed/",
    subs: [
      { slug: "japandi-bed", label: "Bedden" },
      { slug: "japandi-nachtkastje", label: "Nachtkastjes" },
      { slug: "japandi-dekbedovertrek", label: "Dekbedovertrekken" },
    ],
  },
  {
    titel: "Verlichting",
    beeld: "japandi-hanglamp-hero",
    href: "/japandi-lamp/",
    subs: [
      { slug: "japandi-hanglamp", label: "Hanglampen" },
      { slug: "japandi-plafondlamp", label: "Plafondlampen" },
      { slug: "japandi-wandlamp", label: "Wandlampen" },
      { slug: "japandi-tafellamp", label: "Tafellampen" },
      { slug: "japandi-vloerlamp", label: "Vloerlampen" },
    ],
  },
  {
    titel: "Textiel",
    beeld: "japandi-vloerkleed-hero",
    href: "/japandi-vloerkleed/",
    subs: [
      { slug: "japandi-vloerkleed", label: "Vloerkleden" },
      { slug: "japandi-kussen", label: "Kussens" },
      { slug: "japandi-gordijnen", label: "Gordijnen" },
      { slug: "japandi-deurmat", label: "Deurmatten" },
    ],
  },
  {
    titel: "Aan de muur",
    beeld: "japandi-schilderij-hero",
    href: "/japandi-wanddecoratie/",
    subs: [
      { slug: "japandi-schilderij", label: "Schilderijen" },
      { slug: "japandi-poster", label: "Posters" },
      { slug: "japandi-fotolijst", label: "Fotolijsten" },
      { slug: "japandi-wanddecoratie", label: "Wanddecoratie" },
      { slug: "japandi-spiegel", label: "Spiegels" },
      { slug: "japandi-klok", label: "Klokken" },
    ],
  },
  {
    titel: "Decoratie",
    beeld: "japandi-vaas-hero",
    href: "/japandi-decoratie/",
    subs: [
      { slug: "japandi-decoratie", label: "Decoratie" },
      { slug: "japandi-vaas", label: "Vazen" },
      { slug: "japandi-bloempot", label: "Bloempotten" },
    ],
  },
  {
    titel: "Keuken en tafel",
    beeld: "japandi-servies-hero",
    href: "/japandi-servies/",
    subs: [
      { slug: "japandi-servies", label: "Servies" },
      { slug: "japandi-fruitschaal", label: "Fruitschalen" },
      { slug: "japandi-dienblad", label: "Dienbladen" },
      { slug: "japandi-onderzetters", label: "Onderzetters" },
    ],
  },
  {
    titel: "Kleine accessoires",
    beeld: "japandi-prullenbak-hero",
    href: "/japandi-accessoires/",
    subs: [{ slug: "japandi-prullenbak", label: "Prullenbakken" }],
  },
];

type Props = { aanloop: string; titel: string; tekst: string; id?: string };

function Kaart({ c, producten }: { c: Collectie; producten: ProductKort[] }) {
  const laagste = producten.reduce((min, p) => (Number(p.prijs.amount) < Number(min.prijs.amount) ? p : min));
  return (
    <Link
        href={c.href}
        className="group block h-full bg-papier shadow-sm rounded-sm overflow-hidden no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md"
      >
        <span className="block aspect-[4/3] overflow-hidden bg-zand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${c.beeld}.webp`}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
        <span className="flex items-start justify-between gap-3 p-4 sm:p-5">
          <span>
            <span className="font-display text-lg sm:text-xl block leading-snug">{c.titel}</span>
            <span className="text-sm text-klei block mt-1">
              {producten.length} {producten.length === 1 ? "product" : "producten"}, vanaf{" "}
              {formatPrijs(laagste.prijs.amount, laagste.prijs.currencyCode)}
            </span>
          </span>
          <span className="text-klei transition-transform duration-200 group-hover:translate-x-1 mt-1" aria-hidden>
            &#8594;
          </span>
        </span>
      </Link>
  );
}

export default async function CollectieOverzicht(props: Props) {
  let alle: ProductKort[] = [];
  try {
    alle = await getAlleProductenKort();
  } catch {
    return null;
  }
  const rijen = COLLECTIES.map((c) => ({
    c,
    producten: alle.filter((p) => c.subs.some((s) => s.slug === p.gids)),
  })).filter((r) => r.producten.length > 0);
  if (!rijen.length) return null;

  return (
    <section id={props.id} className="bg-zand-diep scroll-mt-20">
      <div className="max-w-wide mx-auto px-6 py-16 sm:py-20">
        <div className="max-w-content">
          <h2 className="kop font-display text-3xl sm:text-4xl">
            <em>{props.aanloop}</em>
            {props.titel}
          </h2>
          <p className="mt-4 mb-0">{props.tekst}</p>
        </div>
        <CollectieLijst
          zichtbaar={4}
          kaarten={rijen.map((r) => (
            <Kaart key={r.c.titel} c={r.c} producten={r.producten} />
          ))}
        />
      </div>
    </section>
  );
}
