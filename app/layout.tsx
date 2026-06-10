import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
  description:
    "Onafhankelijke gids over de Japandi interieurstijl: uitleg, inspiratie en eerlijke koopgidsen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="border-b border-lijn">
          <div className="max-w-wide mx-auto px-6 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-y-1">
            <Link href="/" className="font-display text-xl sm:text-2xl">
              japandi-stijl<span className="text-klei">.nl</span>
            </Link>
            <nav className="text-sm flex gap-4 sm:gap-6">
              <Link href="/japandi-stijl/">Wat is Japandi</Link>
              <Link href="/japandi-woonkamer/">Per ruimte</Link>
              <Link href="/japandi-meubels/">Meubels</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-lijn mt-20">
          <div className="max-w-wide mx-auto px-6 py-10 text-sm text-klei">
            <p>
              Japandi-stijl.nl bevat affiliate links naar webwinkels. Zie het over-ons blok op
              elke pagina voor hoe wij selecteren.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
