// Centrale affiliate-config. Waarden NOOIT hardcoden in MDX of componenten.
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
