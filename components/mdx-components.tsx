import ProductCard from "./ProductCard";
import VergelijkingsTabel from "./VergelijkingsTabel";
import FAQ from "./FAQ";
import ImagePlaceholder from "./ImagePlaceholder";
import Collage from "./Collage";
import SplitSectie from "./SplitSectie";
import MateriaalKaart from "./MateriaalKaart";
import LinkKaart from "./LinkKaart";
import LinkLijst, { type LinkLijstItem } from "./LinkLijst";
import { getGepubliceerdeGidsen } from "@/lib/koopgidsen";
import KoopNietBlok from "./KoopNietBlok";
import AuteurBlok from "./AuteurBlok";

export const mdxComponents = {
  ProductCard,
  VergelijkingsTabel,
  FAQ,
  ImagePlaceholder,
  Collage,
  SplitSectie,
  MateriaalKaart,
  KleurenKaart: MateriaalKaart,
  LinkKaart,
  // Zonder items-prop voedt de lijst zichzelf met alle gepubliceerde koopgidsen.
  LinkLijst: ({ items }: { items?: LinkLijstItem[] }) => (
    <LinkLijst
      items={items ?? getGepubliceerdeGidsen("koopgids").map((g) => ({ href: g.href, titel: g.titel }))}
    />
  ),
  KoopNietBlok,
  AuteurBlok,
};
