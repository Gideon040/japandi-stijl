import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import { getNavigatie } from "@/lib/navigatie";
import JsonLd from "@/components/JsonLd";
import { identiteitGraph, SITE_NAAM, SITE_LOCALE, SITE_BESCHRIJVING, ogBeeld } from "@/lib/seo";

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
        <Header nav={nav} />
        <main className="overflow-x-clip">{children}</main>
        <footer className="border-t border-lijn mt-20 bg-zand">
          <div className="max-w-wide mx-auto px-6 py-12 text-sm">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-sm">
                <Link href="/" className="font-display text-xl">
                  japandi-stijl<span className="text-klei">.nl</span>
                </Link>
                <p className="mt-3 text-klei leading-relaxed">
                  Onafhankelijke gids over de Japandi interieurstijl. We verkopen zelf niets,
                  we helpen je aan het juiste interieuradvies.
                </p>
              </div>
              <nav className="flex flex-col gap-2.5 text-inkt">
                <Link href="/#definitie" className="hover:text-walnoot transition-colors">Wat is Japandi</Link>
                <Link href="/japandi-meubels/" className="hover:text-walnoot transition-colors">Meubels</Link>
                <Link href="/japandi-lamp/" className="hover:text-walnoot transition-colors">Verlichting</Link>
                <Link href="/over-ons/" className="hover:text-walnoot transition-colors">Over ons</Link>
                <Link href="/contact/" className="hover:text-walnoot transition-colors">Contact</Link>
              </nav>
            </div>
            <p className="mt-10 pt-6 border-t border-lijn text-klei">
              © {new Date().getFullYear()} japandi-stijl.nl · Onafhankelijk platform. We verkopen
              zelf niets en wijzen je door naar producten die wij binnen Japandi vinden passen.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
