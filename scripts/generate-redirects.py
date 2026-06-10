#!/usr/bin/env python3
"""Genereert redirects.mjs uit docs/redirect-map.csv"""
import csv, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
rows = list(csv.DictReader(open(root / "docs" / "redirect-map.csv")))
items = ",\n".join(
    f"  {{ source: '{r['oude_url']}', destination: '{r['nieuwe_url']}', permanent: true }}"
    for r in rows if r["nieuwe_url"]
)
out = "// Gegenereerd uit docs/redirect-map.csv. Niet handmatig bewerken.\nexport const redirects = [\n" + items + "\n];\n"
(root / "redirects.mjs").write_text(out)
print(f"{len(rows)} redirects geschreven naar redirects.mjs")
