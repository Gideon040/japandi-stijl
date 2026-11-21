import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCart, maakCart, voegToe, wijzigAantal, verwijderRegel, type Cart } from "@/lib/shopify";

// Winkelwagen-route. De browser praat alleen hiermee, nooit direct met Shopify.
// De cart-id staat in een httpOnly-cookie (functioneel, dus geen toestemming
// nodig), niet in localStorage.

const COOKIE = "js_cart";
const VEERTIEN_DAGEN = 60 * 60 * 24 * 14;

export const dynamic = "force-dynamic";

async function zetCookie(cartId: string) {
  (await cookies()).set(COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: VEERTIEN_DAGEN,
  });
}

function antwoord(cart: Cart | null, status = 200) {
  return NextResponse.json({ cart }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return antwoord(null);
  const cart = await getCart(id);
  // Afgerekende of verlopen winkelwagen: cookie opruimen.
  if (!cart) (await cookies()).delete(COOKIE);
  return antwoord(cart);
}

type Opdracht =
  | { actie: "voegtoe"; variantId: string; aantal?: number }
  | { actie: "wijzig"; regelId: string; aantal: number }
  | { actie: "verwijder"; regelId: string };

function isGid(waarde: unknown, soort: string): waarde is string {
  return typeof waarde === "string" && waarde.startsWith(`gid://shopify/${soort}/`) && waarde.length < 200;
}

export async function POST(req: Request) {
  let body: Opdracht;
  try {
    body = (await req.json()) as Opdracht;
  } catch {
    return antwoord(null, 400);
  }

  const id = (await cookies()).get(COOKIE)?.value;

  if (body.actie === "voegtoe") {
    if (!isGid(body.variantId, "ProductVariant")) return antwoord(null, 400);
    const aantal = Math.min(Math.max(Math.floor(Number(body.aantal ?? 1)) || 1, 1), 20);
    let cart = id ? await voegToe(id, body.variantId, aantal) : null;
    // Geen (geldige) winkelwagen meer: nieuwe aanmaken.
    if (!cart) cart = await maakCart(body.variantId, aantal);
    if (!cart) return antwoord(null, 502);
    await zetCookie(cart.id);
    return antwoord(cart);
  }

  if (!id) return antwoord(null, 409);

  if (body.actie === "wijzig") {
    if (!isGid(body.regelId, "CartLine")) return antwoord(null, 400);
    const aantal = Math.min(Math.max(Math.floor(Number(body.aantal)) || 0, 0), 20);
    const cart =
      aantal === 0 ? await verwijderRegel(id, body.regelId) : await wijzigAantal(id, body.regelId, aantal);
    return cart ? antwoord(cart) : antwoord(null, 502);
  }

  if (body.actie === "verwijder") {
    if (!isGid(body.regelId, "CartLine")) return antwoord(null, 400);
    const cart = await verwijderRegel(id, body.regelId);
    return cart ? antwoord(cart) : antwoord(null, 502);
  }

  return antwoord(null, 400);
}
