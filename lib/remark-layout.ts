// Wikkelt de MDX-body in <section>-blokken per H2 voor het sectieritme:
// afwisselend papier en full-bleed zand-banden, productsecties en FAQ
// altijd op zand, opeenvolgende ProductCards gegroepeerd in een productgrid.
// Draait na remark-heading-id.

type Node = {
  type: string;
  name?: string;
  depth?: number;
  children?: Node[];
  attributes?: Array<{ type: string; name: string; value: string }>;
};

type Chunk = { nodes: Node[]; kind: "prose" | "product" | "faq" };

const PRODUCT_COMPONENTS = new Set(["ProductCard", "KoopNietBlok"]);

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
      if (
        chunk.kind === "prose" &&
        chunk.nodes.some((n) => PRODUCT_COMPONENTS.has(jsxName(n) ?? ""))
      ) {
        chunk.kind = "product";
      }
    }

    // Zand: product- en FAQ-secties altijd, prose-secties om en om,
    // maar nooit twee zand-banden door een prose-sectie laten ontstaan.
    const zand = chunks.map((c) => c.kind !== "prose");
    let proseTeller = 0;
    chunks.forEach((c, i) => {
      if (c.kind !== "prose") return;
      if (proseTeller % 2 === 1) zand[i] = true;
      proseTeller += 1;
    });
    chunks.forEach((c, i) => {
      if (c.kind !== "prose" || !zand[i]) return;
      if ((i > 0 && zand[i - 1]) || (i + 1 < chunks.length && zand[i + 1])) {
        zand[i] = false;
      }
    });

    tree.children = chunks.map((c, i) =>
      el("section", zand[i] ? "sectie sectie-zand" : "sectie", [
        el("div", "sectie-inner", groupProductCards(c.nodes)),
      ])
    );
  };
}
