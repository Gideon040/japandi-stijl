# japandi-stijl.nl - Informatieve Japandi koopgids

## Wat dit project is

Herbouw van japandi-stijl.nl van Shopify dropshipping-webshop naar een informatieve content- en affiliatesite over Japandi interieurstijl. Doel: topical authority in de Japandi-niche (NL), maximale zichtbaarheid in Google en AI Overviews/ChatGPT, inkomsten via Bol.com affiliate links.

- Stack: Next.js (App Router) + MDX content in de repo, static generation, deploy via Vercel
- Geen CMS, geen database. Content = MDX-bestanden in `/content/`
- Eigenaar: Gideon (GOSTACK). Bestaande site heeft DR ~30, 74 rankende keywords, 21 ChatGPT-citaties

## Harde schrijfregels

1. **GEEN em dashes (—) en geen en dashes (–) in lopende tekst.** Gebruik een komma, dubbele punt of een nieuwe zin. Geldt voor alle content, meta descriptions, alt-teksten en UI-copy.
2. Nederlands, informeel maar deskundig. Geen marketingtaal, geen AI-cliches ("in de wereld van", "of je nu... of...", "naadloos", "essentieel onderdeel"). Geen superlatieven zonder onderbouwing.
3. Schrijf antwoord-eerst: elke pagina opent direct onder de H1 met een feitelijk antwoord van 40-60 woorden op de hoofdvraag van het keyword. Geen sfeerintro.
4. H2's zijn waar mogelijk vragen zoals mensen ze stellen ("Welke kleuren passen bij Japandi?").
5. Concrete feiten boven vage adviezen: afmetingen, materialen, prijsranges, onderhoudseisen. LLM's citeren cijfers en definities, geen sfeerteksten.
6. Volg het MIR Media SEO+GEO Framework: `/docs/framework-v4.md` (origineel) plus `/docs/framework-v4.1-japandi.md` (projectspecifieke aanpassingen, o.a. het koopgids-paginatype en MDX-output). Leesvolgorde: eerst v4.1, dan v4.0 voor de onderbouwing. Bij conflict wint v4.1, en daarboven dit bestand.

## Paginatypes en templates

Drie templates in `/components/templates/`:

**pillar** (1x: /japandi-stijl/)
De hoofdpagina over Japandi als stijl. Volledig informatief, linkt naar alle gidsen en koopgidsen. Doel: de AI Overview op "japandi stijl" (18K volume, AI Overview aanwezig in SERP) en alle definitievragen.

**gids** (informational intent: ruimtes en concepten)
Voorbeelden: /japandi-woonkamer/, /japandi-slaapkamer/, /japandi-kleuren/, /japandi-vs-wabi-sabi/. 1300-1700 inhoudswoorden. Verplicht: hero met direct antwoord en kerncijfers, basis/uitleg met Collage, 2-3 themasecties, KleurenKaart waar relevant, linkkaarten of LinkLijst naar de relevante koopgidsen, FAQ-band. Plus minimaal 1 keuzesectie (veelgemaakte fouten, per-stijlvariant, budgetvolgorde). Longtail-pagina's zijn een ingekorte gids (400-600 woorden): hero, een inhoudssectie, FAQ.

