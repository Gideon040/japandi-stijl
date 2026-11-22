import { NextResponse } from "next/server";
import { BEDRIJF } from "@/lib/bedrijf";

// Herroepingsfunctie (art. 6:230oa BW). Ontvangt de melding, mailt de winkel
// en stuurt de consument direct een ontvangstbevestiging. Mailen gaat via
// Resend als RESEND_API_KEY is gezet (afzender: HERROEP_AFZENDER, bijv.
// "japandi-stijl.nl <bestellingen@japandi-stijl.nl>"). Zonder sleutel geeft de
// route "geen-mail" terug en toont het formulier een kant-en-klare e-mail als
// terugvaloptie, zodat de melding nooit verloren gaat.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function schoon(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function escape(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

async function stuur(sleutel: string, afzender: string, aan: string, onderwerp: string, html: string, antwoordAan?: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${sleutel}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: afzender, to: [aan], subject: onderwerp, html, ...(antwoordAan ? { reply_to: antwoordAan } : {}) }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}`);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reden: "ongeldig" }, { status: 400 });
  }
  const naam = schoon(body.naam, 120);
  const email = schoon(body.email, 200);
  const bestelnummer = schoon(body.bestelnummer, 60);
  const producten = schoon(body.producten, 1000);
  const reden = schoon(body.reden, 1000);
  if (!naam || !EMAIL.test(email) || !bestelnummer) {
    return NextResponse.json({ ok: false, reden: "velden" }, { status: 400 });
  }

  const tijdstip = new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam", dateStyle: "long", timeStyle: "short" });
  const sleutel = process.env.RESEND_API_KEY;
  const afzender = process.env.HERROEP_AFZENDER ?? `japandi-stijl.nl <${BEDRIJF.email}>`;
  if (!sleutel) {
    console.warn("[herroepen] RESEND_API_KEY ontbreekt, melding niet gemaild", { bestelnummer, tijdstip });
    return NextResponse.json({ ok: false, reden: "geen-mail", tijdstip }, { status: 503 });
  }

  const rijen = [
    ["Naam", naam],
    ["E-mail", email],
    ["Bestelnummer", bestelnummer],
    ["Producten", producten || "Hele bestelling"],
    ["Reden (optioneel)", reden || "Niet opgegeven"],
    ["Ontvangen op", tijdstip],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#7a6a5a">${k}</td><td style="padding:4px 0">${escape(v)}</td></tr>`)
    .join("");

  const klant = `<p>Beste ${escape(naam)},</p>
<p>We hebben je herroeping ontvangen op ${tijdstip}. Hiermee bevestigen we dat je de overeenkomst voor bestelling <strong>${escape(bestelnummer)}</strong> hebt herroepen.</p>
<table>${rijen}</table>
<p>Hoe het verder gaat: binnen 2 werkdagen mailen we je het retouradres. Stuur het product binnen 14 dagen na vandaag terug, compleet en zo veel mogelijk in de originele verpakking. Je krijgt je betaling, inclusief de standaard bezorgkosten, binnen 14 dagen terug; we mogen wachten tot het product bij ons terug is of tot je laat zien dat je het hebt verstuurd.</p>
<p>Vragen? Antwoord gewoon op deze e-mail.</p>
<p>Groet,<br>japandi-stijl.nl<br>${escape(BEDRIJF.naam)}, ${escape(BEDRIJF.adres)}, ${escape(BEDRIJF.postcode)} ${escape(BEDRIJF.plaats)}</p>`;

  const winkel = `<p>Nieuwe herroeping via de website.</p><table>${rijen}</table><p>Stuur de klant binnen 2 werkdagen het retouradres.</p>`;

  try {
    await stuur(sleutel, afzender, email, `Ontvangstbevestiging herroeping bestelling ${bestelnummer}`, klant, BEDRIJF.email);
    await stuur(sleutel, afzender, BEDRIJF.email, `Herroeping bestelling ${bestelnummer} (${naam})`, winkel, email);
  } catch (e) {
    console.error("[herroepen] mailen mislukt", e);
    return NextResponse.json({ ok: false, reden: "geen-mail", tijdstip }, { status: 502 });
  }
  return NextResponse.json({ ok: true, tijdstip });
}
