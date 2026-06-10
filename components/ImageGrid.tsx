import ImagePlaceholder from "./ImagePlaceholder";

type Props = { ids: string[] };

// 2 of 3 sfeerbeelden naast elkaar, gestapeld op mobiel.
export default function ImageGrid({ ids }: Props) {
  const cols = ids.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`my-10 grid grid-cols-1 gap-4 ${cols}`}>
      {ids.map((id) => (
        <ImagePlaceholder key={id} id={id} inGrid />
      ))}
    </div>
  );
}
