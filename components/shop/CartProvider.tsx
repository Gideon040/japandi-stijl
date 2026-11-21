"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart } from "@/lib/shopify";

// Winkelwagen-state voor de hele site. Wordt pas na het laden in de browser
// opgehaald via /api/cart/, zodat de pagina's zelf statisch blijven.

type CartContext = {
  cart: Cart | null;
  open: boolean;
  bezig: boolean;
  fout: string | null;
  zetOpen: (open: boolean) => void;
  voegToe: (variantId: string, aantal?: number) => Promise<boolean>;
  wijzig: (regelId: string, aantal: number) => Promise<void>;
  verwijder: (regelId: string) => Promise<void>;
};

const Ctx = createContext<CartContext | null>(null);

const ROUTE = "/api/cart/";
const FOUTMELDING = "Dat lukte niet. Probeer het zo nog een keer.";

async function stuur(body: object): Promise<Cart | null> {
  const res = await fetch(ROUTE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(String(res.status));
  return ((await res.json()) as { cart: Cart | null }).cart;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, zetOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    let actief = true;
    fetch(ROUTE)
      .then((r) => (r.ok ? r.json() : { cart: null }))
      .then((d: { cart: Cart | null }) => actief && setCart(d.cart))
      .catch(() => {});
    return () => {
      actief = false;
    };
  }, []);

  const voer = useCallback(async (body: object): Promise<boolean> => {
    setBezig(true);
    setFout(null);
    try {
      setCart(await stuur(body));
      return true;
    } catch {
      setFout(FOUTMELDING);
      return false;
    } finally {
      setBezig(false);
    }
  }, []);

  const waarde = useMemo<CartContext>(
    () => ({
      cart,
      open,
      bezig,
      fout,
      zetOpen,
      voegToe: async (variantId, aantal = 1) => {
        const gelukt = await voer({ actie: "voegtoe", variantId, aantal });
        zetOpen(true);
        return gelukt;
      },
      wijzig: async (regelId, aantal) => {
        await voer({ actie: "wijzig", regelId, aantal });
      },
      verwijder: async (regelId) => {
        await voer({ actie: "verwijder", regelId });
      },
    }),
    [cart, open, bezig, fout, voer]
  );

  return <Ctx.Provider value={waarde}>{children}</Ctx.Provider>;
}

export function useCart(): CartContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart hoort binnen CartProvider");
  return ctx;
}
