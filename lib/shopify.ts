import "server-only";

// Koppeling met Shopify als winkel-backend (producten, winkelwagen, checkout).
// Alle aanroepen lopen via de server: de browser praat alleen met onze eigen
// route /api/cart/. Een eventueel privetoken blijft daardoor altijd server-side.
//
// Belangrijk: elke functie faalt zacht. Is Shopify onbereikbaar of bestaat een
// product niet, dan komt er null of een lege lijst terug en rendert de pagina
// gewoon zonder dat blok. Een storing bij Shopify mag de gidsen nooit breken.

const DOMEIN = process.env.SHOPIFY_STORE_DOMAIN ?? "96jvwf-ek.myshopify.com";
const API_VERSIE = process.env.SHOPIFY_API_VERSION ?? "2026-07";
// Optioneel. Zonder token gebruikt de koppeling de tokenloze toegang van de
// Storefront API (producten en winkelwagen). NOOIT een NEXT_PUBLIC_-prefix.
const PRIVE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "";

const ENDPOINT = `https://${DOMEIN}/api/${API_VERSIE}/graphql.json`;

export const STANDAARD_LEVERTIJD = "Levertijd 5 tot 10 werkdagen";

export type Geld = { amount: string; currencyCode: string };
export type Beeld = { url: string; altText: string | null; width?: number; height?: number };

export type ShopVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Geld;
  compareAtPrice: Geld | null;
  selectedOptions: { name: string; value: string }[];
  image: Beeld | null;
};

export type ShopProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  updatedAt: string;
  featuredImage: Beeld | null;
  images: Beeld[];
  variants: ShopVariant[];
  levertijd: string;
  afmetingen: string | null;
  materiaal: string | null;
  seoTitel: string | null;
  seoBeschrijving: string | null;
};

export type CartRegel = {
  id: string;
  quantity: number;
  totaal: Geld;
  variantId: string;
  variantTitel: string;
  productTitel: string;
  productHandle: string;
  beeld: Beeld | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotaal: Geld;
  regels: CartRegel[];
};

type FetchOpties = { revalidate?: number; tags?: string[]; cache?: RequestCache };

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opties: FetchOpties = {}
): Promise<T | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (PRIVE_TOKEN) headers["Shopify-Storefront-Private-Token"] = PRIVE_TOKEN;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      ...(opties.cache
        ? { cache: opties.cache }
        : { next: { revalidate: opties.revalidate ?? 300, tags: opties.tags } }),
    });
    if (!res.ok) {
      console.warn(`[shopify] HTTP ${res.status} op ${ENDPOINT}`);
      return null;
    }
    const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
    if (json.errors?.length) {
      console.warn(`[shopify] ${json.errors.map((e) => e.message).join("; ")}`);
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    console.warn(`[shopify] onbereikbaar: ${(err as Error).message}`);
    return null;
  }
}

// ---------- Producten ----------

const BEELD = `url altText width height`;

const PRODUCT_VELDEN = `
  id handle title vendor description descriptionHtml availableForSale updatedAt
  featuredImage { ${BEELD} }
  images(first: 10) { nodes { ${BEELD} } }
  variants(first: 50) {
    nodes {
      id title availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      image { ${BEELD} }
    }
  }
  levertijd: metafield(namespace: "custom", key: "levertijd") { value }
  afmetingen: metafield(namespace: "custom", key: "afmetingen") { value }
  materiaal: metafield(namespace: "custom", key: "materiaal") { value }
  seo { title description }
`;

type RuwProduct = Omit<
  ShopProduct,
  "images" | "variants" | "levertijd" | "afmetingen" | "materiaal" | "seoTitel" | "seoBeschrijving"
> & {
  images: { nodes: Beeld[] };
  variants: { nodes: ShopVariant[] };
  levertijd: { value: string } | null;
  afmetingen: { value: string } | null;
  materiaal: { value: string } | null;
  seo: { title: string | null; description: string | null } | null;
};

function vormProduct(p: RuwProduct): ShopProduct {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    availableForSale: p.availableForSale,
    updatedAt: p.updatedAt,
    featuredImage: p.featuredImage,
    images: p.images.nodes,
    variants: p.variants.nodes,
    levertijd: p.levertijd?.value?.trim() || STANDAARD_LEVERTIJD,
    afmetingen: p.afmetingen?.value?.trim() || null,
    materiaal: p.materiaal?.value?.trim() || null,
    seoTitel: p.seo?.title || null,
    seoBeschrijving: p.seo?.description || null,
  };
}

