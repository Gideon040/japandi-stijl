# Bouwplan japandi-stijl.nl

Statusbestand. Claude Code werkt dit bij na elke afgeronde stap (status: open / bezig / klaar / review).
Werk altijd in deze volgorde. Sla geen fase over.

## Fase 0: Verificatie (eenmalig)
- [x] npm install draait schoon (klaar). Dev-servertest overgeslagen op verzoek van Gideon, er draaide al een werkende server op poort 3000.
- [x] Redirects testen: overgeslagen op verzoek van Gideon (site werkt)
- [x] .env.local aangemaakt met Bol Referrer + site ID (klaar)

## Fase 1: Proefpagina (1 pagina, daarna review door Gideon)
- [x] /japandi-bureau/ (koopgids, P1, huidige positie 9, bron: shopify-export/japandi-bureaus.mdx) (status: review)
- [ ] STOP na deze pagina. Gideon reviewt toon, diepgang, productselectie en design voordat fase 2 start.

## Fase 1b: Design- en frameworkupgrade (voor start fase 2)
- [x] Stap 1: designreferenties (4 HTML-mockups) in docs/design-referentie/ (klaar)
- [x] Stap 2: tokens (zand-diep, sterrengoud, terracotta, bolblauw), 13 componenten en sectieritme naar de mockups (klaar)
- [x] Stap 3: framework v4.1 aangescherpt (sectiemenu's, woordaantallen, stijltips, winkel-neutraal) + affiliate-router in lib/affiliate.ts (klaar)
- [x] Stap 4: homepage naar designreferentie (klaar)
- [x] Stap 5: /japandi-bureau/ herbouwd als kalibratiepagina, 8 producten in 4 situatiegroepen (status: review)
- [x] Stap 6: controle (build, screenshots 1440/390, checklist) en bouwplan bijgewerkt (klaar)
- [ ] REVIEW door Gideon. Update: Olivine Noor en Kave Dilme bleken niet te bestaan en zijn vervangen door geverifieerde producten (WOOOD Tug via fonQ, Olivine Lenn via Gewoonstijl). Alle productkaarten hebben nu een officiele winkelfoto via de beeld-prop.

## Fase 2: Overige P1 (batches van 3)
- [x] /japandi-bloempot/ (p11), /japandi-vaas/ (p17), /japandi-slaapkamer/ (gids, p18) (klaar, commit 081ec3b; status: review. Let op: alle nieuwe ProductCards missen nog productfoto-URLs van de winkels, net als Olivine/Kave eerder)
- [ ] /japandi-plafondlamp/ (p19), /japandi-dressoir/ (p22), /japandi-nachtkastje/ (p23) (volgende batch)
- [ ] /japandi-kast/ (p26), /japandi-spiegel/ (p26), /japandi-behang/ (p27)
- [ ] /japandi-woonkamer/ (gids, p30)

## Fase 3: Pillar
- [ ] /japandi-stijl/ (alle P1-paginas bestaan dan om naartoe te linken)
- [ ] Homepage herschrijven naar volwaardige landingspagina

## Fase 4: P2 (zie keyword-mapping.csv, 25 paginas, batches van 3-5)
## Fase 5: P3 (93 paginas, alleen na evaluatie van de eerste rankingresultaten)

## Per pagina altijd (checklist)
1. Bronbestand lezen in docs/shopify-export/
2. Differentiatie-check invullen (framework deel 6)
3. SERP-check + Bol-productonderzoek (CLAUDE.md protocollen)
4. Pagina schrijven als content/pages/{slug}.mdx
5. image-manifest.json aanvullen (1 hero + 2-4 beelden)
6. Interne links: pillar + 2-4 verwante paginas, en bestaande paginas updaten met link TERUG naar de nieuwe pagina
7. Overlap-test en FAQ-dedup tegen alle bestaande paginas
8. Status hier bijwerken
