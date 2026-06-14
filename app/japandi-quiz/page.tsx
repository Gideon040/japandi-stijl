import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import AuteurBlok from "@/components/AuteurBlok";
import JsonLd from "@/components/JsonLd";
import Quiz from "@/components/Quiz";
import QuizUitleg from "@/components/QuizUitleg";
import FAQ from "@/components/FAQ";
import { identiteitGraph, ogBeeld, SITE_URL, SITE_NAAM } from "@/lib/seo";

const QUIZ_FAQ = [
  {
    vraag: "Welke Japandi-stijlen zijn er?",
    antwoord:
      "Binnen Japandi onderscheiden we drie richtingen: Licht en Scandi (licht eiken, linnen en gebroken wit, veel daglicht), Warm en Walnoot (donker walnoot of teak, leer in cognac en een terracotta accent) en Wabi-sabi en mineraal (matte steenlook, ongeglazuurd keramiek en jute in zand en greige). De stijltest bepaalt op basis van tien vragen welke het best bij je past.",
  },
  {
    vraag: "Hoe weet ik welke Japandi-stijl bij mij past?",
    antwoord:
      "Kijk eerst naar de houttint en kleur die je aantrekt. Houd je van licht en open, dan zit je bij Licht en Scandi. Wil je diepte en warmte met donker hout en leer, dan past Warm en Walnoot. Val je op ruwe, natuurlijke materialen als steenlook en keramiek, dan is Wabi-sabi en mineraal jouw richting. De stijltest weegt hout, muurkleur, bank, accent, vloer en sfeer mee en geeft een onderbouwd profiel.",
  },
  {
    vraag: "Welke kleuren passen bij de warme, walnoot-variant van Japandi?",
    antwoord:
      "Bij de warme Japandi-richting werk je met walnoot als basis, zand en creme als rustige tinten, warm bruin als tussentint en een enkel terracotta accent. Koel blauwgrijs, chroom en hoogglans vermijd je, want die halen de warmte uit het palet. Een accent is genoeg: een terracotta kussen of een aardewerk vaas.",
  },
];

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
      <QuizUitleg />
      <section className="bg-zand-diep">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <FAQ beeldId="japandi-quiz-faq" items={QUIZ_FAQ} />
        </div>
      </section>
      <AuteurBlok />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
    </article>
  );
}
