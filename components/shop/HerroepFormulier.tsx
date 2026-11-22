"use client";

import { useState } from "react";

// Herroepingsfunctie: geen account nodig, alleen de velden die nodig zijn om de
// bestelling te vinden. De reden is altijd optioneel. De knop heet
// "Herroeping bevestigen", zoals de wet voorschrijft.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINKEL_EMAIL = "info@japandi-stijl.nl";

type Status = "invullen" | "bezig" | "klaar" | "terugval";

export default function HerroepFormulier() {
  const [v, setV] = useState({ naam: "", email: "", bestelnummer: "", producten: "", reden: "" });
  const [status, setStatus] = useState<Status>("invullen");
  const [tijdstip, setTijdstip] = useState("");
  const [fout, setFout] = useState("");

  const zet = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV({ ...v, [k]: e.target.value });

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (!v.naam.trim() || !EMAIL.test(v.email.trim()) || !v.bestelnummer.trim()) {
      setFout("Vul je naam, een geldig e-mailadres en je bestelnummer in.");
      return;
    }
    setFout("");
    setStatus("bezig");
    try {
      const r = await fetch("/api/herroepen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const d = await r.json();
      setTijdstip(d.tijdstip ?? "");
      setStatus(d.ok ? "klaar" : "terugval");
    } catch {
      setStatus("terugval");
    }
  }

  const veld = "mt-1 w-full rounded-lg border border-lijn bg-papier px-4 py-3 text-base focus:border-walnoot focus:outline-none";

  if (status === "klaar") {
    return (
      <div className="rounded-2xl bg-papier p-6 shadow-sm">
        <p className="font-display text-2xl">Je herroeping is ontvangen</p>
        <p className="mt-3">
          We hebben je herroeping voor bestelling <strong>{v.bestelnummer}</strong> ontvangen
          {tijdstip ? ` op ${tijdstip}` : ""}. Je krijgt een bevestiging per e-mail op {v.email}. Binnen 2 werkdagen
          mailen we je het retouradres.
        </p>
      </div>
    );
  }

  if (status === "terugval") {
    const onderwerp = `Herroeping bestelling ${v.bestelnummer}`;
    const tekst = `Ik herroep hierbij de overeenkomst voor de volgende bestelling.\n\nNaam: ${v.naam}\nE-mail: ${v.email}\nBestelnummer: ${v.bestelnummer}\nProducten: ${v.producten || "hele bestelling"}\n${v.reden ? `Reden: ${v.reden}\n` : ""}`;
    const link = `mailto:${WINKEL_EMAIL}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(tekst)}`;
    return (
      <div className="rounded-2xl bg-papier p-6 shadow-sm">
        <p className="font-display text-2xl">Nog een stap: verstuur je melding per e-mail</p>
        <p className="mt-3">
          Het automatisch versturen lukte op dit moment niet. Je melding is daarom nog niet bij ons binnen. Klik op de
          knop hieronder: je e-mailprogramma opent met je herroeping al ingevuld. De datum van je e-mail telt als het
          moment van herroepen.
        </p>
        <a href={link} className="mt-5 inline-flex rounded-full bg-walnoot px-6 py-3 text-papier">
          Herroeping mailen
        </a>
        <p className="mt-4 text-sm text-klei">Of mail zelf naar {WINKEL_EMAIL} met je naam en bestelnummer.</p>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur} className="rounded-2xl bg-papier p-6 shadow-sm" noValidate>
      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-medium">Naam</span>
          <input className={veld} value={v.naam} onChange={zet("naam")} autoComplete="name" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium">E-mailadres</span>
          <input className={veld} type="email" value={v.email} onChange={zet("email")} autoComplete="email" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Bestelnummer</span>
          <input className={veld} value={v.bestelnummer} onChange={zet("bestelnummer")} placeholder="Bijvoorbeeld #1001" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Welke producten stuur je terug? (optioneel)</span>
          <textarea className={veld} rows={2} value={v.producten} onChange={zet("producten")} placeholder="Leeg laten als het om de hele bestelling gaat" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Reden (optioneel)</span>
          <textarea className={veld} rows={2} value={v.reden} onChange={zet("reden")} />
        </label>
      </div>
      {fout && <p className="mt-4 text-sm text-terracotta">{fout}</p>}
      <button
        type="submit"
        disabled={status === "bezig"}
        className="mt-6 w-full rounded-full bg-walnoot px-6 py-4 text-base text-papier disabled:opacity-60"
      >
        {status === "bezig" ? "Bezig met versturen..." : "Herroeping bevestigen"}
      </button>
      <p className="mt-3 text-sm text-klei">Je hoeft geen account te hebben en geen reden op te geven.</p>
    </form>
  );
}
