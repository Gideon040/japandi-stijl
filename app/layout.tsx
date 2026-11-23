import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
// import NieuwsbriefPopup from "@/components/NieuwsbriefPopup"; // tijdelijk verborgen
import { getNavigatie } from "@/lib/navigatie";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/components/shop/CartProvider";
import CartPaneel from "@/components/shop/CartPaneel";
import CookieMelding, { CookieInstellingenKnop } from "@/components/CookieMelding";
import { identiteitGraph, SITE_NAAM, SITE_LOCALE, SITE_BESCHRIJVING, ogBeeld } from "@/lib/seo";
import { BEDRIJF, BEDRIJF_REGEL } from "@/lib/bedrijf";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  style: ["normal", "italic"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://japandi-stijl.nl"),
  title: { default: "Japandi-stijl.nl", template: "%s | Japandi-stijl.nl" },
  description: SITE_BESCHRIJVING,
  openGraph: {
    type: "website",
    siteName: SITE_NAAM,
    locale: SITE_LOCALE,
    images: [{ url: ogBeeld() }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = getNavigatie();
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": identiteitGraph() }} />
        <CartProvider>
          <Header nav={nav} />
          <main className="overflow-x-clip">{children}</main>
          <CartPaneel />
        </CartProvider>
        <footer className="border-t border-lijn mt-20 bg-zand">
          <div className="max-w-wide mx-auto px-6 py-12 text-sm">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-sm">
                <Link href="/" className="font-display text-xl">
                  japandi-stijl<span className="text-klei">.nl</span>
                </Link>
                <p className="mt-3 text-klei leading-relaxed">
                  Gids en winkel voor de Japandi interieurstijl. Alles wat we verkopen is
                  uitgekozen op maat, vorm, materiaal en prijs.
                </p>
              </div>
              <nav className="flex flex-col gap-2.5 text-inkt">
                <Link href="/#definitie" className="hover:text-walnoot transition-colors">Wat is Japandi</Link>
                <Link href="/japandi-meubels/" className="hover:text-walnoot transition-colors">Meubels</Link>
                <Link href="/japandi-lamp/" className="hover:text-walnoot transition-colors">Verlichting</Link>
                <Link href="/over-ons/" className="hover:text-walnoot transition-colors">Over ons</Link>
                <Link href="/contact/" className="hover:text-walnoot transition-colors">Contact</Link>
              </nav>
              <nav className="flex flex-col gap-2.5 text-inkt">
                <Link href="/verzending-en-levering/" className="hover:text-walnoot transition-colors">Verzending en levering</Link>
                <Link href="/herroepingsrecht/" className="hover:text-walnoot transition-colors">Retourneren</Link>
                <Link href="/algemene-voorwaarden/" className="hover:text-walnoot transition-colors">Algemene voorwaarden</Link>
                <Link href="/privacyverklaring/" className="hover:text-walnoot transition-colors">Privacy en cookies</Link>
                <CookieInstellingenKnop />
                <Link href="/herroepen/" className="font-medium text-walnoot hover:underline">Overeenkomst herroepen</Link>
              </nav>
            </div>
            <p className="mt-10 pt-6 border-t border-lijn text-klei">
              © {new Date().getFullYear()} japandi-stijl.nl · Gids en winkel voor Japandi. We
              houden geen voorraad en bestellen je product bij de leverancier zodra jij bestelt.
            </p>
            <p className="mt-2 text-klei">
              japandi-stijl.nl is een handelsnaam van {BEDRIJF_REGEL}.{" "}
              <a href={`mailto:${BEDRIJF.email}`} className="underline hover:text-walnoot">{BEDRIJF.email}</a>
              {BEDRIJF.telefoon ? ` · ${BEDRIJF.telefoon}` : ""}
            </p>
          </div>
        </footer>
        <CookieMelding />
        {/* <NieuwsbriefPopup /> tijdelijk verborgen */}
      </body>
    </html>
  );
}
