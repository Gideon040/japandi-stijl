import { ZEKERHEDEN, type Zekerheid } from "@/lib/winkel";

// Rustige rij zekerheden onder de koopknop. Teksten staan in lib/winkel.ts.

function Icoon({ soort }: { soort: Zekerheid["icoon"] }) {
  const gemeen = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true,
  } as const;
  if (soort === "selectie")
    return (
      <svg {...gemeen}>
        <path d="M4 12.5l5 5L20 6.5" />
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
  return (
    <svg {...gemeen}>
      <path d="M4 5h16v11H9l-5 4V5z" />
    </svg>
  );
}

export default function Zekerheden() {
  return (
    <ul className="mt-8 pt-6 border-t border-lijn grid gap-4 sm:grid-cols-2 list-none p-0 m-0">
      {ZEKERHEDEN.map((z) => (
        <li key={z.titel} className="flex items-start gap-3 list-none m-0 p-0">
          <span className="text-groen shrink-0 mt-0.5">
            <Icoon soort={z.icoon} />
          </span>
          <span className="text-sm leading-snug">
            <span className="block font-medium text-inkt">{z.titel}</span>
            <span className="block text-klei">{z.tekst}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
