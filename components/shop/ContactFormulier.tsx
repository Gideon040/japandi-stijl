"use client";

import { useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINKEL_EMAIL = "info@japandi-stijl.nl";

export default function ContactFormulier() {
  const [v, setV] = useState({ naam: "", email: "", bestelnummer: "", bericht: "", website: "" });
  const [status, setStatus] = useState<"invullen" | "bezig" | "klaar" | "fout">("invullen");
  const [fout, setFout] = useState("");
  const zet = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (!v.naam.trim() || !EMAIL.test(v.email.trim()) || v.bericht.trim().length < 2) {
      setFout("Vul je naam, een geldig e-mailadres en je bericht in.");
      return;
    }
    setFout("");
    setStatus("bezig");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      setStatus((await r.json()).ok ? "klaar" : "fout");
    } catch {
      setStatus("fout");
    }
  }

  const veld = "mt-1 w-full rounded-lg border border-lijn bg-papier px-4 py-3 text-base focus:border-walnoot focus:outline-none";

  if (status === "klaar")
    return (
      <div className="not-prose rounded-2xl bg-papier p-6 shadow-sm">
        <p className="font-display text-2xl">Bedankt, je bericht is verstuurd</p>
        <p className="mt-3">We reageren meestal binnen een paar werkdagen op {v.email}.</p>
      </div>
    );

  return (
    <form onSubmit={verstuur} className="not-prose rounded-2xl bg-papier p-6 shadow-sm" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Naam</span>
          <input className={veld} value={v.naam} onChange={zet("naam")} autoComplete="name" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">E-mailadres</span>
          <input className={veld} type="email" value={v.email} onChange={zet("email")} autoComplete="email" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Bestelnummer (als het over een bestelling gaat)</span>
          <input className={veld} value={v.bestelnummer} onChange={zet("bestelnummer")} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Je bericht</span>
          <textarea className={veld} rows={5} value={v.bericht} onChange={zet("bericht")} />
        </label>
        <input type="text" name="website" value={v.website} onChange={zet("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>
      {fout && <p className="mt-4 text-sm text-terracotta">{fout}</p>}
      {status === "fout" && (
        <p className="mt-4 text-sm text-terracotta">
          Versturen lukte niet. Mail je bericht dan naar <a className="underline" href={`mailto:${WINKEL_EMAIL}`}>{WINKEL_EMAIL}</a>.
        </p>
      )}
      <button type="submit" disabled={status === "bezig"} className="mt-6 rounded-full bg-walnoot px-6 py-3 text-papier disabled:opacity-60">
        {status === "bezig" ? "Bezig met versturen..." : "Verstuur bericht"}
      </button>
    </form>
  );
}
