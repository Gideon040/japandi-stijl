import type { Metadata } from "next";
import Link from "next/link";
import HerroepFormulier from "@/components/shop/HerroepFormulier";
import { BEDRIJF } from "@/lib/bedrijf";

export const metadata: Metadata = {
  title: "Overeenkomst herroepen | japandi-stijl.nl",
  description: "Herroep je bestelling bij japandi-stijl.nl binnen 14 dagen na ontvangst. Zonder account en zonder opgave van reden.",
  alternates: { canonical: "/herroepen/" },
  robots: { index: false, follow: true },
};

export default function HerroepenPagina() {
  return (
    <div className="bg-zand">
      <div className="mx-auto max-w-content px-6 py-14">
        <p className="font-display italic text-klei">Bedenktijd</p>
        <h1 className="font-display text-4xl">Overeenkomst herroepen</h1>
        <p className="mt-4 text-[17px] leading-relaxed">
          Spijt van je aankoop? Je hebt 14 dagen bedenktijd vanaf de dag nadat je het product hebt ontvangen. Vul
          hieronder je gegevens in en klik op <strong>Herroeping bevestigen</strong>. Je krijgt direct een
          ontvangstbevestiging per e-mail.
        </p>
        <div className="mt-8">
          <HerroepFormulier />
        </div>
        <p className="mt-8 text-sm leading-relaxed text-klei">
          Hoe terugsturen en terugbetalen werkt, lees je bij{" "}
          <Link href="/herroepingsrecht/" className="underline hover:text-walnoot">herroepingsrecht en retourneren</Link>.
          Is je product beschadigd of klopt het niet? Dat valt onder de garantie: mail dan naar {BEDRIJF.email}.
        </p>
      </div>
    </div>
  );
}
