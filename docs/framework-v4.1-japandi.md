# Framework v4.1 aanvulling, japandi-stijl.nl

Dit document past het MIR Media SEO+GEO Framework v4.0 (zie framework-v4.md) aan voor dit project. v4.0 is geschreven voor Shopify-collectiepagina's van een webshop. Japandi-stijl.nl is een informatieve affiliatesite in Next.js/MDX. De kern van v4.0 blijft volledig gelden: de differentiatie-check, de overlap-test, FAQ-deduplicatie, 5W1H, depth scoring en de citability-regels. Hieronder staat alleen wat ANDERS is. Bij conflict wint deze aanvulling, en daarboven wint CLAUDE.md.

## 1. Paginaniveaus opnieuw gemapt

v4.0 kent niveau A/B/C/D voor webshopcollecties. Voor dit project:

| v4.0 | Dit project | Voorbeeld | Woorden | FAQ's |
|------|-------------|-----------|---------|-------|
| A Pillar | **pillar** | /japandi-stijl/ | 1500-2000 | 6-8 |
| B Ruimte-sub | **gids** (ruimte/concept) | /japandi-slaapkamer/, /japandi-kleuren/ | 900-1300 | 4-6 |
| (nieuw) | **koopgids** (productcategorie) | /japandi-salontafel/ | 1200-1800 | 3-5 |
| C Kleur/stijl-sub | bestaat hier meestal niet als eigen pagina | anchor-sectie binnen koopgids | n.v.t. | 0 |
| D Long-tail | **longtail** | /japandi-deurmat/ | 400-600 | 2-3 |

Belangrijkste verschil met v4.0: de productcategorie-pagina (koopgids) is hier GEEN dunne collectiepagina waar Shopify de producten rendert. De producten zijn redactionele content (ProductCard-componenten met eigen beoordeling). Daarom is het woordaantal hoger dan v4.0 niveau B.

Subvarianten (rond, ovaal, eiken, walnoot, beige) zijn anchor-secties binnen de koopgids, geen eigen pagina's. Uitzondering: als de keyword-mapping een subvariant als eigen rij heeft met prioriteit P1 of P2.

## 2. Koopgids-structuur (nieuw paginatype)

Verplichte opbouw, in deze volgorde:

1. Direct antwoord (40-60 woorden): wat maakt een [product] Japandi
2. H2: Wat maakt een [product] Japandi? Kenmerken, materialen, vormen
3. H2: Waar let je op bij het kiezen? Keuzehulp met concrete maten, materialen, prijsranges. Hier hoort een VergelijkingsTabel.
4. H2: De beste Japandi [producten] per situatie. 5-10 ProductCards, gegroepeerd per use case (klein budget, groot gezin, kleine ruimte). Per product eigen oordeel met minimaal 1 nadeel.
5. KoopNietBlok: minimaal 1 afrader of waarschuwing met onderbouwing, zonder link
6. H2's voor subvarianten met anchor-id's (#rond, #eiken) waar de redirect-map naar verwijst
7. FAQ (gededupliceerd)

De gouden regel uit v4.0 blijft: content die net zo goed op de pillar of een gids past, hoort hier niet. De koopgids gaat over het PRODUCT, de gids over de RUIMTE, de pillar over de STIJL.

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

- Elke productvermelding met link loopt via ProductCard (sponsored rel zit in de component)
- Productfoto's in ProductCard zijn altijd de officiele Bol-productfoto (beeld-prop, hotlink naar media.s-bol.com, op te halen via og:image van de productpagina). Nooit AI-beelden voor echte producten, dat is misleidend. AI-sfeerbeelden alleen via ImagePlaceholder.
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
