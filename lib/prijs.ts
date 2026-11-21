// Prijsweergave, bruikbaar op server en client. Hele bedragen zonder decimalen
// (€ 99), anders met twee (€ 64,90).
export function formatPrijs(amount: string | number, currencyCode = "EUR"): string {
  const bedrag = Number(amount);
  const heel = Number.isInteger(bedrag);
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: heel ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(bedrag);
}
