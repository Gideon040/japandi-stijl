// Eenmalige conversie van de gegenereerde PNG's naar public/images/{id}.webp
import fs from "fs";
import path from "path";
import sharp from "sharp";

const mapping = {
  "ChatGPT Image 10 jun 2026, 12_34_42.png": "japandi-bureau-hero",
  "ChatGPT Image 10 jun 2026, 12_34_52.png": "japandi-bureau-sectie-1",
  "ChatGPT Image 10 jun 2026, 12_34_59.png": "japandi-bureau-sectie-2",
  "ChatGPT Image 10 jun 2026, 12_35_23.png": "japandi-bureau-sectie-3",
};

const pub = path.join(process.cwd(), "public");
const outDir = path.join(pub, "images");
fs.mkdirSync(outDir, { recursive: true });

for (const [src, id] of Object.entries(mapping)) {
  const input = path.join(pub, src);
  const output = path.join(outDir, `${id}.webp`);
  const img = sharp(input);
  const meta = await img.metadata();
  await img.webp({ quality: 82 }).toFile(output);
  const kb = Math.round(fs.statSync(output).size / 1024);
  console.log(`${id}.webp  ${meta.width}x${meta.height}  ${kb} kB`);
}
