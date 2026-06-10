# japandi-stijl.nl

Informatieve Japandi-gids met Bol.com affiliate koopgidsen. Next.js + MDX, deploy via Vercel.

## Setup

```bash
npm install
cp .env.local.example .env.local   # vul NEXT_PUBLIC_BOL_PARTNER_ID in
npm run dev
```

## Werken aan content

Lees eerst CLAUDE.md (regels) en docs/framework-v4.1-japandi.md (contentframework).
De bouwvolgorde staat in docs/keyword-mapping.csv (kolom prioriteit).

- Nieuwe pagina: `content/pages/{slug}.mdx`, frontmatter zoals in `content/pages/voorbeeld.mdx`
- Bronmateriaal oude site: `docs/shopify-export/{handle}.mdx`
- Beelden: nooit direct toevoegen, altijd via ImagePlaceholder + `content/image-manifest.json`
- Redirects aanpassen: bewerk `docs/redirect-map.csv`, draai `python scripts/generate-redirects.py`
