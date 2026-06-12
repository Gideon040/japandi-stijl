import fs from "fs";
import path from "path";
import manifest from "@/content/image-manifest.json";
import manifestFase5 from "@/content/image-manifest-fase5.json";

type Props = { id: string; priority?: boolean; fill?: boolean; inGrid?: boolean };

// Fase 1-4 staan in image-manifest.json (deels al gegenereerd), Fase 5 in
// image-manifest-fase5.json (de actuele generatielijst). Renderen leest beide.
const beelden = [...manifest, ...manifestFase5] as Array<{
  id: string;
  alt: string;
  aspect_ratio: string;
}>;

// Rendert /public/images/{id}.webp zodra het bestand bestaat.
// Tot die tijd: een rustige placeholder met de alt-tekst, zodat de
// pagina gebouwd kan worden voordat de beelden gegenereerd zijn.
// fill: vult de ouder (hero), inGrid: cel in een ImageGrid.
export default function ImagePlaceholder({ id, priority, fill, inGrid }: Props) {
  const entry = beelden.find((m) => m.id === id);
  const alt = entry?.alt ?? id;
  const ratio = entry?.aspect_ratio ?? "16:9";
  const [rw, rh] = ratio.split(":").map(Number);
  const exists = fs.existsSync(path.join(process.cwd(), "public", "images", `${id}.webp`));

  const aspect = fill ? undefined : { aspectRatio: `${rw} / ${rh}` };
  const imgClass = fill
    ? "absolute inset-0 w-full h-full object-cover"
    : inGrid
      ? "w-full rounded-sm object-cover"
      : "w-full max-w-4xl mx-auto rounded-sm my-10 object-cover";

  if (exists) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/images/${id}.webp`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={imgClass}
        style={aspect}
      />
    );
  }
  const phClass = fill
    ? "absolute inset-0 w-full h-full bg-zand flex items-center justify-center"
    : inGrid
      ? "w-full bg-zand border border-lijn rounded-sm flex items-center justify-center"
      : "w-full max-w-4xl mx-auto my-10 bg-zand border border-lijn rounded-sm flex items-center justify-center";
  return (
    <div className={phClass} style={aspect} aria-hidden>
      <span className="text-klei text-sm px-6 text-center">{alt}</span>
    </div>
  );
}
