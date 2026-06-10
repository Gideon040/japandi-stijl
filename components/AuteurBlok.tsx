// E-E-A-T blok onderaan elke pagina, naar het Eijerkamp "Marcel" voorbeeld:
// gecentreerd, smalle kolom, op een eigen zand-band.
export default function AuteurBlok() {
  return (
    <aside className="bg-zand border-t border-lijn">
      <div className="max-w-content mx-auto px-6 py-14 text-center">
        <p className="font-display text-2xl sm:text-3xl mb-4">Over japandi-stijl.nl</p>
        <p className="text-[15px] leading-relaxed text-inkt/90">
          Japandi-stijl.nl is een onafhankelijke gids over de Japandi interieurstijl.
          Wij verkopen zelf geen producten. Onze koopgidsen bevatten links naar Bol.com
          waarvoor wij een commissie kunnen ontvangen. Dat verandert niets aan onze
          selectie: producten die niet bij Japandi passen, raden wij gewoon af.
        </p>
      </div>
    </aside>
  );
}
