// Meetlaag voor de winkel. De Shopify-pixels meten alleen op de checkout, dus
// de site stuurt zelf de ecommerce-events. Ze gaan naar window.dataLayer in het
// GA4-formaat, zodat Google Tag Manager of gtag ze zonder extra code oppakt.
// Staat er nog geen tag op de site, dan gebeurt er niets.

type Item = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

type Venster = Window & { dataLayer?: unknown[] };

export function track(event: "view_item" | "add_to_cart" | "begin_checkout", waarde: number, items: Item[]) {
  if (typeof window === "undefined") return;
  const w = window as Venster;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ ecommerce: null });
  w.dataLayer.push({ event, ecommerce: { currency: "EUR", value: waarde, items } });
}
