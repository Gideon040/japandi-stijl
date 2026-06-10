type Props = { score?: number; reviews?: number };

// Reviewsterren met fractionele vulling: 4,2 van 5 = 84% sterrengoud.
// Zonder reviews: alleen de tekst "nog geen reviews", nooit lege sterren.
export default function Sterren({ score, reviews }: Props) {
  if (!score || !reviews) {
    return <span className="text-sm text-klei">nog geen reviews</span>;
  }
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="relative inline-block leading-none text-[#E0D5BF]" aria-hidden>
        <span>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-sterrengoud"
          style={{ width: `${pct}%` }}
        >
          &#9733;&#9733;&#9733;&#9733;&#9733;
        </span>
      </span>
      <span className="font-semibold">
        {score.toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
      <span className="text-klei">({reviews} reviews)</span>
    </span>
  );
}
