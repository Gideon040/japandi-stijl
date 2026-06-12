# Handoff-prompt Fase 5

Herstart Claude met skip-permissions en plak de prompt hieronder.

PowerShell:
```
claude --dangerously-skip-permissions
```
(of in een nieuwe sessie: typ `/` niets, plak gewoon de prompt)

---

## PROMPT (plak dit als eerste bericht)

Je bouwt verder aan japandi-stijl.nl, een informatieve Japandi koop- en contentgids (Next.js App Router + MDX). Lees eerst `CLAUDE.md` volledig: dat bevat de harde schrijfregels (GEEN em/en dashes, Nederlands, antwoord-eerst), de templates (pillar/gids/koopgids), het onderzoeksprotocol, het linkbeleid, de componenten, de image-workflow en de verificatie-werkwijze. Houd je daar strikt aan.

We zitten in **Fase 5**. Lees `docs/bouwplan.md` vanaf "## Fase 5" volledig: daar staan de batches G t/m M, de redirect-batch en de beslisregel. Werk de batches in volgorde af (G eerst, want daar zit `/japandi-keuken/` met 7900 zoekvolume en de kamer/concept-pagina's die nu achter 404-redirects zitten).

Belangrijkste regels voor deze fase:
1. **Beslisregel pagina vs redirect** (zie bouwplan): echt eigen cluster = eigen pagina; variant/synoniem/Engelse term/"...-stijl" = 301-redirect of anchor. Bij `?`-markeringen beslist de SERP-check (staat een webshop-categoriepagina in de Google top 3, dan eigen koopgids; staat de hoofdterm-pagina er al, dan anchor/301).
2. **Geen 301 mag op een 404 landen.** Elke redirect-bestemming moet bij afronding een bestaande pagina of een geldige anchor zijn. Redirects toevoegen aan `docs/redirect-map.csv` en daarna `python scripts/generate-redirects.py` draaien (regenereert `redirects.mjs`, NIET handmatig bewerken).
3. **Per pagina** de checklist onderaan het bouwplan volgen: bronbestand in `docs/shopify-export/` lezen, differentiatie-check, SERP-check + winkel-neutraal Bol-onderzoek (research-agents parallel waar mogelijk), MDX schrijven in `content/pages/{slug}.mdx`, **`content/image-manifest-fase5.json`** aanvullen (1 hero + 2-4 beelden; NIET de oude `image-manifest.json`, die is Fase 1-4), interne links heen EN terug, FAQ-dedup, status in bouwplan bijwerken.
4. **ProductCards**: `beeld`-prop met de officiele winkel-og:image (Bol: host media.s-bol.com), `prijs` alleen het bedrag, `score` alleen met geverifieerd `reviews`-aantal (anders als tekst in de voordelen). Producten die je afraadt krijgen geen link.

Verificatie per pagina (tekstueel, GEEN screenshots, dat is een expliciet besluit van Gideon):
- `node scripts/check-mdx.mjs`
- `npx tsc --noEmit`
- `Invoke-WebRequest http://localhost:3000/{slug}/` met markercontroles: statuscode 200, geen em/en dashes in de HTML, aantal `rel="sponsored noopener"` = aantal affiliate-cards, `rel="nofollow noopener"` = overige winkels + bronlinks, 3-5 `<summary>`-items, kerncijfers aanwezig.

KRITIEKE OMGEVINGSREGELS:
- **NOOIT `npx next build` of een tweede dev-server draaien.** De dev-server van Gideon draait op poort 3000; een build sloopt diens `.next`. Verificatie loopt tegen die draaiende server.
- next-mdx-remote is geupdatet naar v6. In `app/[slug]/page.tsx` staat `blockJS: false` op beide `MDXRemote`-aanroepen (v6 blokkeert anders JS-expressies in MDX). NIET weghalen.
- Redirects en `next.config` worden pas live na een herstart van de dev-server of bij deploy; op de draaiende server kan een net toegevoegde redirect nog 404 geven. Dat is verwacht, niet stuk.

Werkwijze: bouw per batch 4-5 pagina's autonoom achter elkaar, vraag GEEN toestemming per pagina, en geef daarna EEN kort verslag in het Nederlands (wat er staat, welke ProductCards welke winkel/prijs/url hebben, welke beeld-id's in het manifest zijn gezet, en aandachtspunten voor Gideon). Niet zelf committen tenzij Gideon erom vraagt.

Begin met Batch G. Start bij `/japandi-keuken/`. Bevestig kort je begrepen plan en ga dan aan de slag.
