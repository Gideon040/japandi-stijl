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

## Fase 2: Overige P1 (batches van 3)
- [ ] /japandi-bloempot/ (p11), /japandi-vaas/ (p17), /japandi-slaapkamer/ (gids, p18)
- [ ] /japandi-plafondlamp/ (p19), /japandi-dressoir/ (p22), /japandi-nachtkastje/ (p23)
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
