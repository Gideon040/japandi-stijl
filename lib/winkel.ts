// Vaste winkelteksten op een plek: de uitklaprijen onder de koopknop en de
// uitleg over levering en retour op de productpagina. Alleen beloftes die we
// waarmaken: geen keurmerken, reviewscores of gratis-verzendclaims die niet
// bestaan. Verzendkosten en retourkosten staan hier bewust nog niet in; vul ze
// aan zodra ze in Shopify zijn ingesteld.

export type Zekerheid = { titel: string; tekst: string; icoon: "selectie" | "bedenktijd" | "slot" | "vraag" };

export const ZEKERHEDEN: Zekerheid[] = [
  {
    icoon: "selectie",
    titel: "Door ons uitgekozen",
    tekst:
      "We nemen een product alleen op als materiaal, vorm en kleur bij Japandi passen. Wat ons minder bevalt, staat eerlijk bij de minpunten.",
  },
  {
    icoon: "bedenktijd",
    titel: "14 dagen bedenktijd",
    tekst:
      "Je hebt 14 dagen bedenktijd vanaf de dag dat je het product ontvangt. Past het toch niet, meld je retour dan via de contactpagina.",
  },
  {
    icoon: "slot",
    titel: "Veilig afrekenen",
    tekst: "Betalen gaat via een beveiligde kassa. Je ziet de verzendkosten voordat je betaalt.",
  },
  {
    icoon: "vraag",
    titel: "Vragen over dit product?",
    tekst: "Twijfel je over de maat of de kleur, stel je vraag dan via de contactpagina. We denken met je mee.",
  },
];

export const LEVERING_LABEL = "Op bestelling";

export const LEVERING_UITLEG =
  "We bestellen dit product na jouw bestelling bij de leverancier. Daardoor duurt de levering iets langer dan bij een grote webshop, maar ligt er geen voorraad te verstoffen. Je krijgt bericht zodra je pakket onderweg is.";

export const RETOUR_UITLEG =
  "Je hebt 14 dagen bedenktijd vanaf de dag dat je het product ontvangt. Meld je retour via de contactpagina, dan hoor je hoe je het terugstuurt.";
