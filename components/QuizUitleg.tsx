import { Fragment } from "react";
import Link from "next/link";
import { VRAGEN, PROFIELEN, RUIMTE_LABEL, ruimteLinks, type ProfielId } from "@/lib/quiz";

// Server-side, crawlbare tegenhanger van de interactieve quiz: de tien vragen
// en alle profieluitkomsten staan zo in de initiele HTML, zodat zoekmachines en
// AI-crawlers (die meestal geen JS renderen) de inhoud en de interne links zien.
const PROFIEL_VOLGORDE: ProfielId[] = ["licht", "walnoot", "wabisabi"];
const RUIMTE_VOLGORDE = ["woonkamer", "slaapkamer", "eetkamer", "keuken", "badkamer", "hal"];

export default function QuizUitleg() {
  return (
    <section className="bg-zand">
      <div className="max-w-wide mx-auto px-6 py-12 sm:py-16 prose-japandi">
        <h2>De drie Japandi-profielen</h2>
        <p>
          De stijltest deelt je in bij een van drie richtingen binnen Japandi. Je hoeft de test niet
          te doen om de uitkomsten te lezen: hieronder staat elk profiel met het bijbehorende
          kleurenpalet, de materialen die passen, wat je beter vermijdt en de koopgidsen per ruimte.
        </p>

        {PROFIEL_VOLGORDE.map((id) => {
          const p = PROFIELEN[id];
          return (
            <div key={id}>
              <h3>{p.naam}</h3>
              <p>{p.omschrijving}</p>
              <p>
                <strong>Kleurenpalet:</strong> {p.palet.map((k) => k.naam).join(", ")}.
              </p>
              <p>
                <strong>Materialen die passen:</strong> {p.materialen.join(", ")}.
              </p>
              <p>
                <strong>Beter vermijden:</strong>{" "}
                {p.vermijd.map((v) => `${v.naam} (${v.reden})`).join("; ")}.
              </p>
              <p>
                <strong>Koopgidsen per ruimte:</strong>
              </p>
              <ul>
                {RUIMTE_VOLGORDE.map((r) => (
                  <li key={r}>
                    {RUIMTE_LABEL[r]}:{" "}
                    {ruimteLinks(id, r).map((l, i) => (
                      <Fragment key={l.href}>
                        {i > 0 && ", "}
                        <Link href={l.href}>{l.label}</Link>
                      </Fragment>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <h2>Wat vraagt de stijltest?</h2>
        <p>
          De test bestaat uit tien korte vragen: zes over je smaak in hout, kleur en materiaal, en
          vier over je situatie (welke ruimtes, de grootte, kinderen of huisdieren en je budget).
        </p>
        <ol>
          {VRAGEN.map((v) => (
            <li key={v.id}>{v.vraag}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
