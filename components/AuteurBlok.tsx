// E-E-A-T blok onderaan elke pagina: gecentreerd op een eigen zand-band,
// met het ronde "js"-stempel uit de designreferentie.
export default function AuteurBlok() {
  return (
    <aside className="bg-zand border-t border-lijn">
      <div className="max-w-content mx-auto px-6 py-14 text-center">
        <div
          className="w-[3.4rem] h-[3.4rem] mx-auto mb-5 rounded-full border border-klei flex items-center justify-center font-display italic text-walnoot text-xl"
          aria-hidden
        >
          js
        </div>
        <p className="font-display text-2xl sm:text-3xl mb-4">Over japandi-stijl.nl</p>
        <p className="text-[15px] leading-relaxed text-inkt/90">
          Japandi-stijl.nl is een onafhankelijke gids over de Japandi interieurstijl.
          Wij verkopen zelf geen producten. Onze koopgidsen bevatten affiliate links
          waarvoor wij een commissie kunnen ontvangen. Dat verandert niets aan onze
          selectie: producten die niet bij Japandi passen, raden wij gewoon af.
        </p>
      </div>
    </aside>
  );
}
