import Link from "next/link";
import { ZEKERHEDEN, type Zekerheid } from "@/lib/winkel";

// Uitklaprijen onder de koopknop: zekerheden met een korte toelichting en een
// snelkoppeling naar de specificaties. Teksten staan in lib/winkel.ts.

function Icoon({ soort }: { soort: Zekerheid["icoon"] | "specs" }) {
  const gemeen = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  if (soort === "selectie")
    return (
      <svg {...gemeen}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l3 3 5-6" />
      </svg>
    );
  if (soort === "bedenktijd")
    return (
      <svg {...gemeen}>
        <path d="M4 12a8 8 0 108-8H7" />
        <path d="M10 1L7 4l3 3" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  if (soort === "slot")
    return (
      <svg {...gemeen}>
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
    );
  if (soort === "specs")
    return (
      <svg {...gemeen}>
        <path d="M5 6h14M5 12h14M5 18h9" />
      </svg>
    );
  return (
    <svg {...gemeen}>
      <path d="M4 5h16v11H9l-5 4V5z" />
    </svg>
  );
}

export default function Zekerheden({ toonSpecs }: { toonSpecs: boolean }) {
  return (
    <div className="mt-6 border-t border-lijn">
      {ZEKERHEDEN.map((z) => (
        <details key={z.titel} className="group border-b border-lijn">
          <summary className="flex items-center gap-3 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="text-walnoot shrink-0">
              <Icoon soort={z.icoon} />
            </span>
            <span className="flex-1 text-[0.95rem]">{z.titel}</span>
            <span className="text-klei text-xl leading-none transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="m-0 pb-4 pl-8 pr-6 text-sm text-klei leading-relaxed">{z.tekst}</p>
        </details>
      ))}
      {toonSpecs && (
        <Link
          href="#specificaties"
          className="flex items-center gap-3 py-3.5 border-b border-lijn no-underline hover:text-walnoot transition-colors"
        >
          <span className="text-walnoot shrink-0">
            <Icoon soort="specs" />
          </span>
          <span className="flex-1 text-[0.95rem]">Bekijk de specificaties</span>
          <span className="text-klei" aria-hidden>
            &#8595;
          </span>
        </Link>
      )}
    </div>
  );
}
