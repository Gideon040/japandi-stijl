import Link from "next/link";
import PageHero from "@/components/PageHero";
import LinkKaart from "@/components/LinkKaart";
import LinkLijst from "@/components/LinkLijst";
import SplitSectie from "@/components/SplitSectie";
import AuteurBlok from "@/components/AuteurBlok";
import { getAllPages, type PageMeta } from "@/lib/content";
import { getGepubliceerdeGidsen } from "@/lib/koopgidsen";

const TEMPLATE_LABEL: Record<PageMeta["template"], string> = {
  pillar: "uitleg",
  gids: "gids",
  koopgids: "koopgids",
  longtail: "gids",
};

const RUIMTES = [
  { href: "/japandi-woonkamer/", titel: "Woonkamer", subtitel: "de basis van de stijl", beeldId: "home-ruimte-woonkamer" },
  { href: "/japandi-slaapkamer/", titel: "Slaapkamer", subtitel: "slapen in eenvoud", beeldId: "home-ruimte-slaapkamer" },
  { href: "/japandi-keuken/", titel: "Keuken", subtitel: "warm en opgeruimd", beeldId: "home-ruimte-keuken" },
];

const WERKWIJZE = [
  {
    nr: "i.",
    titel: "Stijl eerst",
    tekst: "Materiaal, vorm en kleur bepalen of een product in de selectie komt. Bestsellerstatus niet.",
  },
  {
    nr: "ii.",
    titel: "Minstens een nadeel",
    tekst: "Elk product krijgt naast de voordelen ook een eerlijke kanttekening uit specs en reviews.",
  },
  {
    nr: "iii.",
    titel: "Afraders benoemen we",
    tekst: "Populaire producten die niet bij Japandi passen of slecht scoren, noemen we bij naam. Zonder link.",
  },
];

function subtitelVoor(p: PageMeta): string {
  const label = TEMPLATE_LABEL[p.template];
  const cijfer = p.kerncijfers?.[0];
  return cijfer ? `${label} · ${cijfer.waarde} ${cijfer.label}` : label;
}

export default function Home() {
  const koopgidsen = getGepubliceerdeGidsen("koopgids");
  const nieuwste = getAllPages()
    .filter((p) => p.datum)
    .sort((a, b) => (b.datum ?? "").localeCompare(a.datum ?? ""))
    .slice(0, 3);

  return (
    <div>
      <PageHero titel="japandi-stijl.nl: De eerlijke gids voor Japandi wonen" heroId="home-hero">
        <p>
          Japandi combineert Japanse eenvoud met Scandinavische warmte. Wij leggen uit hoe de
          stijl werkt, per ruimte en per meubel, en selecteren de producten die het echt waard
          zijn, ongeacht de winkel. Onafhankelijk: we verkopen zelf niets en benoemen bij elk
          product minstens een nadeel.
        </p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-7">
          <Link href="/japandi-stijl/" className="knop-pill bg-inkt hover:bg-walnoot">
            Begin bij: wat is Japandi
          </Link>
          <a
            href="#koopgidsen"
            className="no-underline border-b border-klei pb-0.5 text-sm hover:text-walnoot transition-colors"
          >
            Direct naar de koopgidsen
          </a>
        </div>
      </PageHero>

      <section>
        <div className="max-w-wide mx-auto px-6 pt-16 sm:pt-20">
          <h2 className="kop font-display text-3xl sm:text-4xl">
            <em>Per ruimte</em>Begin waar jij woont
          </h2>
          <p className="mt-5 max-w-content text-[17px] leading-relaxed">
            Elke ruimte heeft een eigen gids: het kleurpalet, de meubelvolgorde en de valkuilen
            die je wilt vermijden.
          </p>
          <div className="linkkaart-grid">
            {RUIMTES.map((r) => (
              <LinkKaart key={r.href} {...r} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zand mt-16 scroll-mt-16" id="koopgidsen">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <h2 className="kop font-display text-3xl sm:text-4xl">
            <em>Per meubel</em>Alle koopgidsen
          </h2>
          <p className="mt-5 max-w-content text-[17px] leading-relaxed">
            Per categorie: wat het Japandi maakt, waar je op let en welke producten het waard
            zijn. Inclusief wat we zouden laten staan.
          </p>
          <LinkLijst items={koopgidsen} />
        </div>
      </section>

      <section>
        <div className="max-w-wide mx-auto px-6 pt-6">
          <SplitSectie beeldId="home-werkwijze">
            <h2 className="kop font-display text-3xl sm:text-4xl">
              <em>Onze werkwijze</em>Waarom je op deze gidsen kunt bouwen
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed">
              De meeste koopgidsen op internet zetten tien bestsellers onder elkaar en plakken er
              links bij. Wij doen het andersom: eerst bepalen wat een meubel Japandi maakt, dan
              pas zoeken wat daaraan voldoet.
            </p>
            <div className="mt-9 space-y-8 max-w-[34rem]">
              {WERKWIJZE.map((stap) => (
                <div key={stap.nr}>
                  <span className="font-display italic text-klei text-[1.6rem] leading-none block">
                    {stap.nr}
                  </span>
                  <h3 className="font-display text-2xl mt-1">{stap.titel}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed">{stap.tekst}</p>
                </div>
              ))}
            </div>
          </SplitSectie>
        </div>
      </section>

      {nieuwste.length > 0 && (
        <section className="bg-zand-diep mt-16">
          <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
            <h2 className="kop font-display text-3xl sm:text-4xl">
              <em>Net verschenen</em>Nieuwste gidsen
            </h2>
            <div className="linkkaart-grid">
              {nieuwste.map((p) => (
                <LinkKaart
                  key={p.slug}
                  href={`/${p.slug}/`}
                  titel={p.titel.split(":")[0].trim()}
                  subtitel={subtitelVoor(p)}
                  beeldId={`${p.slug}-hero`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <AuteurBlok />
    </div>
  );
}
