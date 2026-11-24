// Bedrijfsgegevens van de winkel op een plek. Gebruikt in de footer, de
// juridische pagina's en de herroepingsfunctie. De wet (art. 6:230m BW) eist
// naam, adres, KvK-nummer, btw-nummer, e-mail en telefoonnummer. Vul het
// telefoonnummer in zodra het bekend is; zolang het leeg is wordt het niet
// getoond.

export const BEDRIJF = {
  naam: "GOSTACK",
  handelsnaam: "japandi-stijl.nl",
  adres: "Dauphinelaan 70",
  postcode: "5627 CR",
  plaats: "Eindhoven",
  land: "Nederland",
  kvk: "98679112",
  btw: "NL005347335B26",
  email: "info@japandi-stijl.nl",
  telefoon: "06 24242177",
};

export const BEDRIJF_REGEL = `${BEDRIJF.naam}, ${BEDRIJF.adres}, ${BEDRIJF.postcode} ${BEDRIJF.plaats}. KvK ${BEDRIJF.kvk}, btw ${BEDRIJF.btw}`;
