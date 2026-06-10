import ImagePlaceholder from "./ImagePlaceholder";

export type Kerncijfer = { waarde: string; label: string };

type Props = {
  titel: string;
  heroId?: string;
  kerncijfers?: Kerncijfer[];
  breadcrumb?: React.ReactNode;
  children?: React.ReactNode;
};

// Splitst de titel naar het koppatroon uit de designreferentie: het deel
// voor de dubbele punt wordt de italic aanloopregel, de rest het romeinse
// statement. Zonder dubbele punt: geen aanloop.
function splitTitel(titel: string): [string, string] {
  const dubbelePunt = titel.indexOf(":");
  if (dubbelePunt > 0) {
    return [titel.slice(0, dubbelePunt).trim(), titel.slice(dubbelePunt + 1).trim()];
  }
  return ["", titel];
}

export default function PageHero({ titel, heroId, kerncijfers, breadcrumb, children }: Props) {
  const [aanloop, statement] = splitTitel(titel);
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
            <div className="max-w-[32rem]">
              {breadcrumb}
              <h1 className="kop font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] break-words">
                {aanloop && <em>{aanloop}</em>}
                {statement}
              </h1>
              {children && <div className="prose-japandi mt-6">{children}</div>}
              {kerncijfers && kerncijfers.length > 0 && (
                <div className="flex flex-wrap gap-8 mt-9 text-[0.82rem] text-klei">
                  {kerncijfers.map((k) => (
                    <div key={k.label}>
                      <b className="block font-display text-xl text-inkt font-medium">{k.waarde}</b>
                      {k.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
