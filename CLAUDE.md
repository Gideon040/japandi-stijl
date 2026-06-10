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
Voorbeelden: /japandi-woonkamer/, /japandi-slaapkamer/, /japandi-kleuren/, /japandi-vs-wabi-sabi/. Opbouw: direct antwoord, uitleg met praktische stappen, concrete voorbeelden per situatie, interne links naar relevante koopgidsen, FAQ.

**koopgids** (commercial intent: productcategorieen)
Voorbeelden: /japandi-salontafel/, /japandi-plafondlamp/, /japandi-vloerkleed/. Dit is GEEN kale productlijst. Verplichte opbouw:
1. Direct antwoord: wat maakt een [product] Japandi (40-60 woorden)
2. Uitleg: kenmerken, materialen, vormen, wat wel en niet past
3. Keuzehulp: waar let je op bij aanschaf (afmetingen, materiaal, prijsindicatie)
4. Productselectie: 5-10 producten via Bol.com met ProductCard, inclusief eerlijke voor- en nadelen per product
5. Minimaal 1 "dit zou ik niet kopen" of "let hierop" blok met onderbouwing
6. FAQ (3-5 vragen, gededupliceerd tegen andere pagina's)
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
1. Zoek op Bol.com naar de productcategorie met "japandi" als term
2. Selecteer 5-10 producten op basis van: past echt bij Japandi (natuurlijke materialen, strakke vormen, neutrale tinten; papier-mache en hout = ja, faux fur en hoogglans = nee), reviewscore 4+ waar mogelijk, spreiding in prijs (budget, midden, hoger)
3. Leg per product vast: naam, merk, prijs, afmetingen, materiaal, reviewscore, 1-2 voordelen, 1 nadeel of kanttekening
4. Niet aanbevolen producten: benoem ze met merk en reden, ZONDER link
5. Prijzen dateren: schrijf "prijs bij publicatie" logica in de ProductCard, niet hardcoded in lopende tekst

## Linkbeleid

- Alle affiliate links naar Bol.com: `rel="sponsored noopener"`, target blank. Partner-ID komt in een centrale config (`/lib/affiliate.ts`), nooit hardcoded in MDX.
- Producten die we afraden krijgen GEEN link, alleen merk en productnaam met de reden.
- Externe informatieve bronnen (als die er zijn): normale links, spaarzaam.
- Interne links: elke koopgids linkt naar de pillar en naar 2-4 verwante gidsen/koopgidsen. Elke gids linkt naar de relevante koopgidsen. Gebruik beschrijvende anchorteksten, geen "klik hier".

## Componenten

- `ProductCard`: Bol-productfoto bovenin, naam, prijs, specs (afmetingen, materiaal), voordelen/nadeel, Bol-knop met sponsored rel. De `prijs`-prop bevat ALLEEN het bedrag (`prijs="118"`); de component rendert zelf "ca. € 118 (prijs bij publicatie)". Geen "ca." of valutateken in MDX.
- `VergelijkingsTabel`: vergelijking van producttypes of materialen, met concrete waardes
- `FAQ`: vraag/antwoord-items, rendert FAQPage JSON-LD schema EN zijn eigen H2 "Veelgestelde vragen". Schrijf dus NOOIT een eigen FAQ-heading in de MDX, alleen de `<FAQ items={...} />` component.
- `ImagePlaceholder`: zie image-workflow hieronder
- `ImageGrid`: 2 of 3 sfeerbeelden naast elkaar, `<ImageGrid ids={["slug-grid-1", "slug-grid-2"]} />`, gestapeld op mobiel
- `AuteurBlok`: E-E-A-T blok onderaan elke pagina (naam, rol, korte bio), naar voorbeeld van het Eijerkamp "Marcel" blok. Wordt door de paginaroute gerenderd, niet in MDX zetten.
- `KoopNietBlok`: visueel onderscheiden blok voor afraders/waarschuwingen

Elke pagina rendert ook: Article of CollectionPage JSON-LD, BreadcrumbList, en bij koopgidsen ItemList schema voor de productselectie.

## Design

Referentie: eijerkamp.nl/woonstijlen/japandi. Vertaling naar deze site (GEIMPLEMENTEERD in layout, globals.css en componenten; nieuwe pagina's volgen dit automatisch zolang ze het MDX-patroon aanhouden):

- Warm palet via de Tailwind-tokens papier, zand, inkt, klei, walnoot, lijn, groen. GEEN nieuwe kleuren toevoegen.
- Fraunces (serif, normal + italic geladen) voor headings, Inter voor leestekst (17px, leading-relaxed).
- **PageHero**: de paginaroute tilt het directe antwoord plus het hero-beeld uit de MDX en rendert ze in een full-width zand-band: links H1 + antwoord, rechts het hero-beeld tot de rand (mobiel: beeld boven). De H1 splitst op de dubbele punt in de titel: deel ervoor regular, rest cursief op een nieuwe regel. Voorwaarde in MDX: direct antwoord als eerste alinea, daarna `<ImagePlaceholder id="{slug}-hero" priority />`.
- **Sectieritme**: `lib/remark-layout.ts` wikkelt de body per H2 in secties. Prose-secties wisselen papier en full-bleed zand af; de productsectie en de FAQ staan altijd op zand. Content blijft binnen max-w-wide, lopende tekst binnen max-w-content, losse beelden mogen breder (max-w-4xl, gecentreerd). Niets hiervoor in de MDX doen, dit gebeurt automatisch.
- **ProductCards**: opeenvolgende cards worden automatisch gegroepeerd in een 2-koloms grid (1 kolom mobiel). Card: bg-papier, shadow-sm, geen border, productfoto bovenin (4:3). Situatie-H3's ("Voor een kleine ruimte") krijgen automatisch een korte hairline eronder.
- H2's: text-3xl/4xl met ruime marge erboven. Tabellen: caption in klei, headers in Fraunces.
- Rustig, veel witruimte, geen schreeuwende CTA's. De Bol-knoppen zijn ingetogen.
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
4. Aspect ratios: hero 16:9, grid-beelden 4:5 of 1:1, sectie-beelden 3:2.
5. id-conventie: `{pagina-slug}-{slot}`, bijv. `japandi-vloerkleed-grid-2`. De id wordt later de bestandsnaam in `/public/images/{id}.webp`, dus de ImagePlaceholder component resolvet automatisch zodra het bestand bestaat.
6. Per pagina: 1 hero + 2-4 sfeerbeelden, afgestemd op de sectie waar ze staan. Alt-teksten beschrijvend en met natuurlijke keyword-integratie, nooit keyword stuffing.

Aan het einde van het project (of per batch) leest Gideon het manifest uit en genereert alle beelden in een keer via de Higgsfield MCP.

## Migratie en redirects

- `/docs/redirect-map.csv` bevat alle 75 oude Shopify URL's met hun nieuwe bestemming. Implementeer als 301 redirects in `next.config.js` (redirects array). Anchors (#rond etc.) zijn toegestaan in de bestemming.
- Bestaande SEO-content uit Shopify staat in `/docs/shopify-export/` (geconverteerde MDX per collectie, via scripts/convert-shopify.py). Dit is BRONMATERIAAL: hergebruik wat goed is, herschrijf naar de templatestructuur, dedupliceer FAQ's. Gooi niets zomaar weg, de huidige rankings komen van deze teksten.
- URL-structuur nieuw: plat, `/japandi-{onderwerp}/`. Geen /collections/, geen /blog/ prefix.
- Sitemap.xml en robots.txt genereren. Canonicals op elke pagina.

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
