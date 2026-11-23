// Meetlaag voor de winkel. De Shopify-pixels meten alleen op de checkout, dus
// de site stuurt zelf de ecommerce-events naar GA4 in het standaardformaat.
// Zonder toestemming in de cookiemelding is gtag niet geladen en gebeurt er
// niets (zie lib/analytics.ts).
import { stuurEvent } from "@/lib/analytics";

type Item = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

export function track(event: "view_item" | "add_to_cart" | "begin_checkout", waarde: number, items: Item[]) {
  stuurEvent(event, { currency: "EUR", value: waarde, items });
}
