import { BETAALMETHODES } from "@/lib/winkel";

// Rustige rij met de betaalmethodes, als tekstbadges in de huisstijl.
export default function BetaalLogos({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`} aria-label="Betaalmethodes">
      <span className="sr-only">Betalen met </span>
      {BETAALMETHODES.map((m) => (
        <span
          key={m}
          className="rounded-sm border border-lijn bg-papier px-2 py-0.5 text-[0.7rem] font-medium tracking-wide text-inkt/80"
        >
          {m}
        </span>
      ))}
    </div>
  );
}
