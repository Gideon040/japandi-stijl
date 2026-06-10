import ImagePlaceholder from "./ImagePlaceholder";

type Props = { ids: string[] };

// Beeldcollage naar de designreferentie: 3 beelden (3:4, 4:5, 3:5) met
// verspringende toppen; mobiel alleen de eerste 2. Aspect ratios komen
// uit het image-manifest. De kolomgap zorgt dat beelden elkaar nooit raken.
export default function Collage({ ids }: Props) {
  const [a, b, c] = ids;
  return (
    <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 items-start my-12">
      {a && (
        <div className="col-start-1 col-end-8 lg:col-end-6">
          <ImagePlaceholder id={a} inGrid />
        </div>
      )}
      {b && (
        <div className="col-start-8 col-end-13 lg:col-start-6 lg:col-end-10 mt-14">
          <ImagePlaceholder id={b} inGrid />
        </div>
      )}
      {c && (
        <div className="hidden lg:block lg:col-start-10 lg:col-end-13 lg:mt-5">
          <ImagePlaceholder id={c} inGrid />
        </div>
      )}
    </div>
  );
}
