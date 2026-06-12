import ImagePlaceholder from "./ImagePlaceholder";

// Sfeerband voor anders tekst-only secties: een full-bleed achtergrondbeeld dat
// de hele sectiebreedte vult (breekt uit de sectie-inner), met een zachte
// donkere overlay voor diepte en de tekst in een creme vlak eroverheen.
// De kop hoort in het vlak: geef `aanloop` (cursieve aanloopregel), `kop`
// (het statement) en `id` (anchor) mee in plaats van een losse H2 erboven.
export default function SfeerBand({
  beeldId,
  aanloop,
  kop,
  id,
  children,
}: {
  beeldId: string;
  aanloop?: string;
  kop?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen my-12 min-h-[26rem] flex items-center overflow-hidden">
      <ImagePlaceholder id={beeldId} fill />
      <div
        className="absolute inset-0 bg-gradient-to-r from-inkt/70 via-inkt/40 to-inkt/10"
        aria-hidden
      />
      <div className="relative w-full max-w-wide mx-auto px-6 py-12 sm:py-16">
        <div className="sfeerband-tekst bg-papier/95 backdrop-blur-sm rounded-sm p-6 sm:p-8 max-w-xl shadow-sm">
          {kop && (
            <h2 id={id} className="font-display mt-0 mb-4 text-2xl sm:text-3xl scroll-mt-24">
              {aanloop && (
                <span className="block font-normal italic text-[0.62em] mb-1">{aanloop}</span>
              )}
              {kop}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
