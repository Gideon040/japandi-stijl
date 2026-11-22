// Bedrijfsgegevens van de winkel op een plek. Gebruikt in de footer, de
// juridische pagina's en de herroepingsfunctie. De wet (art. 6:230m BW) eist
// naam, adres, KvK-nummer, btw-nummer, e-mail en telefoonnummer. Vul het
// telefoonnummer in zodra het bekend is; zolang het leeg is wordt het niet
// getoond.

export const BEDRIJF = {
  naam: "GRG Great Resources Group B.V.",
  handelsnaam: "japandi-stijl.nl",
  adres: "Twekkelerweg 106",
  postcode: "7553 LN",
  plaats: "Hengelo",
  land: "Nederland",
  kvk: "82016666",
  btw: "NL862306139B01",
  email: "info@japandi-stijl.nl",
  telefoon: "",
};

export const BEDRIJF_REGEL = `${BEDRIJF.naam}, ${BEDRIJF.adres}, ${BEDRIJF.postcode} ${BEDRIJF.plaats}. KvK ${BEDRIJF.kvk}, btw ${BEDRIJF.btw}`;
