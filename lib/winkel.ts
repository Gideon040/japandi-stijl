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
      "Je hebt 14 dagen bedenktijd vanaf de dag dat je het product ontvangt. Past het toch niet, dan herroep je de koop via de knop Overeenkomst herroepen onderaan de site.",
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

export const LEVERING_LABEL = "Bezorging aan huis";

// De vier stappen onder "Levering en retour" op de productpagina. Bij stap 3
// vult de pagina zelf de levertijd van het product in. Houd de levertijd altijd
// eerlijk: die bepaalt wat de klant verwacht.
export const STAPPEN: { titel: string; tekst: string }[] = [
  {
    titel: "Veilig besteld",
    tekst: "Je rekent af via een beveiligde kassa en krijgt direct een bevestiging per e-mail.",
  },
  {
    titel: "Met zorg verpakt",
    tekst: "We maken je bestelling klaar en verpakken alles stevig, zodat het heel aankomt.",
  },
  {
    titel: "Bezorgd aan huis",
    tekst: "Je krijgt bericht zodra je pakket onderweg is, zodat je weet wanneer het komt.",
  },
  {
    titel: "14 dagen bedenktijd",
    tekst: "Thuis toch anders dan gedacht? Je hebt 14 dagen bedenktijd vanaf de dag dat je het product ontvangt.",
  },
];
