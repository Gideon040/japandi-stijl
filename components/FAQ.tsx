import ImagePlaceholder from "./ImagePlaceholder";

type Item = { vraag: string; antwoord: string };
type Props = { items: Item[]; beeldId?: string };

// FAQ-band naar de designreferentie: sfeerbeeld links, accordeon rechts.
// Rendert zelf de H2 "Veelgestelde vragen" plus het FAQPage-schema.
// MDX-pagina's mogen dus GEEN eigen FAQ-heading bevatten.
// beeldId-conventie: {slug}-faq.
export default function FAQ({ items, beeldId }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.vraag,
      acceptedAnswer: { "@type": "Answer", text: i.antwoord },
    })),
  };
  const accordeon = (
    <div>
      <h2
        className="font-display text-3xl sm:text-4xl mb-8 mt-0 scroll-mt-24"
        id="veelgestelde-vragen"
      >
        Veelgestelde vragen
      </h2>
      {items.map((i) => (
        <details key={i.vraag} className="border-b border-lijn py-4 group">
          <summary className="cursor-pointer font-display text-[1.08rem] list-none flex justify-between items-center gap-4 [&::-webkit-details-marker]:hidden">
            {i.vraag}
            <span className="text-klei group-open:rotate-45 transition-transform shrink-0" aria-hidden>
              +
            </span>
          </summary>
          <p className="mt-3 mb-0 leading-relaxed text-inkt/90 max-w-content">{i.antwoord}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
  if (!beeldId) return <div className="max-w-content">{accordeon}</div>;
  return (
    <div className="grid gap-10 lg:gap-[4.5rem] lg:grid-cols-[5fr_6fr] items-start">
      <div className="hidden lg:block">
        <ImagePlaceholder id={beeldId} inGrid />
      </div>
      {accordeon}
    </div>
  );
}