export async function getProduct(handle: string): Promise<ShopProduct | null> {
  const data = await shopifyFetch<{ product: RuwProduct | null }>(
    `query Product($handle: String!) @inContext(country: NL, language: NL) {
      product(handle: $handle) { ${PRODUCT_VELDEN} }
    }`,
    { handle },
    { tags: ["shopify-producten", `shopify-product-${handle}`] }
  );
  return data?.product ? vormProduct(data.product) : null;
}

// Alle gepubliceerde producten, voor generateStaticParams en de sitemap.
export async function getAlleProductHandles(): Promise<{ handle: string; updatedAt: string }[]> {
  const uit: { handle: string; updatedAt: string }[] = [];
  let cursor: string | null = null;
  for (let pagina = 0; pagina < 10; pagina++) {
    const data: {
      products: {
        nodes: { handle: string; updatedAt: string }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } | null = await shopifyFetch(
      `query Handles($cursor: String) {
        products(first: 250, after: $cursor) {
          nodes { handle updatedAt }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { cursor },
      { tags: ["shopify-producten"] }
    );
    if (!data) break;
    uit.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return uit;
}

export function laagstePrijs(p: ShopProduct): Geld | null {
  if (!p.variants.length) return null;
  return p.variants.reduce((laagst, v) =>
    Number(v.price.amount) < Number(laagst.price.amount) ? v : laagst
  ).price;
}

// ---------- Winkelwagen ----------

const CART_VELDEN = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    nodes {
      id quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id title
          image { ${BEELD} }
          product { handle title featuredImage { ${BEELD} } }
        }
      }
    }
  }
`;

type RuweCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Geld };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Geld };
      merchandise: {
        id: string;
        title: string;
        image: Beeld | null;
        product: { handle: string; title: string; featuredImage: Beeld | null };
      };
    }[];
  };
};

function vormCart(c: RuweCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotaal: c.cost.subtotalAmount,
    regels: c.lines.nodes.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      totaal: l.cost.totalAmount,
      variantId: l.merchandise.id,
      variantTitel: l.merchandise.title,
      productTitel: l.merchandise.product.title,
      productHandle: l.merchandise.product.handle,
      beeld: l.merchandise.image ?? l.merchandise.product.featuredImage,
    })),
  };
}

type CartMutatie = { cart: RuweCart | null; userErrors: { message: string }[] };

function uitMutatie(m: CartMutatie | undefined, naam: string): Cart | null {
  if (!m) return null;
  if (m.userErrors?.length) {
    console.warn(`[shopify] ${naam}: ${m.userErrors.map((e) => e.message).join("; ")}`);
  }
  return m.cart ? vormCart(m.cart) : null;
}

const IN_NL = `@inContext(country: NL, language: NL)`;

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RuweCart | null }>(
    `query Cart($id: ID!) ${IN_NL} { cart(id: $id) { ${CART_VELDEN} } }`,
    { id: cartId },
    { cache: "no-store" }
  );
  return data?.cart ? vormCart(data.cart) : null;
}

export async function maakCart(variantId: string, quantity: number): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartCreate: CartMutatie }>(
    `mutation Maak($input: CartInput!) ${IN_NL} {
      cartCreate(input: $input) { cart { ${CART_VELDEN} } userErrors { message } }
    }`,
    { input: { lines: [{ merchandiseId: variantId, quantity }] } },
    { cache: "no-store" }
  );
  return uitMutatie(data?.cartCreate, "cartCreate");
}

export async function voegToe(cartId: string, variantId: string, quantity: number): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutatie }>(
    `mutation Voeg($cartId: ID!, $lines: [CartLineInput!]!) ${IN_NL} {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_VELDEN} } userErrors { message } }
    }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    { cache: "no-store" }
  );
  return uitMutatie(data?.cartLinesAdd, "cartLinesAdd");
}

export async function wijzigAantal(cartId: string, lineId: string, quantity: number): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutatie }>(
    `mutation Wijzig($cartId: ID!, $lines: [CartLineUpdateInput!]!) ${IN_NL} {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_VELDEN} } userErrors { message } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
    { cache: "no-store" }
  );
  return uitMutatie(data?.cartLinesUpdate, "cartLinesUpdate");
}

export async function verwijderRegel(cartId: string, lineId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutatie }>(
    `mutation Verwijder($cartId: ID!, $lineIds: [ID!]!) ${IN_NL} {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_VELDEN} } userErrors { message } }
    }`,
    { cartId, lineIds: [lineId] },
    { cache: "no-store" }
  );
  return uitMutatie(data?.cartLinesRemove, "cartLinesRemove");
}
