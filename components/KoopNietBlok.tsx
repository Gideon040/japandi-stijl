import ImagePlaceholder from "./ImagePlaceholder";

type Props = { titel?: string; beeldId?: string; children: React.ReactNode };

// Voor afraders en waarschuwingen. Producten hier krijgen GEEN link.
// Met beeldId wordt het een split: waarschuwingskaart naast een sfeerbeeld
// (designreferentie). beeldId-conventie: {slug}-koopniet.
export default function KoopNietBlok({ titel = "Let hierop", beeldId, children }: Props) {
  const kaart = (
    <aside className="border-l-[3px] border-walnoot bg-papier shadow-sm px-6 py-5 max-w-[34rem]">
      <p className="font-display text-lg mb-2">{titel}</p>
      <div className="text-sm leading-relaxed">{children}</div>
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
