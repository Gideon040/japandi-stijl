# Framework v4.1 aanvulling, japandi-stijl.nl

Dit document past het MIR Media SEO+GEO Framework v4.0 (zie framework-v4.md) aan voor dit project. v4.0 is geschreven voor Shopify-collectiepagina's van een webshop. Japandi-stijl.nl is een informatieve affiliatesite in Next.js/MDX. De kern van v4.0 blijft volledig gelden: de differentiatie-check, de overlap-test, FAQ-deduplicatie, 5W1H, depth scoring en de citability-regels. Hieronder staat alleen wat ANDERS is. Bij conflict wint deze aanvulling, en daarboven wint CLAUDE.md.

## 1. Paginaniveaus opnieuw gemapt

v4.0 kent niveau A/B/C/D voor webshopcollecties. Voor dit project:

| v4.0 | Dit project | Voorbeeld | Woorden | FAQ's |
|------|-------------|-----------|---------|-------|
| A Pillar | **pillar** | /japandi-stijl/ | 1600-2200 | 6-8 |
| B Ruimte-sub | **gids** (ruimte/concept) | /japandi-slaapkamer/, /japandi-kleuren/ | 1300-1700 | 4-6 |
| (nieuw) | **koopgids** (productcategorie) | /japandi-salontafel/ | 1500-2000 | 3-5 |
| C Kleur/stijl-sub | bestaat hier meestal niet als eigen pagina | anchor-sectie binnen koopgids | n.v.t. | 0 |
| D Long-tail | **longtail** | /japandi-deurmat/ | 400-600 | 2-3 |

Woordaantallen zijn INHOUDSWOORDEN: lopende tekst die iets toevoegt. Componentprops, FAQ-antwoorden en productspecs tellen mee, opsomvulsel en herhaling niet. Padding om een aantal te halen is verboden; de depth-score per H2 blijft leidend. Liever 1400 diepe woorden dan 1700 met lucht.

Belangrijkste verschil met v4.0: de productcategorie-pagina (koopgids) is hier GEEN dunne collectiepagina waar Shopify de producten rendert. De producten zijn redactionele content (ProductCard-componenten met eigen beoordeling). Daarom is het woordaantal hoger dan v4.0 niveau B.

Subvarianten (rond, ovaal, eiken, walnoot, beige) zijn anchor-secties binnen de koopgids, geen eigen pagina's. Uitzondering: als de keyword-mapping een subvariant als eigen rij heeft met prioriteit P1 of P2.

## 2. Sectiemenu's per paginatype

Elke pagina bouwt uit een vast verplicht deel plus keuzesecties. De keuzesecties zorgen dat pagina's niet identiek aanvoelen: wissel de patronen af tussen pagina's binnen hetzelfde type.

### Koopgids

Verplicht, in deze volgorde:

