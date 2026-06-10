import ImagePlaceholder from "./ImagePlaceholder";

type Props = {
  beeldId: string;
  beeldLinks?: boolean;
  rondId?: string; // rond accentbeeld over de hoek van het hoofdbeeld
  children: React.ReactNode;
};

// Beeld naast tekst, wisselend links/rechts per gebruik (designreferentie).
// Het optionele ronde accentbeeld (papier-rand, schaduw) is het
// overlap-moment dat elke pagina minimaal een keer nodig heeft.
export default function SplitSectie({ beeldId, beeldLinks, rondId, children }: Props) {
  return (
    <div
      className={`my-12 grid gap-10 lg:gap-[4.5rem] items-center ${
        beeldLinks ? "lg:grid-cols-[5fr_6fr]" : "lg:grid-cols-[6fr_5fr]"
      }`}
    >
      <div className={`relative ${beeldLinks ? "lg:order-1" : "lg:order-2"} ${rondId ? "mb-10 lg:mb-0" : ""}`}>
        <ImagePlaceholder id={beeldId} inGrid />
        {rondId && (
          <div className="absolute -bottom-8 right-4 w-28 h-28 lg:w-36 lg:h-36 lg:bottom-[-2.2rem] lg:left-[-2.2rem] lg:right-auto rounded-full overflow-hidden border-[5px] border-papier shadow-lg">
            <div className="relative w-full h-full">
              <ImagePlaceholder id={rondId} fill />
            </div>
          </div>
        )}
      </div>
      <div className={beeldLinks ? "lg:order-2" : "lg:order-1"}>{children}</div>
    </div>
  );
}
