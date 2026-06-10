#!/usr/bin/env python3
"""
Converteert de Matrixify-export van japandi-stijl.nl naar MDX-bronbestanden.

Leest per collectie:
- Metafield: custom.seo_content [rich_text_field]  (Shopify rich text JSON)
- Metafield: custom.faq_N_question / faq_N_answer  (1 t/m 5)
- Metafield: title_tag / description_tag
- Handle, Title

Schrijft naar docs/shopify-export/{handle}.mdx met frontmatter.

Gebruik:
    pip install openpyxl
    python scripts/convert-shopify.py pad/naar/Export.xlsx
"""
import sys
import json
import re
from pathlib import Path

import openpyxl

OUT_DIR = Path(__file__).resolve().parent.parent / "docs" / "shopify-export"


def rich_text_to_md(node) -> str:
    """Shopify rich_text_field JSON naar markdown."""
    if node is None:
        return ""
    if isinstance(node, str):
        node = node.strip()
        if not node:
            return ""
        try:
            node = json.loads(node)
        except json.JSONDecodeError:
            # platte tekst of html; geef terug zoals het is
            return node

    t = node.get("type")
    children = node.get("children", [])

    if t == "root":
        return "\n\n".join(filter(None, (rich_text_to_md(c) for c in children)))

    if t == "heading":
        level = int(node.get("level", 2))
        inner = "".join(rich_text_to_md(c) for c in children)
        return "#" * level + " " + inner

    if t == "paragraph":
        return "".join(rich_text_to_md(c) for c in children)

    if t == "list":
        ordered = node.get("listType") == "ordered"
        lines = []
        for i, item in enumerate(children, 1):
            prefix = f"{i}. " if ordered else "- "
            lines.append(prefix + rich_text_to_md(item))
        return "\n".join(lines)

    if t == "list-item":
        return "".join(rich_text_to_md(c) for c in children)

    if t == "link":
        inner = "".join(rich_text_to_md(c) for c in children)
        url = node.get("url", "")
        # interne shopify-links alvast omzetten naar nieuwe platte structuur kan later;
        # bewaar het origineel zodat niets verloren gaat
        return f"[{inner}]({url})"

    if t == "text":
        v = node.get("value", "")
        if node.get("bold"):
            v = f"**{v}**"
        if node.get("italic"):
            v = f"*{v}*"
        return v

    # onbekend nodetype: probeer kinderen
    return "".join(rich_text_to_md(c) for c in children)


def clean(s):
    if s is None:
        return ""
    s = str(s).strip()
    # harde regel: geen em/en dashes in content
    s = s.replace("\u2014", ", ").replace("\u2013", ", ")
    s = re.sub(r",\s+", ", ", s)
    s = re.sub(r"\s+,", ",", s)
    return s


def main(xlsx_path: str):
    wb = openpyxl.load_workbook(xlsx_path, read_only=True)
    ws = wb["Custom Collections"]
    rows = list(ws.iter_rows(values_only=True))
    headers = rows[0]
    ih = {h: i for i, h in enumerate(headers)}

    def col(r, name):
        i = ih.get(name)
        return r[i] if i is not None else None

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    seen = set()
    written = 0

    for r in rows[1:]:
        handle = col(r, "Handle")
        if not handle or handle in seen:
            continue
        seen.add(handle)

        seo = col(r, "Metafield: custom.seo_content [rich_text_field]")
        body_md = clean(rich_text_to_md(seo))

        faqs = []
        for n in range(1, 6):
            q = None
            for ftype in ("single_line_text_field", "multi_line_text_field"):
                qq = col(r, f"Metafield: custom.faq_{n}_question [{ftype}]")
                if qq:
                    q = qq
                    break
            a = col(r, f"Metafield: custom.faq_{n}_answer [multi_line_text_field]")
            if q and a:
                faqs.append({"vraag": clean(q), "antwoord": clean(a)})

        fm = {
            "shopify_handle": handle,
            "oude_url": f"/collections/{handle}",
            "titel": clean(col(r, "Title")),
            "title_tag": clean(col(r, "Metafield: title_tag [string]")),
            "description_tag": clean(col(r, "Metafield: description_tag [string]")),
            "faqs": faqs,
            "status": "bronmateriaal",
        }

        out = OUT_DIR / f"{handle}.mdx"
        with out.open("w", encoding="utf-8") as f:
            f.write("---\n")
            f.write(json.dumps(fm, ensure_ascii=False, indent=2))
            f.write("\n---\n\n")
            f.write(body_md or "<!-- geen seo_content aanwezig -->")
            f.write("\n")
        written += 1

    print(f"{written} MDX-bronbestanden geschreven naar {OUT_DIR}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("gebruik: python scripts/convert-shopify.py Export.xlsx")
    main(sys.argv[1])