1. Hero: direct antwoord (40-60 woorden) wat een [product] Japandi maakt, plus 2-3 kerncijfers in de frontmatter (`kerncijfers: [{waarde, label}]`, bijv. aantal geteste producten, prijsrange, aantal materialen)
2. H2: Wat maakt een [product] Japandi? Kenmerken, materialen, vormen, met een Collage
3. H2: Waar let je op bij het kiezen? Keuzehulp met concrete maten en prijsranges. Materiaal- of kleurvergelijking via MateriaalKaart; VergelijkingsTabel alleen voor echte tabeldata.
4. H2: De beste Japandi [producten] per situatie. Minimaal 3 situatiegroepen (H3's), samen 8-10 ProductCards. Per product eigen oordeel met minimaal 1 nadeel.
5. H2 "Eerlijk gezegd" of "Dit zou ik niet kopen": KoopNietBlok met beeldId, minimaal 1 afrader met merk en onderbouwing, zonder link
6. FAQ-band: `<FAQ beeldId="{slug}-faq" items={...} />`, gededupliceerd

Plus MINIMAAL 2 keuzesecties uit dit menu:

- Onderhoud (per materiaal, concreet: middelen, korrels, verboden)
- Stijlcombinaties (welke andere meubels/kleuren erbij passen, met links naar verwante gidsen zodra die bestaan)
- Formaten en opstelling (maatvoering per ruimte, loopruimtes)
- Prijsopbouw (waarom kost het ene 3x het andere, waar zit het verschil)

Kleurencombinatie-element is verplicht per koopgids: stijltips op de cards en/of een KleurenKaart. H2's voor subvarianten met anchor-id's (#rond, #eiken) waar de redirect-map naar verwijst blijven gelden.

### Gids

Verplicht: hero met direct antwoord en kerncijfers, H2 basis/uitleg met Collage, 2-3 themasecties, KleurenKaart waar kleur of materiaal relevant is, linkkaarten of LinkLijst naar de relevante koopgidsen, FAQ-band.

Plus MINIMAAL 1 keuzesectie uit: veelgemaakte fouten, aanpak per stijlvariant (licht/donker, klein/groot), volgorde van aanschaf bij beperkt budget.

### Longtail

Een ingekorte gids: hero met direct antwoord, EEN inhoudssectie, FAQ. Geen keuzesecties.

De gouden regel uit v4.0 blijft: content die net zo goed op de pillar of een gids past, hoort hier niet. De koopgids gaat over het PRODUCT, de gids over de RUIMTE, de pillar over de STIJL.

### Stijltips op ProductCards

De `stijltip`-prop is een combinatieadvies van 1-2 zinnen, altijd inclusief een vermijd-advies ("Vermijd grijze muren, die maken eiken geel"). Verplicht op minimaal de helft van de producten per koopgids. De component rendert zelf het label "Combineer met:".

## 3. Output-formaat

v4.0 deel 6 schrijft pure HTML voor met het verbod op tabellen (Shopify rich text beperking). Dat vervalt volledig. Output is MDX:

- Markdown headings met anchor-id's: `## Vraag als heading [#kebab-case]` (vierkante haken, want MDX leest `{#...}` als JavaScript-expressie en crasht daarop; de plugin lib/remark-heading-id.ts zet `[#id]` om en slugificeert headings zonder expliciete id)
- Tabellen MOGEN en MOETEN waar vergelijking met cijfers speelt, via de VergelijkingsTabel-component
- FAQ's via de FAQ-component (rendert zelf het FAQPage-schema), niet als losse metafields
- Interne links naar de nieuwe platte structuur: `/japandi-salontafel/`, nooit `/collections/...`
- Frontmatter zoals in content/pages/voorbeeld.mdx

## 4. Schema markup opnieuw gemapt

| Paginatype | Schema |
|-----------|--------|
| pillar | Article + FAQPage + BreadcrumbList + Organization (site-breed in layout) |
| gids | Article + FAQPage + BreadcrumbList |
| koopgids | Article + ItemList (productselectie) + FAQPage + BreadcrumbList |
| longtail | Article + BreadcrumbList |

CollectionPage vervalt overal: dit zijn geen collecties meer.

## 5. Affiliate-laag bovenop v4.0

Nieuw ten opzichte van v4.0, want de webshopvariant had dit niet:

- **Winkel-neutraal selecteren**: het beste product wint, ongeacht winkel. Selecteer nooit een zwakker product omdat het bij een affiliate-partner staat. Site-copy is nooit Bol-exclusief ("links naar webshops", niet "links naar Bol.com").
- Elke productvermelding met link loopt via ProductCard met de `winkel`-prop. De router in `lib/affiliate.ts` bepaalt de link en de rel: affiliate-winkels (nu Bol.com; Daisycon/TradeTracker voorbereid) krijgen hun linkbuilder en `rel="sponsored noopener"`, niet-affiliate winkels een normale link met `rel="nofollow noopener"`. Nooit affiliate-parameters in MDX of componenten hardcoden.
- Productfoto's in ProductCard zijn altijd de officiele productfoto van de winkel (beeld-prop, op te halen via og:image van de productpagina). Nooit AI-beelden voor echte producten, dat is misleidend. AI-sfeerbeelden alleen via ImagePlaceholder.
- Afraders: merk en naam benoemen, reden geven, GEEN link
- Prijzen alleen in ProductCards ("prijs bij publicatie"), nooit in lopende tekst, zodat tekst niet veroudert
- Eerlijkheid is het differentiatiepunt: elke koopgids bevat minstens 1 nadeel per product en 1 afrader. Een koopgids zonder kritisch element is niet af.

## 6. Schrijfregels bovenop v4.0

- GEEN em dashes en geen en dashes, nergens. v4.0 bevat ze zelf in voorbeelden; negeer dat.
- Conversie-elementen uit v4.0 (CTA's, "kopen bij [Bedrijf]") vervallen. Er is geen eigen winkel. De H2 "[Categorie] kopen bij [Bedrijf]" bestaat hier niet; de afsluiting van een koopgids is de FAQ plus AuteurBlok.
- Entity mapping blijft verplicht. De merkentiteit is "japandi-stijl.nl" als onafhankelijke gids, niet als winkel.
- 5W1H, depth scoring (minimaal 7 per H2 voor pillar/gids/koopgids) en de scorecard uit v4.0 deel 10 blijven gelden, waarbij "Conversie-elementen" (10 punten) wordt vervangen door "Affiliate-eerlijkheid" (10 punten: nadelen benoemd, afrader aanwezig, sponsored links correct).

## 7. Hergebruik Shopify-bronmateriaal

Voor elke pagina met een bestaand bronbestand in docs/shopify-export/:

1. Lees het bronbestand VOLLEDIG voordat je schrijft
2. Behoud feitelijke kernen die goed zijn (afmetingen, materiaaladvies, de Janka-hardheid stijl details): dit is wat nu rankt
3. Herstructureer naar de nieuwe templateopbouw, herschrijf zinnen die naar de webshop verwijzen ("onze collectie", "shop bij")
4. FAQ's uit de frontmatter van het bronbestand zijn kandidaten, maar check ze tegen de FAQ-dedupregel over de NIEUWE sitestructuur
5. Interne links in het bronmateriaal verwijzen naar /collections/: vervang door de nieuwe URL via docs/redirect-map.csv
