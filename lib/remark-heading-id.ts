// MDX parseert {#id} als JavaScript-expressie en crasht (acorn). Daarom is de
// anchor-conventie hier [#id] aan het einde van een heading. Headings zonder
// expliciete id krijgen een geslugificeerde id van de headingtekst.

type MdastNode = {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> } & Record<string, unknown>;
};

const ID_PATTERN = /\s*\[#([A-Za-z][A-Za-z0-9-]*)\]\s*$/;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textOf(node: MdastNode): string {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(textOf).join("");
}

function visit(node: MdastNode, fn: (n: MdastNode) => void) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}

export default function remarkHeadingId() {
  return (tree: MdastNode) => {
    visit(tree, (node) => {
      if (node.type !== "heading" || !node.children?.length) return;
      let id: string | null = null;
      const last = node.children[node.children.length - 1];
      if (last.type === "text" && typeof last.value === "string") {
        const match = last.value.match(ID_PATTERN);
        if (match) {
          id = match[1];
          last.value = last.value.replace(ID_PATTERN, "");
          if (!last.value) node.children.pop();
        }
      }
      if (!id) id = slugify(textOf(node));
      if (!id) return;
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
    });
  };
}
