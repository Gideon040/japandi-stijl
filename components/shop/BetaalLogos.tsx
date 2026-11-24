import { BETAALMETHODES } from "@/lib/winkel";

// De echte logo's van de betaalmethodes, als losse bestanden in /public/betaal.
// iDEAL en Apple Pay komen uit react-pay-icons (MIT), Visa en Mastercard uit
// payment-icons (MPL-2.0).
export default function BetaalLogos({ className = "" }: { className?: string }) {
  return (
    <ul className={`m-0 flex list-none flex-wrap items-center justify-center gap-1.5 p-0 ${className}`} aria-label="Betaalmethodes">
      {BETAALMETHODES.map((m) => (
        <li key={m.bestand} className="m-0 p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/betaal/${m.bestand}.svg`}
            alt={m.naam}
            width={38}
            height={24}
            className="h-6 w-[38px] rounded-[3px] border border-lijn bg-white object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
