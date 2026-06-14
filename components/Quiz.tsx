"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  VRAGEN,
  PROFIELEN,
  RUIMTE_LABEL,
  ruimteLinks,
  legeScores,
  bepaalProfiel,
  grootteTip,
  kinderenTip,
  budgetTip,
  type ProfielId,
} from "@/lib/quiz";

// Keuzes: vraag-id -> gekozen antwoord-indexen. Eenkeuze heeft altijd [i],
// de ruimtes-vraag kan er meerdere bevatten.
type Keuzes = Record<string, number[]>;

type Resultaat = {
  profiel: ProfielId;
  ruimtes: string[];
  grootte?: string;
  kinderen?: string;
  budget?: string;
};

const PROFIEL_IDS: ProfielId[] = ["licht", "walnoot", "wabisabi"];

function isProfiel(v: string | null): v is ProfielId {
  return v !== null && (PROFIEL_IDS as string[]).includes(v);
}

// Beeldtegel die het webp-bestand probeert en netjes terugvalt op de
// kleurstaal als het beeld nog niet bestaat. Zo werkt de quiz al voordat de
// textuurbeelden gegenereerd zijn.
function Tegel({ id, swatch, label }: { id: string; swatch: string; label: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div>
      <div
        className="aspect-square rounded-sm overflow-hidden bg-zand"
        style={ok ? undefined : { background: swatch }}
      >
        {ok && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/${id}.webp`}
            alt={label}
            loading="lazy"
            onError={() => setOk(false)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <span className="mt-2 block text-sm text-inkt">{label}</span>
    </div>
  );
}

// Voorbeeldkamer per profiel en ruimte uit content/image-manifest-quiz.json.
// Valt terug op een labelvak zolang het beeld nog niet gegenereerd is.
function RuimteBeeld({
  profiel,
  ruimte,
  label,
  profielNaam,
}: {
  profiel: ProfielId;
  ruimte: string;
  label: string;
  profielNaam: string;
}) {
  const [ok, setOk] = useState(true);
  const id = `quiz-${profiel}-${ruimte}`;
  return (
    <div className="aspect-[4/3] rounded-sm overflow-hidden bg-zand border border-lijn flex items-center justify-center mb-3">
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/${id}.webp`}
          alt={`Voorbeeld van een Japandi ${label.toLowerCase()} in stijl ${profielNaam}`}
          loading="lazy"
          onError={() => setOk(false)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-klei text-sm px-4 text-center">
          Voorbeeld {label.toLowerCase()} in {profielNaam}
        </span>
      )}
    </div>
  );
}

