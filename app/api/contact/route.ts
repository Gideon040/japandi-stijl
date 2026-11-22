import { NextResponse } from "next/server";
import { BEDRIJF } from "@/lib/bedrijf";
import { mailFoutCode, stuurMail, escapeHtml } from "@/lib/mail";

// Contactformulier: mailt het bericht naar de winkelmailbox, met de afzender
// als reply-to, zodat je direct kunt antwoorden. Het veld "website" is een
// honeypot: mensen zien het niet, spambots vullen het wel in.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const schoon = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (schoon(b.website, 200)) return NextResponse.json({ ok: true });
  const naam = schoon(b.naam, 120);
  const email = schoon(b.email, 200);
  const bestelnummer = schoon(b.bestelnummer, 60);
  const bericht = schoon(b.bericht, 4000);
  if (!naam || !EMAIL.test(email) || bericht.length < 2) {
    return NextResponse.json({ ok: false, reden: "velden" }, { status: 400 });
  }
  const html = `<p><strong>${escapeHtml(naam)}</strong> (${escapeHtml(email)})${bestelnummer ? `, bestelling ${escapeHtml(bestelnummer)}` : ""}</p><p>${escapeHtml(bericht).replace(/\n/g, "<br>")}</p>`;
  try {
    await stuurMail({ aan: BEDRIJF.email, onderwerp: `Contactformulier: ${naam}${bestelnummer ? ` (${bestelnummer})` : ""}`, html, antwoordAan: email });
  } catch (e) {
    console.error("[contact] mailen mislukt", e);
    return NextResponse.json({ ok: false, reden: "geen-mail", code: mailFoutCode(e) }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
