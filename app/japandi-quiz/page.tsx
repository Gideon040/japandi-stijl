import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import AuteurBlok from "@/components/AuteurBlok";
import JsonLd from "@/components/JsonLd";
import Quiz from "@/components/Quiz";
import { identiteitGraph, ogBeeld, SITE_URL, SITE_NAAM } from "@/lib/seo";

const TITEL = "Japandi stijltest: welke Japandi stijl past bij jou?";
const BESCHRIJVING =
  "Doe de Japandi stijltest: tien vragen over hout, kleur en materiaal leiden naar jouw profiel, met passende texturen, een kleurenpalet, materialen om te vermijden en een koopgids-shortlist per ruimte.";

export const metadata: Metadata = {
  title: { absolute: TITEL },
  description: BESCHRIJVING,
  alternates: { canonical: "/japandi-quiz/" },
  openGraph: {
    type: "website",
    title: TITEL,
    description: BESCHRIJVING,
    url: "/japandi-quiz/",
    siteName: SITE_NAAM,
    images: [{ url: ogBeeld("japandi-quiz") }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHRIJVING },
};

export default function QuizPage() {
  const crumbs: Crumb[] = [{ naam: "Home", href: "/" }, { naam: "Stijltest" }];
  const url = `${SITE_URL}/japandi-quiz/`;

  const graph: object[] = [
    ...identiteitGraph(),
    {
      "@type": "WebPage",
      "@id": `${url}#pagina`,
      name: TITEL,
      description: BESCHRIJVING,
      url,
      inLanguage: "nl-NL",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.naam,
        item: `${SITE_URL}${c.href ?? "/japandi-quiz/"}`,
      })),
    },
  ];

  return (
    <article>
      <PageHero titel={TITEL} heroId="japandi-quiz-hero" breadcrumb={<Breadcrumb items={crumbs} />}>
        <p>
          Welke kant van Japandi past bij jou? Beantwoord tien korte vragen over hout, kleur en
          materiaal. Je krijgt een profiel met passende texturen, een kleurenpalet, de materialen die
          we zouden vermijden en concrete koopgidsen voor de ruimtes die je inricht.
        </p>
      </PageHero>
      <div className="max-w-wide mx-auto px-6 py-14 sm:py-20">
        <Suspense fallback={<p className="text-klei">De stijltest laden...</p>}>
          <Quiz />
        </Suspense>
      </div>
      <AuteurBlok />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
    </article>
  );
}
