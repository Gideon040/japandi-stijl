// Google Analytics 4 met toestemming vooraf. gtag.js wordt pas geladen nadat
// de bezoeker in de cookiemelding op "Accepteren" klikt; zonder toestemming
// gaat er niets naar Google. De keuze staat in een functionele first-party
// cookie (geen localStorage, projectregel). Alleen op het echte domein, zodat
// previews en localhost de cijfers niet vervuilen.

export const GA_ID = "G-5LXYXDQCG2";
export const CONSENT_COOKIE = "js_cookiekeuze";
const BEWAAR_DAGEN = 180;

type Gtag = (...args: unknown[]) => void;
type Venster = Window & { dataLayer?: unknown[]; gtag?: Gtag; __gaGeladen?: boolean };

export type Keuze = "ja" | "nee" | null;

export function leesKeuze(): Keuze {
  if (typeof document === "undefined") return null;
  const rij = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  const waarde = rij?.split("=")[1];
  return waarde === "ja" || waarde === "nee" ? waarde : null;
}

export function bewaarKeuze(keuze: "ja" | "nee") {
  const tot = new Date(Date.now() + BEWAAR_DAGEN * 864e5).toUTCString();
  document.cookie = `${CONSENT_COOKIE}=${keuze}; expires=${tot}; path=/; SameSite=Lax`;
}

export function opEchtDomein() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "japandi-stijl.nl" || h === "www.japandi-stijl.nl";
}

export function laadAnalytics() {
  if (typeof window === "undefined" || !opEchtDomein()) return;
  const w = window as Venster;
  if (w.__gaGeladen) return;
  w.__gaGeladen = true;
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag() {
    // gtag.js verwacht het arguments-object, geen array.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

// Intrekken: keuze op "nee", de GA-cookies weg en de pagina opnieuw laden zodat
// gtag.js niet meer actief is.
export function trekToestemmingIn() {
  bewaarKeuze("nee");
  const domeinen = ["", "japandi-stijl.nl", ".japandi-stijl.nl"];
  for (const c of document.cookie.split("; ")) {
    const naam = c.split("=")[0];
    if (naam === "_ga" || naam.startsWith("_ga_")) {
      for (const d of domeinen) {
        document.cookie = `${naam}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
      }
    }
  }
  window.location.reload();
}

export function stuurEvent(naam: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Venster;
  if (w.gtag && w.__gaGeladen) w.gtag("event", naam, params);
}
