import Link from "next/link";
import { getAllPages } from "@/lib/content";

export default function Home() {
  const pages = getAllPages();
  return (
    <div className="max-w-wide mx-auto px-6 py-16">
      <h1 className="font-display text-5xl max-w-2xl leading-tight">
        Japandi. Minimalisme met warmte.
      </h1>
      <p className="mt-6 max-w-content text-lg leading-relaxed">
        Onafhankelijke gids over de Japandi interieurstijl: wat het is, hoe je het
        toepast per ruimte, en eerlijke koopgidsen per meubelcategorie.
      </p>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 max-w-3xl">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link href={`/${p.slug}/`} className="block border border-lijn rounded-sm px-5 py-4 hover:bg-zand transition-colors">
              <span className="font-medium">{p.titel}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
