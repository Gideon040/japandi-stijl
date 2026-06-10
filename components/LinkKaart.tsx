import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";

type Props = { href: string; titel: string; subtitel?: string; beeldId: string };

// Beeldkaart als interne link (designreferentie). In een .linkkaart-grid
// van 3 verspringt de middelste kaart automatisch.
export default function LinkKaart({ href, titel, subtitel, beeldId }: Props) {
  return (
    <Link
      href={href}
      className="group block bg-papier shadow-sm rounded-sm overflow-hidden no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md"
    >
      <ImagePlaceholder id={beeldId} inGrid />
      <span className="flex items-start justify-between gap-3 p-5">
        <span>
          <span className="font-display text-xl block leading-snug">{titel}</span>
          {subtitel && <span className="text-sm text-klei block mt-1">{subtitel}</span>}
        </span>
        <span
          className="text-klei transition-transform duration-200 group-hover:translate-x-1 mt-1"
          aria-hidden
        >
          &#8594;
        </span>
      </span>
    </Link>
  );
}
