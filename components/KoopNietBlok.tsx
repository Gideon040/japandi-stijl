import ImagePlaceholder from "./ImagePlaceholder";
import { AUTEUR_NAAM, AUTEUR_INITIAAL, auteurFoto } from "@/lib/auteur";

type Props = { titel?: string; beeldId?: string; children: React.ReactNode };

// Voor afraders en waarschuwingen. Producten hier krijgen GEEN link.
// Met beeldId wordt het een split: waarschuwingskaart naast een sfeerbeeld
// (designreferentie). beeldId-conventie: {slug}-koopniet.
export default function KoopNietBlok({ titel = "Let hierop", beeldId, children }: Props) {
  const fotoSrc = auteurFoto();
  const kaart = (
    <aside className="border-l-[3px] border-walnoot bg-papier shadow-sm px-6 py-5 max-w-[34rem]">
      <p className="font-display text-lg mb-2">{titel}</p>
      <div className="text-sm leading-relaxed">{children}</div>
      <div className="mt-4 pt-3 border-t border-lijn flex items-center gap-3">
        {fotoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoSrc}
            alt={`${AUTEUR_NAAM}, oprichter van japandi-stijl.nl`}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full border border-klei flex items-center justify-center font-display italic text-walnoot text-sm shrink-0"
            aria-hidden
          >
            {AUTEUR_INITIAAL}
          </div>
        )}
        <span className="text-xs leading-snug text-klei">
          <span className="text-inkt">{AUTEUR_NAAM}</span>
          <br />
          Ik stel de selectie zelf samen en zeg eerlijk wat ik niet zou kopen.
        </span>
      </div>
    </aside>
  );
  if (!beeldId) return <div className="my-8">{kaart}</div>;
  return (
    <div className="my-8 grid gap-10 lg:gap-[4.5rem] lg:grid-cols-[6fr_5fr] items-center">
      {kaart}
      <div className="hidden lg:block">
        <ImagePlaceholder id={beeldId} inGrid />
      </div>
    </div>
  );
}
