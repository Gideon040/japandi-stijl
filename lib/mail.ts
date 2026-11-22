import nodemailer from "nodemailer";
import { BEDRIJF } from "@/lib/bedrijf";

// Mail versturen via de eigen mailbox bij Strato (info@japandi-stijl.nl).
// Zet in Vercel: SMTP_USER (het mailadres) en SMTP_PASS (het wachtwoord van
// die mailbox). Host en poort staan standaard op Strato en zijn met SMTP_HOST
// en SMTP_PORT te overschrijven. Zonder SMTP_PASS gooit stuurMail een fout,
// zodat de formulieren hun terugvaloptie tonen.

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  const user = process.env.SMTP_USER ?? BEDRIJF.email;
  const pass = process.env.SMTP_PASS;
  if (!pass) throw new Error("SMTP_PASS ontbreekt");
  if (!transport) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.strato.de",
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return { transport, user };
}

export async function stuurMail(opties: { aan: string; onderwerp: string; html: string; antwoordAan?: string }) {
  const { transport, user } = getTransport();
  await transport.sendMail({
    from: `japandi-stijl.nl <${user}>`,
    to: opties.aan,
    subject: opties.onderwerp,
    html: opties.html,
    ...(opties.antwoordAan ? { replyTo: opties.antwoordAan } : {}),
  });
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

// Korte foutcode voor diagnose (bevat nooit het wachtwoord).
export function mailFoutCode(e: unknown): string {
  const f = e as { code?: string; responseCode?: number; message?: string };
  if (f?.message === "SMTP_PASS ontbreekt") return "GEEN_WACHTWOORD";
  return [f?.code, f?.responseCode].filter(Boolean).join(" ") || "ONBEKEND";
}
