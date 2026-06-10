import Link from "next/link";

export type Crumb = { naam: string; href?: string };

// Kruimelpad boven de hero, gekoppeld aan het BreadcrumbList-schema
// dat de paginaroute rendert (zelfde databron).
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Kruimelpad" className="text-sm text-klei mb-5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0 m-0">
        {items.map((crumb, i) => (
          <li key={crumb.naam} className="flex items-center gap-x-2 list-none m-0 p-0">
            {i > 0 && <span aria-hidden>/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="no-underline hover:text-walnoot transition-colors">
                {crumb.naam}
              </Link>
            ) : (
              <span className="text-inkt/70">{crumb.naam}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
