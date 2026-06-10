import type { Config } from "tailwindcss";

// Design tokens naar Eijerkamp-referentie, vertaald voor japandi-stijl.nl
// Warm, rustig, veel beeld. Signatuur: hairline-lijnen als tatami-naden.
const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        zand: "#F5F1EA",      // achtergrondvlakken
        papier: "#FBF9F5",    // basisachtergrond
        inkt: "#2B2520",      // primaire tekst, warm zwartbruin
        klei: "#8C7A68",      // secundaire tekst
        walnoot: "#5C4633",   // accenten, knoppen
        lijn: "#E3DCD0",      // hairlines / tatami-naden
        groen: "#6B7259",     // spaarzaam accent (planten, succes)
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: { content: "44rem", wide: "72rem" },
    },
  },
  plugins: [],
};
export default config;
