type Item = { vraag: string; antwoord: string };

// Rendert zelf de H2 "Veelgestelde vragen" plus het FAQPage-schema.
// MDX-pagina's mogen dus GEEN eigen FAQ-heading bevatten.
export default function FAQ({ items }: { items: Item[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.vraag,
      acceptedAnswer: { "@type": "Answer", text: i.antwoord },
    })),
  };
  return (
    <div className="max-w-content">
      <h2 className="font-display text-3xl sm:text-4xl mb-8 mt-0 scroll-mt-24" id="veelgestelde-vragen">
        Veelgestelde vragen
      </h2>
      {items.map((i) => (
        <details key={i.vraag} className="border-b border-lijn py-4 group">
          <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
            {i.vraag}
            <span className="text-klei group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-3 mb-0 leading-relaxed text-inkt/90">{i.antwoord}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