**koopgids** (commercial intent: productcategorieen)
Voorbeelden: /japandi-salontafel/, /japandi-plafondlamp/, /japandi-vloerkleed/. Dit is GEEN kale productlijst. 1500-2000 inhoudswoorden (pillar: 1600-2200). Verplichte opbouw:
1. Hero: direct antwoord wat een [product] Japandi maakt (40-60 woorden) plus 2-3 kerncijfers in frontmatter
2. Kenmerken: materialen, vormen, wat wel en niet past, met Collage
3. Keuzehulp: waar let je op bij aanschaf (afmetingen, materiaal, prijsindicatie), materiaalvergelijking via MateriaalKaart
4. Productselectie per situatie: minimaal 3 situatiegroepen, samen 8-10 producten met ProductCard, inclusief eerlijke voor- en nadelen per product; stijltips op minimaal de helft
5. H2 "Eerlijk gezegd" of "Dit zou ik niet kopen": KoopNietBlok met beeld en onderbouwing
6. FAQ-band (3-5 vragen, gededupliceerd tegen andere pagina's)
Plus minimaal 2 keuzesecties uit: onderhoud, stijlcombinaties, formaten/opstelling, prijsopbouw. Een kleurencombinatie-element (stijltips en/of KleurenKaart) is verplicht. Woordaantallen zijn inhoudswoorden: padding is verboden, de depth-score blijft leidend.
Subvarianten (rond, ovaal, eiken, walnoot) worden secties met een anchor op de hoofdpagina, geen eigen pagina, tenzij de keyword-mapping anders zegt.

## Search intent werkwijze

- `/docs/keyword-mapping.csv` is leidend: elk cluster heeft een pagina, template en prioriteit. Bouw in prioriteitsvolgorde (P1, dan P2, dan P3).
- De intent-kolom komt uit Ahrefs. Bij twijfel over de interpretatie: check wat er nu in de Google top 3 staat voor de hoofdterm. Wat daar rankt is de intent volgens Google. Webshop-categoriepaginas in de top 3 betekent koopgids-template met producten hoog op de pagina; gidsen/blogs in de top 3 betekent informatief zwaartepunt.
- Een pagina moet de zoekvraag VOLLEDIG afhandelen: uitleg, keuzehulp en producten op een pagina. De bezoeker hoeft niet terug naar Google.

## Extern onderzoek en bronvermelding

Voor ELKE pagina, voor het schrijven (naast de differentiatie-check):
1. SERP-check: bekijk via web search wat de huidige Google top 3 op het hoofdkeyword behandelt. Noteer 2-3 onderwerpen of vragen die zij MISSEN: dat zijn jouw unieke secties. Kopieer nooit hun structuur of volgorde.
2. Feitencheck: verifieer concrete claims (materiaaleigenschappen, afmetingsstandaarden, herkomst van begrippen als wabi-sabi) bij een autoritaire bron voordat je ze opschrijft.
3. Bronvermelding: maximaal 1-2 externe bronlinks per pagina, alleen voor verifieerbare feiten, altijd `rel="nofollow noopener"`. Link naar echte autoriteit (vakliteratuur, materiaalinstituten, gerenommeerde designpublicaties). NOOIT linken naar directe concurrenten in de Japandi/interieur-niche (japandiwonen.nl, dejapandiwinkel.nl e.d.).
4. Als een feit niet te verifieren is: schrijf het niet op. Geen verzonnen cijfers of bronnen.

## Onderzoeksprotocol per koopgids

Voor elke koopgids, voordat je schrijft:
1. Zoek winkel-neutraal naar de productcategorie met "japandi" als term (Bol.com plus gespecialiseerde winkels). Het beste product wint, ongeacht winkel; selecteer nooit een zwakker product omdat het bij een affiliate-partner staat.
2. Selecteer 8-10 producten op basis van: past echt bij Japandi (natuurlijke materialen, strakke vormen, neutrale tinten; papier-mache en hout = ja, faux fur en hoogglans = nee), reviewscore 4+ waar mogelijk, spreiding in prijs (budget, midden, hoger)
3. Leg per product vast: naam, merk, prijs, afmetingen, materiaal, reviewscore, 1-2 voordelen, 1 nadeel of kanttekening
4. Niet aanbevolen producten: benoem ze met merk en reden, ZONDER link
5. Prijzen dateren: schrijf "prijs bij publicatie" logica in de ProductCard, niet hardcoded in lopende tekst

## Linkbeleid

- Alle productlinks lopen via de router in `/lib/affiliate.ts` (per-winkel linkbuilders, nu Bol.com, voorbereid op Daisycon/TradeTracker). Affiliate-winkels: `rel="sponsored noopener"`, target blank. Niet-affiliate winkels: normale link met `rel="nofollow noopener"`. Partner-ID's komen in de centrale config, nooit hardcoded in MDX.
- Site-copy is nooit Bol-exclusief: schrijf "links naar webshops", niet "links naar Bol.com".
- Producten die we afraden krijgen GEEN link, alleen merk en productnaam met de reden.
- Externe informatieve bronnen (als die er zijn): normale links, spaarzaam.
- Interne links: elke koopgids linkt naar de pillar en naar 2-4 verwante gidsen/koopgidsen. Elke gids linkt naar de relevante koopgidsen. Gebruik beschrijvende anchorteksten, geen "klik hier".

## Componenten

- `ProductCard`: productfoto van de winkel bovenin (4:3), merk in caps, naam in Fraunces, prijs, sterren, specs, voordelen/nadeel als ronde badges, pill-knop "Bekijk bij {winkel}". Props:
  - `prijs`: ALLEEN het bedrag (`prijs="118"`); de component rendert zelf "ca. € 118 (prijs bij publicatie)". Geen "ca." of valutateken in MDX.
  - `winkel`: verplicht ("Bol.com", "Olivine", ...). De knop kleurt Bol-blauw bij Bol, walnoot bij andere winkels. De link loopt via de router in `lib/affiliate.ts` (sponsored rel voor affiliate-winkels, nofollow voor de rest); nooit zelf affiliate-parameters in MDX zetten.
  - `score` (getal, `score={4.2}`) en `reviews` (aantal): renderen sterren met fractionele vulling. Zonder reviews toont de card "nog geen reviews", nooit lege sterren.
  - `stijltip` (op minimaal de helft van de cards): combinatieadvies van 1-2 zinnen inclusief een vermijd-advies. De component rendert het label "Combineer met:", dat dus niet in de prop-tekst herhalen.
- `Sterren`: losse reviewsterren (intern gebruikt door ProductCard)
- `VergelijkingsTabel`: alleen voor echte tabeldata met concrete waardes
- `MateriaalKaart` / `KleurenKaart` (zelfde component): editoriale rijenlijst met gekleurde staal, naam, prijsindicatie en let-op. Gebruik deze in plaats van een tabel bij materiaal- of kleurvergelijkingen. Props: `items=[{staal, naam, subtitel?, prijs?, opmerking}]`, optionele `caption`.
- `FAQ`: vraag/antwoord-items, rendert FAQPage JSON-LD schema EN zijn eigen H2 "Veelgestelde vragen". Schrijf dus NOOIT een eigen FAQ-heading in de MDX, alleen `<FAQ beeldId="{slug}-faq" items={...} />`. Met `beeldId` wordt het de FAQ-band: sfeerbeeld links, accordeon rechts.
- `ImagePlaceholder`: zie image-workflow hieronder
- `Collage`: 3 sfeerbeelden met verspringende toppen, `<Collage ids={["slug-collage-1", "slug-collage-2", "slug-collage-3"]} />`. Aspect ratios in het manifest: 3:4, 4:5, 3:5. Mobiel verschijnen alleen de eerste twee. Elke pagina heeft minimaal 1 collage.
- `SplitSectie`: beeld naast tekst, `<SplitSectie beeldId="..." beeldLinks rondId="...">tekst</SplitSectie>`. Wissel `beeldLinks` per gebruik. Het ronde accentbeeld (`rondId`) is het overlap-moment dat elke pagina minimaal een keer nodig heeft.
- `KoopNietBlok`: waarschuwingskaart voor afraders. Met `beeldId="{slug}-koopniet"` wordt het de eerlijk-gezegd-band: kaart naast sfeerbeeld. De H2-sectie eromheen komt automatisch op zand.
- `LinkKaart`: beeldkaart als interne link (`href`, `titel`, `subtitel?`, `beeldId`). In een grid van 3 (`linkkaart-grid`) verspringt de middelste automatisch.
- `LinkLijst`: kolommenlijst met interne links, gevoed uit `lib/koopgidsen.ts` (keyword-mapping gekruist met gepubliceerde pagina's, groeit automatisch mee met elke publicatie).
- `Breadcrumb`: kruimelpad boven elke hero, gerenderd door de paginaroute (niet in MDX), zelfde databron als het BreadcrumbList-schema.
- `AuteurBlok`: E-E-A-T blok onderaan elke pagina, gecentreerd op een zand-band met het ronde "js"-stempel. Wordt door de paginaroute gerenderd, niet in MDX zetten.

Elke pagina rendert ook: Article of CollectionPage JSON-LD, BreadcrumbList, en bij koopgidsen ItemList schema voor de productselectie.

## Design

Designwaarheid: de vier HTML-mockups in `docs/design-referentie/` (koopgids, gids, pillar, homepage), een per paginatype. De Unsplash-beelden daarin zijn alleen mockup-sfeer; productie gebruikt altijd ImagePlaceholder + image-manifest, productfoto's komen van de winkel zelf. Alles hieronder is GEIMPLEMENTEERD in layout, globals.css en componenten; nieuwe pagina's volgen dit automatisch zolang ze het MDX-patroon aanhouden:

- Warm palet via de Tailwind-tokens papier, zand, zand-diep, inkt, klei, walnoot, lijn, groen, sterrengoud, terracotta, bolblauw. GEEN nieuwe kleuren toevoegen.
- Fraunces (serif, normal + italic geladen) voor headings, Inter voor leestekst (17px, leading-relaxed).
- **Koppatroon** (sitewide): italic aanloopregel boven, romein statement eronder. In de H1 splitst de paginatitel op de dubbele punt: deel ervoor wordt de italic aanloop, de rest het statement. In H2's schrijf je in MDX `## *De aanloop* Het statement`; de cursieve aanloop rendert automatisch als blokregel erboven.
- **PageHero**: de paginaroute tilt het directe antwoord plus het hero-beeld uit de MDX en rendert ze in een full-width zand-band, echt 50/50: links breadcrumb + H1 + antwoord op de contentmarge, rechts het hero-beeld tot de schermrand (mobiel: beeld boven). Onder het antwoord 2-3 kerncijfers uit frontmatter `kerncijfers: [{waarde, label}]` (waarde groot in Fraunces, label klein in klei). Voorwaarde in MDX: direct antwoord als eerste alinea, daarna `<ImagePlaceholder id="{slug}-hero" priority />`.
- **Sectieritme**: `lib/remark-layout.ts` wikkelt de body per H2 in secties. Drie tinten rouleren (papier, zand, zand-diep), nooit twee keer dezelfde tint na elkaar. Vast: productsecties en de FAQ-band op zand-diep, de koopniet-sectie op zand. Content blijft binnen max-w-wide, lopende tekst binnen max-w-content. Niets hiervoor in de MDX doen, dit gebeurt automatisch.
- **Beeldritme**: elke pagina heeft minimaal een hero, een collage en een overlap-moment (SplitSectie met rondId of de verspringende cards). Beelden raken elkaar nooit: collages en grids houden altijd een gap. Wissel de accenten per pagina af (rond beeld links of rechts, collage vroeg of laat), zodat pagina's niet identiek aanvoelen.
- **ProductCards**: opeenvolgende cards worden automatisch gegroepeerd in een 2-koloms grid (1 kolom mobiel); de tweede kaart van elk paar verspringt iets. Card: bg-papier, shadow-sm, geen border, hover-lift. Situatie-H3's ("Voor een kleine ruimte") krijgen automatisch een korte hairline eronder.
- H2's: text-3xl/4xl met ruime marge erboven. Tabellen: caption in klei, headers in Fraunces.
- Rustig, veel witruimte, geen schreeuwende CTA's. De winkel-knoppen zijn ingetogen pills met een uitschuivende pijl.
- Mobile first: het meeste verkeer is mobiel.

## Image-workflow (BELANGRIJK)

Wij genereren sfeerbeelden achteraf in batch via Higgsfield. Daarom:

1. Schrijf NOOIT een afbeelding direct in een pagina. Gebruik altijd `<ImagePlaceholder id="..." />`
2. Bij elke pagina-build append je elk beeld aan `/content/image-manifest.json` met dit format:

```json
{
  "id": "japandi-slaapkamer-hero",
  "page": "/japandi-slaapkamer",
  "slot": "hero",
  "aspect_ratio": "16:9",
  "alt": "Japandi slaapkamer met laag eiken bed en linnen beddengoed in zandtinten",
  "prompt": "Japandi bedroom interior, low oak platform bed, linen bedding in warm sand tones, soft diffused morning light through sheer curtains, minimal styling, single ceramic vase on nightstand, editorial interior photography, warm neutral palette, photorealistic"
}
```

3. Promptstijl is vast (consistente sfeer over de hele site): editorial interior photography, warm neutral palette (sand, creme, walnoot, eiken), zacht daglicht, minimal styling, photorealistic, geen mensen prominent in beeld, geen tekst in beeld.
4. Aspect ratios: hero 16:9, collage-beelden 3:4 / 4:5 / 3:5 (in die volgorde), sectie- en splitbeelden 3:2, rond accentbeeld 1:1, FAQ- en koopniet-beelden 4:5.
5. id-conventie: `{pagina-slug}-{slot}`, bijv. `japandi-vloerkleed-collage-2`, `japandi-bureau-koopniet`, `japandi-bureau-faq`. De id wordt later de bestandsnaam in `/public/images/{id}.webp`, dus de ImagePlaceholder component resolvet automatisch zodra het bestand bestaat.
6. Per pagina: 1 hero + collage + 2-4 sfeerbeelden (waaronder de koopniet- en faq-beelden bij koopgidsen), afgestemd op de sectie waar ze staan. Alt-teksten beschrijvend en met natuurlijke keyword-integratie, nooit keyword stuffing.

Aan het einde van het project (of per batch) leest Gideon het manifest uit en genereert alle beelden in een keer via de Higgsfield MCP.

## Migratie en redirects

- `/docs/redirect-map.csv` bevat alle 75 oude Shopify URL's met hun nieuwe bestemming. Implementeer als 301 redirects in `next.config.js` (redirects array). Anchors (#rond etc.) zijn toegestaan in de bestemming.
- Bestaande SEO-content uit Shopify staat in `/docs/shopify-export/` (geconverteerde MDX per collectie, via scripts/convert-shopify.py). Dit is BRONMATERIAAL: hergebruik wat goed is, herschrijf naar de templatestructuur, dedupliceer FAQ's. Gooi niets zomaar weg, de huidige rankings komen van deze teksten.
- URL-structuur nieuw: plat, `/japandi-{onderwerp}/`. Geen /collections/, geen /blog/ prefix.
- Sitemap.xml en robots.txt genereren. Canonicals op elke pagina.

## Verificatie en sessie-werkwijze

- **GEEN screenshots of visuele browserchecks**: dat kost te veel tijd, expliciet besluit van Gideon. Verificatie is altijd tekstueel.
- **NOOIT `npx next build` draaien**: de dev-server van Gideon draait op poort 3000 en een build sloopt diens `.next`. Geen tweede server starten.
- Verificatie per batch: `node scripts/check-mdx.mjs`, `npx tsc --noEmit`, en `Invoke-WebRequest` tegen `http://localhost:3000/{slug}/` met markercontroles (statuscode, geen em/en dashes in de HTML, aantal `rel="sponsored noopener"` = aantal Bol-cards, `rel="nofollow noopener"` = overige winkels + bronlinks, 3-5 `<summary>`-items, kerncijfers aanwezig).
- **Commit per batch** met een beschrijvende Nederlandse commitmessage; werk autonoom door zonder tussentijdse toestemming te vragen, maar geef korte statusupdates in het Nederlands.
- Werk batches af volgens docs/bouwplan.md (het statusbestand) en werk dat bestand na elke batch bij.
- ProductCards krijgen GEEN `beeld`-prop zolang er geen geverifieerde productfoto-URL van de winkel is; meld ontbrekende foto's en placeholder-URLs (`url="#"`) aan Gideon in het batchverslag.
- Geen `score`-prop zonder `reviews`-aantal: een score zonder geverifieerd reviewaantal hoort als tekst in de voordelen, niet als prop.
- Per koopgids draait het onderzoek via research-agents (websearch): SERP-check plus winkel-neutraal productonderzoek, parallel waar mogelijk.

## Wat NIET doen

- Geen localStorage/sessionStorage
- Geen producten of paginas verzinnen die niet in de keyword-mapping staan zonder overleg
- Geen FAQ-vragen herhalen die al op een andere pagina beantwoord zijn (check eerst, framework-regel)
- Geen content schrijven zonder eerst de bestaande Shopify-tekst voor die pagina te lezen (docs/shopify-export/) en de differentiatie-check uit het framework in te vullen
- Geen em dashes. Echt niet.

## Werkvolgorde

1. Repo-skelet: Next.js + MDX setup, design tokens, componenten, templates
2. Redirects implementeren vanuit redirect-map.csv
3. Conversiescript draaien: Shopify-export naar MDX bronmateriaal
4. P1-paginas bouwen (11 stuks, bestaande rankings pos 4-30 met volume)
5. Pillar /japandi-stijl/ bouwen
6. P2, daarna P3 in batches van 3-5 paginas
7. Per batch: image-manifest bijwerken, overlap-test draaien, interne links checken
