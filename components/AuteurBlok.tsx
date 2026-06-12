import { AUTEUR_NAAM, AUTEUR_INITIAAL, auteurFoto } from "@/lib/auteur";

// Auteur-byline onderaan elke pagina (E-E-A-T). Toont de foto zodra het
// bestand bestaat (webp of jpg); tot die tijd een rustige initiaal-cirkel,
// zodat er nooit een gebroken beeld verschijnt.
const NAAM = AUTEUR_NAAM;
const INITIAAL = AUTEUR_INITIAAL;

export default function AuteurBlok() {
  const fotoSrc = auteurFoto();
  return (
    <aside className="bg-zand border-t border-lijn">
      <div className="max-w-content mx-auto px-6 py-14 text-center">
        {fotoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoSrc}
            alt={`${NAAM}, oprichter van japandi-stijl.nl`}
            className="w-20 h-20 mx-auto mb-5 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-20 h-20 mx-auto mb-5 rounded-full border border-klei flex items-center justify-center font-display italic text-walnoot text-2xl"
            aria-hidden
          >
            {INITIAAL}
          </div>
        )}
        <p className="text-xs uppercase tracking-[0.18em] text-klei mb-1">Geschreven door</p>
        <p className="font-display text-2xl sm:text-3xl mb-4">{NAAM}</p>
        <p className="text-[15px] leading-relaxed text-inkt/90">
          Ik richt al jaren mijn eigen huis in volgens de Japandi-stijl. Japandi-stijl.nl is mijn
          onafhankelijke platform: ik verkoop zelf niets, maar zoek het web af naar meubels en
          accessoires die echt bij de stijl passen. Ik vergelijk op materiaal, maat en afwerking,
          cureer daaruit een eerlijke selectie en wijs je door naar de webshops die ze voeren.
          Past iets niet bij Japandi, dan raad ik het gewoon af.
        </p>
      </div>
    </aside>
  );
}
