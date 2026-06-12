import fs from "fs";
import path from "path";

// Centrale auteurgegevens. Gebruikt door AuteurBlok (byline onderaan elke pagina)
// en KoopNietBlok (eerlijk-gezegd-attributie). Foto resolvet naar het eerste
// bestaande bestand, zodat een jpg net zo goed werkt als een webp.
export const AUTEUR_NAAM = "Lieke Huijzen";
export const AUTEUR_INITIAAL = "L";
const FOTO_ID = "auteur-lieke";

export function auteurFoto(): string | null {
  const dir = path.join(process.cwd(), "public", "images");
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    if (fs.existsSync(path.join(dir, `${FOTO_ID}.${ext}`))) return `/images/${FOTO_ID}.${ext}`;
  }
  return null;
}
