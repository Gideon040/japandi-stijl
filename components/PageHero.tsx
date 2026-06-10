import ImagePlaceholder from "./ImagePlaceholder";

type Props = { titel: string; heroId?: string; children?: React.ReactNode };

// Splitst de titel Eijerkamp-stijl: deel voor de dubbele punt regular,
// de rest cursief op een nieuwe regel. Zonder dubbele punt: eerste woord.
function splitTitel(titel: string): [string, string] {
  const dubbelePunt = titel.indexOf(":");
  if (dubbelePunt > 0) {
    return [titel.slice(0, dubbelePunt).trim(), titel.slice(dubbelePunt + 1).trim()];
  }
  const spatie = titel.indexOf(" ");
  if (spatie > 0) return [titel.slice(0, spatie), titel.slice(spatie + 1)];
  return [titel, ""];
}

export default function PageHero({ titel, heroId, children }: Props) {
  const [eerste, rest] = splitTitel(titel);
  return (
    <section className="bg-zand">
      <div className="lg:grid lg:grid-cols-2">
        {heroId && (
          <div className="relative aspect-[16/10] lg:aspect-auto lg:order-2 lg:min-h-[26rem]">
            <ImagePlaceholder id={heroId} priority fill />
          </div>
        )}
        <div className="lg:order-1 flex items-center">
          <div className="w-full px-6 py-10 sm:py-14 lg:py-20 lg:pr-14 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] break-words">
              {eerste}
              {rest && (
                <>
                  <br />
                  <span className="italic">{rest}</span>
                </>
              )}
            </h1>
            {children && <div className="prose-japandi mt-6">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
