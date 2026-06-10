import Link from "next/link";

export type LinkLijstItem = { href: string; titel: string };

// Kolommenlijst met interne links (designreferentie): 1/2/3 kolommen,
// hairline onder elk item, pijl die meeschuift op hover.
export default function LinkLijst({ items }: { items: LinkLijstItem[] }) {
  return (
    <div className="sm:columns-2 lg:columns-3 gap-x-14 my-8">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-center justify-between gap-3 border-b border-lijn py-3 no-underline break-inside-avoid"
        >
          <span>{item.titel}</span>
          <span
            className="text-klei transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          >
            &#8594;
          </span>
        </Link>
      ))}
    </div>
  );
}
