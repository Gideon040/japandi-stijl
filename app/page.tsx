import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Collage from "@/components/Collage";
import SplitSectie from "@/components/SplitSectie";
import MateriaalKaart from "@/components/MateriaalKaart";
import FAQ from "@/components/FAQ";
import LinkKaart from "@/components/LinkKaart";
import LinkLijst from "@/components/LinkLijst";
import AuteurBlok from "@/components/AuteurBlok";
import { getAllPages, type PageMeta } from "@/lib/content";
import { getGepubliceerdeGidsen } from "@/lib/koopgidsen";
import JsonLd from "@/components/JsonLd";
import { homepageSchema, ogBeeld } from "@/lib/seo";

const HOME_TITEL = "Japandi stijl: wat het is, kenmerken, kleuren en hoe je het toepast";
const HOME_BESCHRIJVING =
  "Wat is Japandi stijl? De oorsprong, kenmerken, kleuren en materialen op een rij, met concrete regels, het verschil met Scandinavisch en wabi-sabi, en voor wie de stijl wel en niet werkt.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITEL },
  description: HOME_BESCHRIJVING,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: HOME_TITEL,
    description: HOME_BESCHRIJVING,
    url: "/",
    images: [{ url: ogBeeld() }],
  },
  twitter: { card: "summary_large_image", title: HOME_TITEL, description: HOME_BESCHRIJVING },
};

const TEMPLATE_LABEL: Record<PageMeta["template"], string> = {
  pillar: "uitleg",
  gids: "gids",
  koopgids: "koopgids",
  longtail: "gids",
};

