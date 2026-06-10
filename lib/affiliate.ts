// Centrale affiliate-router. Waarden NOOIT hardcoden in MDX of componenten.
// Winkel-neutraal beleid: het beste product wint, ongeacht winkel.
// Affiliate-winkels krijgen hun eigen linkbuilder en rel="sponsored noopener",
// niet-affiliate winkels een normale link met rel="nofollow noopener".

type LinkBuilder = (productUrl: string) => string;

// Linkformat conform Bol.com partnerprogramma (tekstlink/TXL):
// {product-url}?Referrer={REFERRER}&utm_source={SITE_ID}&utm_medium=Affiliates&utm_campaign=CPS&utm_content=txl
const BOL_REFERRER = process.env.NEXT_PUBLIC_BOL_REFERRER ?? "";
const BOL_SITE_ID = process.env.NEXT_PUBLIC_BOL_SITE_ID ?? "";

export function bolLink(productUrl: string): string {
  if (!BOL_REFERRER || !BOL_SITE_ID) return productUrl;
  const u = new URL(productUrl);
  u.searchParams.set("Referrer", BOL_REFERRER);
  u.searchParams.set("utm_source", BOL_SITE_ID);
  u.searchParams.set("utm_medium", "Affiliates");
  u.searchParams.set("utm_campaign", "CPS");
  u.searchParams.set("utm_content", "txl");
  return u.toString();
}

// Per-winkel linkbuilders. Nieuwe netwerken (Daisycon, TradeTracker)
// krijgen hier een builder per aangesloten winkel; de match gaat op
// een genormaliseerde winkelnaam (lowercase, zonder .nl/.com).
const AFFILIATE_BUILDERS: Record<string, LinkBuilder> = {
  bol: bolLink,
  // Voorbeeld Daisycon (deeplink-redirect), activeren zodra het account er is:
  // olivine: (url) => `https://ds1.nl/c/?si=${DAISYCON_SI}&li=${LI}&ws=&dl=${encodeURIComponent(url)}`,
};

function normaliseer(winkel: string): string {
  return winkel.toLowerCase().replace(/\.(nl|com|be|de)$/, "").trim();
}

function builderVoor(winkel: string): LinkBuilder | undefined {
  return AFFILIATE_BUILDERS[normaliseer(winkel)];
}

export function winkelLink(winkel: string, productUrl: string): string {
  const builder = builderVoor(winkel);
  return builder ? builder(productUrl) : productUrl;
}

export function winkelRel(winkel: string): string {
  return builderVoor(winkel) ? "sponsored noopener" : "nofollow noopener";
}
