type Item = {
  staal: string; // CSS-kleur of gradient voor de materiaalstaal
  naam: string;
  subtitel?: string;
  prijs?: string; // prijsindicatie, bijv. "vanaf 150 euro"
  opmerking: string; // let-op of korte typering
};

type Props = { items: Item[]; caption?: string };

// Editoriale rijenlijst voor materiaal- of kleurvergelijkingen
// (designreferentie): dikke lijn boven, gekleurde staal, naam groot,
// prijsindicatie in walnoot, opmerking cursief. In MDX ook bruikbaar
// als <KleurenKaart /> voor kleurpaletten.
export default function MateriaalKaart({ items, caption }: Props) {
  return (
    <div className="max-w-[54rem] my-10 border-t-2 border-inkt">
      {items.map((item) => (
        <div
          key={item.naam}
          className="grid grid-cols-[3.4rem_1fr] sm:grid-cols-[3.4rem_1.3fr_1fr_1.6fr] gap-x-5 gap-y-1 items-center border-b border-lijn py-5"
        >
          <span
            className="w-[3.4rem] h-[3.4rem] rounded-sm row-span-2 sm:row-span-1"
            style={{ background: item.staal }}
            aria-hidden
          />
          <span>
            <span className="font-display text-xl block leading-snug">{item.naam}</span>
            {item.subtitel && <span className="text-sm text-klei block">{item.subtitel}</span>}
          </span>
          <span className="text-walnoot font-medium text-sm col-start-2 sm:col-start-3">
            {item.prijs}
          </span>
          <span className="italic text-sm text-inkt/80 col-start-2 sm:col-start-4">
            {item.opmerking}
          </span>
        </div>
      ))}
      {caption && <p className="italic text-sm text-klei text-right mt-3 mb-0">{caption}</p>}
    </div>
  );
}