// Kleurstaal die de bijbehorende textuurfoto inlaadt zodra die bestaat en
// anders op de effen kleur terugvalt.
function Staal({ swatch, textuurId }: { swatch: string; textuurId?: string }) {
  const [ok, setOk] = useState(Boolean(textuurId));
  return (
    <span
      aria-hidden
      className="inline-block w-9 h-9 rounded-sm border border-lijn shrink-0 overflow-hidden"
      style={{ background: swatch }}
    >
      {textuurId && ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/${textuurId}.webp`}
          alt=""
          loading="lazy"
          onError={() => setOk(false)}
          className="w-full h-full object-cover"
        />
      )}
    </span>
  );
}

// Groter paletvak zodat de kleur als textuur goed zichtbaar is.
function PaletVak({ swatch, naam, textuurId }: { swatch: string; naam: string; textuurId?: string }) {
  const [ok, setOk] = useState(Boolean(textuurId));
  return (
    <div className="w-20">
      <div
        className="aspect-square rounded-sm border border-lijn overflow-hidden"
        style={{ background: swatch }}
      >
        {textuurId && ok && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/${textuurId}.webp`}
            alt={naam}
            loading="lazy"
            onError={() => setOk(false)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <span className="mt-1.5 block text-xs leading-tight text-inkt">{naam}</span>
    </div>
  );
}

export default function Quiz({ schrijfUrl = true, vol = false }: { schrijfUrl?: boolean; vol?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();

  const [stap, setStap] = useState(0);
  const [keuzes, setKeuzes] = useState<Keuzes>({});
  const [resultaat, setResultaat] = useState<Resultaat | null>(null);

  // Gedeelde link openen: ?stijl= bepaalt het profiel, ?ruimtes= de shortlist.
  // Alleen op de losse pagina; in de modal starten we altijd schoon.
  useEffect(() => {
    if (!schrijfUrl) return;
    const stijl = params.get("stijl");
    if (isProfiel(stijl)) {
      const ruimtes = (params.get("ruimtes") ?? "woonkamer")
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r in RUIMTE_LABEL);
      setResultaat({ profiel: stijl, ruimtes: ruimtes.length ? ruimtes : ["woonkamer"] });
    }
    // Alleen bij eerste render uitlezen; daarna stuurt de quiz zelf de URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vraag = VRAGEN[stap];
  const totaal = VRAGEN.length;

  function rond(volledig: Keuzes) {
    const scores = legeScores();
    for (const v of VRAGEN) {
      if (v.soort !== "stijl") continue;
      for (const i of volledig[v.id] ?? []) {
        const p = v.antwoorden[i].punten;
        if (p) for (const k of Object.keys(p) as ProfielId[]) scores[k] += p[k] ?? 0;
      }
    }
    const profiel = bepaalProfiel(scores);

    const ruimteVraag = VRAGEN.find((v) => v.id === "ruimtes")!;
    const ruimtes = (volledig["ruimtes"] ?? [])
      .map((i) => ruimteVraag.antwoorden[i].waarde)
      .filter((w): w is string => Boolean(w));
    const def = ruimtes.length ? ruimtes : ["woonkamer"];

    const grootte = waardeVanIn(volledig, "grootte");
    const kinderen = waardeVanIn(volledig, "kinderen");
    const budget = waardeVanIn(volledig, "budget");

    setResultaat({ profiel, ruimtes: def, grootte, kinderen, budget });
    if (schrijfUrl) {
      const q = new URLSearchParams({ stijl: profiel, ruimtes: def.join(",") });
      router.replace(`/japandi-quiz/?${q.toString()}`, { scroll: false });
    }
  }

  function waardeVanIn(k: Keuzes, id: string): string | undefined {
    const v = VRAGEN.find((x) => x.id === id);
    const i = k[id]?.[0];
    return i != null ? v?.antwoorden[i].waarde : undefined;
  }

  function kiesEnkel(i: number) {
    const next = { ...keuzes, [vraag.id]: [i] };
    setKeuzes(next);
    if (stap + 1 < totaal) setStap(stap + 1);
    else rond(next);
  }

  function wisselMeer(i: number) {
    const huidig = keuzes[vraag.id] ?? [];
    const next = huidig.includes(i) ? huidig.filter((x) => x !== i) : [...huidig, i];
    setKeuzes({ ...keuzes, [vraag.id]: next });
  }

  function verder() {
    if (stap + 1 < totaal) setStap(stap + 1);
    else rond(keuzes);
  }

  function opnieuw() {
    setKeuzes({});
    setStap(0);
    setResultaat(null);
    if (schrijfUrl) router.replace("/japandi-quiz/", { scroll: false });
  }

  if (resultaat) return <ResultaatBlok r={resultaat} onOpnieuw={opnieuw} vol={vol} />;

  const gekozen = keuzes[vraag.id] ?? [];
  const meerkeuze = vraag.meerkeuze === true;

  return (
    <div className="max-w-content mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-klei mb-2">
          <span>
            Vraag {stap + 1} van {totaal}
          </span>
          {stap > 0 && (
            <button
              type="button"
              onClick={() => setStap(stap - 1)}
              className="text-walnoot hover:underline underline-offset-4"
            >
              &larr; Vorige
            </button>
          )}
        </div>
        <div className="h-1 rounded-full bg-lijn overflow-hidden">
          <div
            className="h-full bg-walnoot transition-all"
            style={{ width: `${((stap + 1) / totaal) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl text-inkt mb-2">{vraag.vraag}</h2>
      {vraag.hint && <p className="text-klei text-sm mb-6">{vraag.hint}</p>}
      {!vraag.hint && <div className="mb-6" />}

      <div className="grid gap-3">
        {vraag.antwoorden.map((a, i) => {
          const actief = gekozen.includes(i);
          return (
            <button
              key={a.label}
              type="button"
              onClick={() => (meerkeuze ? wisselMeer(i) : kiesEnkel(i))}
              aria-pressed={meerkeuze ? actief : undefined}
              className={`w-full text-left rounded-sm border px-4 py-3 flex items-center gap-3 transition-colors ${
                actief
                  ? "border-walnoot bg-zand"
                  : "border-lijn bg-papier hover:border-walnoot hover:bg-zand"
              }`}
            >
              {a.swatch && <Staal swatch={a.swatch} textuurId={a.textuurId} />}
              <span className="min-w-0">
                <span className="block font-display text-lg text-inkt">{a.label}</span>
                {a.sub && <span className="block text-sm text-klei">{a.sub}</span>}
              </span>
              {meerkeuze && (
                <span
                  className={`ml-auto shrink-0 w-5 h-5 rounded-sm border flex items-center justify-center text-xs ${
                    actief ? "bg-walnoot border-walnoot text-papier" : "border-lijn text-transparent"
                  }`}
                  aria-hidden
                >
                  &#10003;
                </span>
              )}
            </button>
          );
        })}
      </div>

      {meerkeuze && (
        <button
          type="button"
          onClick={verder}
          disabled={gekozen.length === 0}
          className="knop-pill bg-walnoot mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {stap + 1 < totaal ? "Verder" : "Bekijk mijn profiel"}
        </button>
      )}
    </div>
  );
}

function ResultaatBlok({ r, onOpnieuw, vol = false }: { r: Resultaat; onOpnieuw: () => void; vol?: boolean }) {
  const p = PROFIELEN[r.profiel];
  const tips = useMemo(
    () => [grootteTip(r.grootte), kinderenTip(r.kinderen), budgetTip(r.budget)].filter(Boolean) as string[],
    [r.grootte, r.kinderen, r.budget],
  );

  return (
    <div className={vol ? "w-full" : "max-w-content mx-auto"}>
      <p className="text-klei text-sm uppercase tracking-wide mb-1">{p.aanloop}</p>
      <h2 className="font-display text-3xl sm:text-4xl text-inkt mb-4">{p.naam}</h2>
      <p className="text-[17px] leading-relaxed text-inkt mb-10">{p.omschrijving}</p>

      <h3 className="font-display text-2xl text-inkt mb-5">Jouw texturen</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {p.texturen.map((t) => (
          <Tegel key={t.id} id={t.id} swatch={t.swatch} label={t.label} />
        ))}
      </div>

      <h3 className="font-display text-2xl text-inkt mb-5">Je kleurenpalet</h3>
      <div className="flex flex-wrap gap-4 mb-12">
        {p.palet.map((k) => (
          <PaletVak key={k.naam} swatch={k.swatch} naam={k.naam} textuurId={k.textuurId} />
        ))}
      </div>

      <h3 className="font-display text-2xl text-inkt mb-5">Materialen die passen</h3>
      <ul className="mb-12 grid sm:grid-cols-2 gap-x-8">
        {p.materialen.map((m) => (
          <li key={m} className="text-[17px] text-inkt list-disc ml-5 mb-2">
            {m}
          </li>
        ))}
      </ul>

      <h3 className="font-display text-2xl text-inkt mb-5">Wat ik zou vermijden</h3>
      <div className="grid gap-3 mb-12">
        {p.vermijd.map((v) => (
          <div key={v.naam} className="flex items-start gap-3 rounded-sm border border-lijn bg-papier px-4 py-3">
            <Staal swatch={v.swatch} textuurId={v.textuurId} />
            <span>
              <span className="block font-display text-lg text-inkt">{v.naam}</span>
              <span className="block text-sm text-klei">{v.reden}</span>
            </span>
          </div>
        ))}
      </div>

      {tips.length > 0 && (
        <>
          <h3 className="font-display text-2xl text-inkt mb-5">Voor jouw situatie</h3>
          <div className="grid gap-3 mb-12">
            {tips.map((t) => (
              <p key={t} className="text-[17px] leading-relaxed text-inkt rounded-sm bg-zand px-4 py-3">
                {t}
              </p>
            ))}
          </div>
        </>
      )}

      <h3 className="font-display text-2xl text-inkt mb-5">Aan de slag per ruimte</h3>
      <p className="text-klei text-sm mb-6">
        Concrete koopgidsen voor de ruimtes die je koos, afgestemd op jouw profiel.
      </p>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10 mb-12">
        {r.ruimtes.map((ruimte) => (
          <div key={ruimte}>
            <RuimteBeeld
              profiel={r.profiel}
              ruimte={ruimte}
              label={RUIMTE_LABEL[ruimte]}
              profielNaam={p.naam}
            />
            <h4 className="font-display text-lg text-walnoot mb-3">{RUIMTE_LABEL[ruimte]}</h4>
            <ul className="grid gap-1">
              {ruimteLinks(r.profiel, ruimte).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-inkt underline decoration-lijn underline-offset-4 hover:decoration-walnoot"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button type="button" onClick={onOpnieuw} className="knop-pill bg-walnoot">
        Opnieuw doen
      </button>
    </div>
  );
}
