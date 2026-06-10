// Wikkelt de MDX-body in <section>-blokken per H2 voor het sectieritme:
// drie tinten (papier, zand, zand-diep) rouleren, nooit twee keer dezelfde
// tint na elkaar. Vaste tinten: productsectie en FAQ op zand-diep, de
// koopniet-sectie ("Eerlijk gezegd") op zand. Opeenvolgende ProductCards
// worden gegroepeerd in een productgrid. Draait na remark-heading-id.

type Node = {
  type: string;
  name?: string;
  depth?: number;
  children?: Node[];
  attributes?: Array<{ type: string; name: string; value: string }>;
};

type Kind = "prose" | "product" | "faq" | "koopniet";
type Tint = "papier" | "zand" | "diep";
type Chunk = { nodes: Node[]; kind: Kind };

const TINT_CLASS: Record<Tint, string> = {
  papier: "sectie",
  zand: "sectie sectie-zand",
  diep: "sectie sectie-zand-diep",
};

function jsxName(node: Node): string | undefined {
  return node.type === "mdxJsxFlowElement" ? node.name : undefined;
}

function el(name: string, className: string, children: Node[]): Node {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: [{ type: "mdxJsxAttribute", name: "className", value: className }],
    children,
  };
}

function groupProductCards(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let cards: Node[] = [];
  const flush = () => {
    if (cards.length) {
      out.push(el("div", "productgrid", cards));
      cards = [];
    }
  };
  for (const node of nodes) {
    if (jsxName(node) === "ProductCard") {
      cards.push(node);
    } else {
      flush();
      out.push(node);
    }
  }
  flush();
  return out;
}

export default function remarkLayout() {
  return (tree: Node) => {
    const chunks: Chunk[] = [];
    let current: Node[] = [];
    const flush = () => {
      if (current.length) {
        chunks.push({ nodes: current, kind: "prose" });
        current = [];
      }
    };

    for (const node of tree.children ?? []) {
      if (node.type === "heading" && node.depth === 2) {
        flush();
        current.push(node);
      } else if (jsxName(node) === "FAQ") {
        flush();
        chunks.push({ nodes: [node], kind: "faq" });
      } else {
        current.push(node);
      }
    }
    flush();

    for (const chunk of chunks) {
      if (chunk.kind !== "prose") continue;
      const namen = chunk.nodes.map((n) => jsxName(n) ?? "");
      if (namen.includes("ProductCard")) chunk.kind = "product";
      else if (namen.includes("KoopNietBlok")) chunk.kind = "koopniet";
    }

    // Tinten: vaste tinten eerst, prose kiest een tint die afwijkt van de
    // vorige sectie en van de eerstvolgende vaste tint. De hero erboven is
    // zand, dus de eerste prose-sectie wordt papier.
    const vast: Partial<Record<Kind, Tint>> = { product: "diep", faq: "diep", koopniet: "zand" };
    const tinten: Tint[] = [];
    let vorige: Tint = "zand";
    chunks.forEach((chunk, i) => {
      const eigen = vast[chunk.kind];
      if (eigen) {
        tinten.push(eigen);
        vorige = eigen;
        return;
      }
      const volgendeVast = i + 1 < chunks.length ? vast[chunks[i + 1].kind] : undefined;
      const keuze =
        (["papier", "zand", "diep"] as Tint[]).find(
          (t) => t !== vorige && t !== volgendeVast
        ) ?? "papier";
      tinten.push(keuze);
      vorige = keuze;
    });

    tree.children = chunks.map((c, i) =>
      el("section", TINT_CLASS[tinten[i]], [el("div", "sectie-inner", groupProductCards(c.nodes))])
    );
  };
}