const RUIMTES = [
  { href: "/japandi-woonkamer/", titel: "Woonkamer", subtitel: "de basis van de stijl", beeldId: "home-ruimte-woonkamer" },
  { href: "/japandi-slaapkamer/", titel: "Slaapkamer", subtitel: "slapen in eenvoud", beeldId: "home-ruimte-slaapkamer" },
  { href: "/japandi-eetkamer/", titel: "Eetkamer", subtitel: "lage lijn, warm hout", beeldId: "home-ruimte-eetkamer" },
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

const KERNCIJFERS = [
  { waarde: "2 tradities", label: "Japan en Scandinavië" },
  { waarde: "80/20", label: "neutraal palet tegenover accent" },
  { waarde: "max 2", label: "houtsoorten per ruimte" },
];

function subtitelVoor(p: PageMeta): string {
  const label = TEMPLATE_LABEL[p.template];
  const cijfer = p.kerncijfers?.[0];
  return cijfer ? `${label} · ${cijfer.waarde} ${cijfer.label}` : label;
}

function Kop({ aanloop, children }: { aanloop: string; children: React.ReactNode }) {
  return (
    <h2 className="kop font-display text-3xl sm:text-4xl">
      <em>{aanloop}</em>
      {children}
    </h2>
  );
}

export default function Home() {
  const koopgidsen = getGepubliceerdeGidsen("koopgids");
  const nieuwste = getAllPages()
    .filter((p) => p.datum)
    .sort((a, b) => (b.datum ?? "").localeCompare(a.datum ?? ""))
    .slice(0, 3);

  return (
    <div>
      <JsonLd data={{ "@context": "https://schema.org", ...homepageSchema(HOME_TITEL, HOME_BESCHRIJVING) }} />
      <PageHero
        titel="Japandi stijl: minimalisme met warmte"
        heroId="home-hero"
        kerncijfers={KERNCIJFERS}
      >
        <p>
          Japandi is een interieurstijl die het Japanse minimalisme en de wabi-sabi-waardering
          voor imperfectie combineert met de warmte en functionaliteit van Scandinavisch design.
          Kenmerkend zijn natuurlijke materialen, een neutraal palet met warme houttinten als
          walnoot en eiken, een matte steenlook, strakke en organische vormen, en veel rust en
          ademruimte.
        </p>
      </PageHero>

      <section id="definitie" className="scroll-mt-20">
        <div className="max-w-wide mx-auto px-6 pt-16 sm:pt-20">
          <Kop aanloop="De definitie">Wat is de Japandi stijl?</Kop>
          <div className="prose-japandi mt-6 max-w-content space-y-5">
            <p>
              Japandi voegt twee ontwerptradities samen die in de kern hetzelfde geloven: minder,
              maar beter. Uit Japan komt wabi-sabi, de waardering voor eenvoud, vergankelijkheid en
              imperfectie. Uit Scandinavië komt de huiselijke warmte die mensen daar hygge noemen.
              Samen leveren ze een interieur op met natuurlijke materialen, een neutraal palet en
              meubels met een strakke maar zachte vormgeving.
            </p>
            <p>
              Je herkent de stijl aan een paar terugkerende keuzes: licht hout naast een donker,
              aards accent, keramiek en linnen die hun textuur tonen, lage en horizontale meubels,
              en lege ruimte die bewust leeg blijft. Het verschil met puur minimalisme is de
              warmte, het verschil met de Scandinavische stijl is de soberheid en de donkerdere
              houttinten.
            </p>
          </div>
          <Collage ids={["home-collage-1", "home-collage-2", "home-collage-3"]} />
        </div>
      </section>

      <section className="bg-zand">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="De oorsprong">Waar komt Japandi vandaan?</Kop>
          <div className="prose-japandi mt-6 max-w-content space-y-5">
            <p>
              De stijl is nieuw van naam, maar oud van wortels. De term Japandi, een samentrekking
              van Japan en Scandi, kwam pas rond het midden van de jaren 2010 op. De band tussen
              het Japanse en het Scandinavische ontwerp is veel ouder: Scandinavische ontwerpers
              uit het midden van de twintigste eeuw keken naar de Aziatische ambachtstraditie. Het
              bekendste voorbeeld is de Wishbone Chair van de Deen Hans Wegner uit 1949, die hij
              baseerde op stoelen uit de Chinese Ming-dynastie. Beide werelden deelden dezelfde
              uitgangspunten: respect voor het materiaal, functie boven versiering, en de
              overtuiging dat alledaagse voorwerpen mooi mogen zijn.
            </p>
            <p>
              De Japanse kant brengt het begrip wabi-sabi mee, en daar bestaat een hardnekkig
              misverstand over. Wabi-sabi is geen sfeerwoord voor &quot;rommelig natuurlijk&quot;.
              Het zijn oorspronkelijk twee losse begrippen: <em>wabi</em> staat voor ingetogen,
              sobere schoonheid, <em>sabi</em> voor de schoonheid van veroudering en patina.
              Samengevoegd beschrijven ze het waarderen van het onvolmaakte en vergankelijke, een
              idee dat teruggaat op de boeddhistische blik op vergankelijkheid (zie{" "}
              <a
                href="https://en.wikipedia.org/wiki/Wabi-sabi"
                rel="nofollow noopener"
                target="_blank"
                className="inline-link"
              >
                de toelichting bij Wikipedia
              </a>
              ). In een interieur betekent dat een keramieken vaas met een onregelmatige rand of
              een matte steenlook met natuurlijke oneffenheden, niet een goedkope imitatie die
              alleen de kleur nadoet. Het precieze{" "}
              <Link href="/japandi-vs-wabi-sabi/" className="inline-link">
                verschil tussen Japandi en wabi-sabi
              </Link>{" "}
              staat in een aparte gids.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="De kenmerken">Waaraan herken je Japandi?</Kop>
          <SplitSectie beeldId="home-sectie-1" rondId="home-rond">
            <div className="prose-japandi space-y-5">
              <p>
                Japandi laat zich vastpinnen op een paar concrete regels, en juist die maken het
                verschil tussen &quot;klopt&quot; en &quot;bijna&quot;. Houd de meubellijn laag en
                horizontaal: een bank rond 70 tot 75 centimeter hoog, een salontafel van 35 tot 40
                centimeter, en kasten die zo veel mogelijk onder de raamhoogte blijven. Werk met
                een verhouding van ongeveer 80 om 20: vier vijfde van de kamer is neutraal, een
                vijfde mag een aards accent zijn. Beperk je tot maximaal twee houtsoorten per
                ruimte, anders wordt het onrustig.
              </p>
              <p>
                En durf leeg te laten. De ruimte tussen de meubels is net zo belangrijk als de
                meubels zelf: die ademruimte geeft het oog rust en is precies wat de stijl
                onderscheidt van een kamer die alleen maar &quot;netjes&quot; is. Elk voorwerp dat
                geen functie heeft en geen schoonheid toevoegt, mag de kamer uit.
              </p>
            </div>
          </SplitSectie>
          <p className="prose-japandi max-w-content mt-2">
            Bij de warme kant van het palet is er de laatste jaren iets verschoven. Waar Japandi
            lang vooral met licht eiken en bamboe werd getoond, zie je nu in interieurvideo&apos;s
            op TikTok en Instagram vooral de combinatie van warm walnoothout met beige, linnen en
            een streep rotan voorbijkomen. Die warmere, donkerdere richting is een volwaardige
            Japandi-keuze, niet minder &quot;echt&quot; dan het lichte eiken. Walnoot naast zand en
            creme geeft een kamer diepte zonder de rust te breken.
          </p>
        </div>
      </section>

      <section className="bg-zand-diep">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="De materialen">Waar is Japandi van gemaakt?</Kop>
          <p className="prose-japandi mt-6 max-w-content">
            Massief hout draagt de stijl, met daaromheen een vaste familie van natuurlijke
            materialen. Wat je niet ziet is net zo bepalend: hoogglans, chroom, grote glasvlakken
            en kunststof dat hout of steen nadoet horen er niet bij.
          </p>
          <MateriaalKaart
            caption="De materialen die een interieur Japandi maken"
            items={[
              {
                staal: "linear-gradient(135deg,#D7B98C,#BE9C68)",
                naam: "Eiken en essen",
                subtitel: "de lichte basis",
                prijs: "midden tot hoog",
                opmerking: "licht en rustig van nerf, de Scandinavische kant van de stijl",
              },
              {
                staal: "linear-gradient(135deg,#9E7A4F,#5C4633)",
                naam: "Walnoot",
                subtitel: "warmte en diepte",
                prijs: "hoog",
                opmerking: "donkerder en warmer, nu de meest gevraagde houttint",
              },
              {
                staal: "linear-gradient(135deg,#E9DBB8,#D2BE8E)",
                naam: "Bamboe en rotan",
                subtitel: "lichte vlechtmaterialen",
                prijs: "laag tot midden",
                opmerking: "brengen textuur en lucht, mooi als deur- of lampmateriaal",
              },
              {
                staal: "#E5DCCC",
                naam: "Linnen en wol",
                subtitel: "textiel",
                prijs: "midden",
                opmerking: "mogen kreuken en leven, dat hoort bij de natuurlijke uitstraling",
              },
              {
                staal: "#CFC3B0",
                naam: "Keramiek en matte steenlook",
                subtitel: "wabi-sabi",
                prijs: "laag tot midden",
                opmerking: "onregelmatige, minerale vormen in gebroken wit en zand, mat afgewerkt",
              },
              {
                staal: "linear-gradient(135deg,#D8D8DA,#B8B8BC)",
                naam: "Hoogglans, chroom, kunststof",
                subtitel: "vermijden",
                opmerking: "koud en hard, en imitatiehout of -steen mist de diepte van het echte",
              },
            ]}
          />
        </div>
      </section>

      <section>
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="De kleuren">Welke kleuren passen bij Japandi?</Kop>
          <p className="prose-japandi mt-6 max-w-content">
            Het palet blijft binnen aardetinten, opgebouwd in lagen van licht naar warm. De muren
            zijn de lichtste laag, vloer en textiel zitten daar een tint onder, en het hout brengt
            de warmte. Eén accent is genoeg: een terracotta kussen of een olijfgroene plant, daarna
            stop je. Koel of blauwgrijs werkt tegen de stijl in. De{" "}
            <Link href="/japandi-kleuren/" className="inline-link">
              gids over Japandi kleuren
            </Link>{" "}
            gaat dieper in op de 60-30-10-verdeling, ondertonen en concrete RAL- en verfkleuren.
          </p>
          <MateriaalKaart
            caption="Het kleurpalet van de Japandi stijl"
            items={[
              {
                staal: "#F4EFE6",
                naam: "Gebroken wit",
                subtitel: "muren en plafond",
                opmerking: "warmer dan zuiver wit, dat snel klinisch oogt",
              },
              {
                staal: "#E4D7C0",
                naam: "Zand, creme en greige",
                subtitel: "textiel en vloer",
                opmerking: "een tint onder de muur, zodat de ruimte zich aardt",
              },
              {
                staal: "linear-gradient(135deg,#9E7A4F,#6F4E2E)",
                naam: "Walnoot en eiken",
                subtitel: "het hout",
                opmerking: "walnoot voor warmte, eiken voor licht, samen de verbindende tint",
              },
              {
                staal: "#B9AFA0",
                naam: "Warm grijs",
                subtitel: "rustige tussentint",
                opmerking: "altijd met een beige ondertoon, nooit blauwgrijs",
              },
              {
                staal: "#A64D39",
                naam: "Terracotta of olijfgroen",
                subtitel: "het enige accent",
                opmerking: "in kleine dosis, een kussen of een plant",
              },
              {
                staal: "#7C8A9A",
                naam: "Koel blauwgrijs en fel",
                subtitel: "vermijden",
                opmerking: "breekt de warmte en haalt de rust uit het palet",
              },
            ]}
          />
        </div>
      </section>

      <section id="per-ruimte" className="bg-zand scroll-mt-20">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="Per ruimte">Japandi toepassen in jouw huis</Kop>
          <p className="prose-japandi mt-6 max-w-content">
            Elke ruimte heeft zijn eigen aandachtspunten. Hieronder per kamer kort wat de stijl er
            doet en waar je verder leest; de koopgidsen behandelen de meubels per categorie.
          </p>
          <div className="linkkaart-grid">
            {RUIMTES.map((r) => (
              <LinkKaart key={r.beeldId} {...r} />
            ))}
          </div>

          <div className="mt-14 space-y-10 max-w-content">
            <div>
              <h3 className="font-display text-2xl">Woonkamer</h3>
              <p className="prose-japandi mt-3">
                De woonkamer is waar de stijl het duidelijkst leesbaar wordt: een lage, horizontale
                meubellijn, een{" "}
                <Link href="/japandi-bank/" className="inline-link">
                  bank
                </Link>{" "}
                als middelpunt en een{" "}
                <Link href="/japandi-vloerkleed/" className="inline-link">
                  vloerkleed
                </Link>{" "}
                dat de zithoek verankert. Houd het bij vijf tot zeven meubels. Lees de volledige
                aanpak in de{" "}
                <Link href="/japandi-woonkamer/" className="inline-link">
                  gids voor de Japandi woonkamer
                </Link>
                , en kies de stukken in de koopgidsen voor{" "}
                <Link href="/japandi-fauteuil/" className="inline-link">
                  fauteuils
                </Link>
                ,{" "}
                <Link href="/japandi-dressoir/" className="inline-link">
                  dressoirs
                </Link>
                ,{" "}
                <Link href="/japandi-kast/" className="inline-link">
                  kasten
                </Link>{" "}
                en{" "}
                <Link href="/japandi-spiegel/" className="inline-link">
                  spiegels
                </Link>{" "}
                ,{" "}
                <Link href="/japandi-tv-meubel/" className="inline-link">
                  tv-meubels
                </Link>{" "}
                en een{" "}
                <Link href="/japandi-schilderij/" className="inline-link">
                  schilderij
                </Link>{" "}
                aan de muur.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl">Slaapkamer</h3>
              <p className="prose-japandi mt-3">
                In de slaapkamer draait het om rust: een laag houten bed, linnen beddengoed in
                zandtinten en warm, gedempt licht. Hoe je dat opbouwt staat in de{" "}
                <Link href="/japandi-slaapkamer/" className="inline-link">
                  gids voor de Japandi slaapkamer
                </Link>
                . Voor de inrichting zijn de koopgidsen voor{" "}
                <Link href="/japandi-bed/" className="inline-link">
                  bedden
                </Link>
                ,{" "}
                <Link href="/japandi-nachtkastje/" className="inline-link">
                  nachtkastjes
                </Link>{" "}
                en{" "}
                <Link href="/japandi-kast/" className="inline-link">
                  kledingkasten
                </Link>{" "}
                het startpunt.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl">Keuken</h3>
              <p className="prose-japandi mt-3">
                Een Japandi keuken is warm en opgeruimd: greeploze of houten fronten, een aanrecht
                dat leeg blijft, en natuurlijk materiaal boven hoogglans. Het werkblad in hout of
                een matte steenlook maakt het verschil. De{" "}
                <Link href="/japandi-keuken/" className="inline-link">
                  gids voor de Japandi keuken
                </Link>{" "}
                behandelt materialen, kleuren en de maten voor een kookeiland.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl">Badkamer</h3>
              <p className="prose-japandi mt-3">
                In de badkamer komt de wabi-sabi-kant het sterkst tot zijn recht: matte steenlook,
                hout dat tegen vocht kan zoals teak of bamboe, en gedekte tinten in plaats van wit
                hoogglans. De{" "}
                <Link href="/japandi-badkamer/" className="inline-link">
                  Japandi badkamer-gids
                </Link>{" "}
                gaat dieper in op materialen en kleuren. Een ronde{" "}
                <Link href="/japandi-spiegel/" className="inline-link">
                  spiegel
                </Link>{" "}
                en warme, vochtbestendige{" "}
                <Link href="/japandi-plafondlamp/" className="inline-link">
                  verlichting
                </Link>{" "}
                zetten de toon.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl">Eetkamer</h3>
              <p className="prose-japandi mt-3">
                De eetkamer leeft van één goede{" "}
                <Link href="/japandi-eettafel/" className="inline-link">
                  massief houten eettafel
                </Link>{" "}
                met rustige{" "}
                <Link href="/japandi-eetkamerstoel/" className="inline-link">
                  eetkamerstoelen
                </Link>{" "}
                eromheen, en hooguit een lage{" "}
                <Link href="/japandi-vaas/" className="inline-link">
                  vaas
                </Link>{" "}
                of een{" "}
                <Link href="/japandi-bloempot/" className="inline-link">
                  plant
                </Link>{" "}
                op het blad. Een{" "}
                <Link href="/japandi-dressoir/" className="inline-link">
                  dressoir
                </Link>{" "}
                tegen de wand houdt servies uit het zicht en de lijn laag. De{" "}
                <Link href="/japandi-eetkamer/" className="inline-link">
                  gids voor de Japandi eetkamer
                </Link>{" "}
                behandelt de maten, het licht en de aankleding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="koopgidsen" className="scroll-mt-16">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="Per meubel">Alle koopgidsen</Kop>
          <p className="prose-japandi mt-6 max-w-content">
            Per categorie: wat het Japandi maakt, waar je op let en welke producten het waard zijn.
            Inclusief wat we zouden laten staan.
          </p>
          <LinkLijst items={koopgidsen} />
        </div>
      </section>

      <section className="bg-zand">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="Voor wie">Werkt Japandi voor iedereen?</Kop>
          <div className="prose-japandi mt-6 max-w-content space-y-5">
            <p>
              Eerlijk: nee. Japandi is een stijl van weglaten, en dat past niet bij elk huishouden
              of elke ruimte. Het is goed om dat vooraf te weten, zodat je niet halverwege
              vastloopt.
            </p>
            <p>
              De stijl werkt het best als je van opgeruimd houdt en bereid bent spullen weg te doen
              of uit het zicht op te bergen. Een gezin met veel speelgoed, een verzamelaar of
              iemand die graag veel om zich heen heeft, vecht tegen het uitgangspunt van de stijl.
              Dat kan, maar dan heb je veel gesloten opbergruimte nodig. Ook vraagt het palet
              onderhoud: licht linnen en onbehandeld of licht geolied hout laten vlekken sneller
              zien dan een donkere, gelakte kast.
            </p>
            <p>
              Twijfel je over de ruimte zelf, dan helpt het te weten dat een kleine kamer juist
              baat heeft bij de lage meubellijn en het lichte palet, terwijl een donkere ruimte
              vraagt om extra warm licht en de warmere walnoottinten in plaats van koel grijs. Vind
              je minimalisme te kil en de Scandinavische stijl te druk, dan kom je vrijwel altijd
              bij Japandi uit.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <Kop aanloop="De afbakening">Japandi naast Scandinavisch, wabi-sabi en minimalisme</Kop>
          <div className="prose-japandi mt-6 max-w-content space-y-5">
            <p>
              De Scandinavische stijl is de gezelligste van de vier: lichter hout, meer textiel,
              meer decoratie en geen bezwaar tegen een volle vensterbank. Japandi neemt die warmte
              over, maar haalt de helft van de spullen weg en voegt donkere, aardse accenten toe.
            </p>
            <p>
              Wabi-sabi is strenger en filosofischer. Het omarmt slijtage, asymmetrie en
              onafgewerkte materialen als esthetiek op zich. Japandi leent die waardering voor
              imperfectie, maar blijft comfortabel en woonbaar waar wabi-sabi bijna kaal durft te
              zijn. Puur minimalisme ten slotte is koeler: wit, glas, staal en zo min mogelijk van
              alles. Japandi deelt het &quot;minder is meer&quot;, maar kiest consequent warm
              materiaal boven kil materiaal. Dat is in één zin het verschil: dezelfde soberheid,
              een warmere uitvoering.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zand">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <SplitSectie beeldId="home-werkwijze">
            <Kop aanloop="Onze werkwijze">Waarom je op deze gidsen kunt bouwen</Kop>
            <p className="prose-japandi mt-5">
              De meeste koopgidsen op internet zetten tien bestsellers onder elkaar en plakken er
              links bij. Wij doen het andersom: eerst bepalen wat een meubel Japandi maakt, dan pas
              zoeken wat daaraan voldoet.
            </p>
            <div className="mt-9 space-y-8 max-w-[34rem]">
              {WERKWIJZE.map((stap) => (
                <div key={stap.nr}>
                  <span className="font-display italic text-klei text-[1.6rem] leading-none block">
                    {stap.nr}
                  </span>
                  <h3 className="font-display text-2xl mt-1">{stap.titel}</h3>
                  <p className="prose-japandi mt-2">{stap.tekst}</p>
                </div>
              ))}
            </div>
          </SplitSectie>
        </div>
      </section>

      <section className="bg-zand-diep">
        <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
          <FAQ
            beeldId="home-faq"
            items={[
              {
                vraag: "Is Japandi een blijvende stijl of een voorbijgaande trend?",
                antwoord:
                  "Blijvend. De naam is nieuw, maar de stijl bouwt op twee tradities die al decennia naar elkaar toe groeien en op principes die tijdloos zijn: natuurlijke materialen, functie boven versiering en warmte door ambacht. Een interieur dat je nu volgens deze principes inricht, oogt over tien jaar nog actueel, juist omdat het niet op een modekleur of een hype leunt.",
              },
              {
                vraag: "Kan ik Japandi combineren met een andere interieurstijl?",
                antwoord:
                  "Ja, in beperkte mate. Japandi verdraagt een enkel element uit boho (een geweven mand of een macramé), industrieel (een mat zwart metalen accent) of mid-century modern (een organisch gevormde fauteuil). De sleutel is terughoudendheid: voeg hooguit één element uit een andere stijl per ruimte toe en houd het kleurpalet neutraal, anders verdwijnt de rust die de stijl draagt.",
              },
              {
                vraag: "Is Japandi een dure stijl om in te richten?",
                antwoord:
                  "Niet per se. De stijl vraagt minder meubels dan gemiddeld, dus de totaalkosten vallen vaak mee. Het budget verschuift naar kwaliteit per stuk: liever één goede massief houten tafel dan drie goedkope meubels. Tweedehands massief hout past vaak perfect en scheelt veel, en je kunt rustig in stappen opbouwen in plaats van alles in één keer kopen.",
              },
              {
                vraag: "Welke houtsoort past het best bij Japandi?",
                antwoord:
                  "Eiken en walnoot zijn de twee dragers. Eiken is licht en rustig en sluit aan op de Scandinavische kant, walnoot is donkerder en warmer en is nu het meest gevraagd. Beide zijn goed; combineer ze hooguit met één extra houtsoort per ruimte. Let op het verschil tussen massief hout en een walnootkleurige afwerking op goedkoper materiaal: dat laatste is de kleur, niet de houtsoort.",
              },
            ]}
          />
        </div>
      </section>

      {nieuwste.length > 0 && (
        <section>
          <div className="max-w-wide mx-auto px-6 py-12 sm:py-16">
            <Kop aanloop="Net verschenen">Nieuwste gidsen</Kop>
            <div className="linkkaart-grid mt-2">
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
