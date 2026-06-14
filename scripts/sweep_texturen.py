import glob
import re

# Keyword -> textuur-key. Volgorde telt: specifieker eerst.
RULES = [
    ("faux fur", "faux-fur"), ("bont", "faux-fur"),
    ("hoogglans", "hoogglans-wit"), ("hoog glans", "hoogglans-wit"),
    ("fineer", "houtfineer"),
    ("melamine", "houtlook-imitatie"), ("houtprint", "houtlook-imitatie"),
    ("houtlook", "houtlook-imitatie"), ("mdf", "houtlook-imitatie"),
    ("walnoot", "walnoot"),
    ("gerookt", "eiken-donker"), ("donker eik", "eiken-donker"),
    ("licht eik", "eiken-licht"), ("eiken", "eiken-licht"), ("eik", "eiken-licht"),
    ("essen", "essen"),
    ("teak", "teak"),
    ("mango", "mango-acacia"), ("acacia", "mango-acacia"),
    ("bamboe", "bamboe"),
    ("travertijn", "travertijn"), ("natuursteen", "travertijn"),
    ("wabi-sabi", "steenlook-wabisabi"), ("steenlook", "steenlook-wabisabi"),
    ("cemento", "steenlook-wabisabi"), ("steen", "steenlook-wabisabi"),
    ("marmer", "marmer-koel"),
    ("keramiek", "keramiek-mat"), ("aardewerk", "keramiek-mat"),
    ("porselein", "keramiek-mat"), ("glazuur", "keramiek-mat"),
    ("voile", "voile"), ("sheer", "voile"),
    ("vliesbehang", "structuurbehang"), ("behang", "structuurbehang"), ("vlies", "structuurbehang"),
    ("papierkoord", "papierkoord"), ("papier koord", "papierkoord"),
    ("rijstpapier", "rijstpapier"),
    ("linnen", "linnen"),
    ("wol", "wol"), ("gebreid", "wol"),
    ("katoen", "katoen"),
    ("boucle", "boucle"), ("bouclé", "boucle"),
    ("jute", "jute"), ("kokos", "jute"),
    ("chenille", "velvet"),
    ("canvas", "katoen"), ("geweven stof", "katoen"), ("textiel", "katoen"),
    ("rotan", "rotan"), ("gevlochten", "rotan"),
    ("velours", "velvet"), ("velvet", "velvet"),
    ("leer", "leer"),
    ("aluminium", "aluminium"),
    ("messing", "messing"), ("brass", "messing"),
    ("industrieel", "metaal-zwart"), ("zwart staal", "metaal-zwart"),
    ("zwart metaal", "metaal-zwart"), ("zwart aluminium", "aluminium"),
    ("metaal", "metaal-zwart"), ("staal", "metaal-zwart"),
    ("rijstpapier", "rijstpapier"), ("papier", "rijstpapier"),
    ("gebroken wit", "gebroken-wit"),
    ("greige", "greige"), ("taupe", "greige"),
    ("blauwgrijs", "blauwgrijs"), ("koel blauw", "blauwgrijs"),
    ("warm grijs", "warm-grijs"),
    ("mat zwart", "mat-zwart"),
    ("terracotta", "terracotta"),
    ("olijf", "olijfgroen"), ("groen", "olijfgroen"),
    ("warm bruin", "warm-bruin"), ("bruin", "warm-bruin"),
    ("zand", "zand"),
    ("beige", "beige-creme"), ("creme", "beige-creme"), ("crème", "beige-creme"),
    ("vinyl", "houtlook-imitatie"),
    ("kunststof", "hoogglans-wit"),
    ("grijs", "warm-grijs"),
    ("grenen", "eiken-licht"), ("grenenhout", "eiken-licht"),
    ("hout", "eiken-licht"),
]

def classify(naam, subtitel):
    text = (naam + " " + (subtitel or "")).lower()
    for kw, key in RULES:
        if kw in text:
            return key
    return None

staal_re = re.compile(r'staal:\s*"[^"]*"')
naam_re = re.compile(r'naam:\s*"([^"]*)"')
subtitel_re = re.compile(r'subtitel:\s*"([^"]*)"')

inserted = 0
skipped = 0
unmatched = []

for path in glob.glob("content/pages/*.mdx"):
    with open(path, encoding="utf-8") as f:
        text = f.read()

    out = []
    pos = 0
    for m in staal_re.finditer(text):
        out.append(text[pos:m.end()])
        rest = text[m.end():]
        # al een textuur vlak na de staal? dan overslaan
        window = rest[:160]
        nm = naam_re.search(window)
        if "textuur:" in window[: nm.start()] if nm else False:
            skipped += 1
            pos = m.end()
            continue
        if not nm:
            pos = m.end()
            continue
        naam = nm.group(1)
        sub_m = subtitel_re.search(window)
        subtitel = sub_m.group(1) if sub_m else ""
        key = classify(naam, subtitel)
        if key:
            # voeg komma toe als de staal-match die niet had
            insert = ' textuur: "%s",' % key if not text[m.end():m.end()+1] == "," else ' textuur: "%s",' % key
            # m matcht zonder trailing komma; check volgende teken
            nxt = text[m.end():m.end()+1]
            if nxt == ",":
                out.append(',')
                out.append(' textuur: "%s",' % key)
                pos = m.end() + 1
            else:
                out.append(' textuur: "%s",' % key)
                pos = m.end()
            inserted += 1
        else:
            unmatched.append((path.split("/")[-1], naam))
            pos = m.end()
    out.append(text[pos:])
    new_text = "".join(out)
    if new_text != text:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_text)

print(f"Inserted: {inserted}, skipped (al textuur): {skipped}, unmatched: {len(unmatched)}")
if unmatched:
    print("--- Niet gekoppeld (vallen terug op platte kleur) ---")
    seen = set()
    for fn, naam in unmatched:
        if naam not in seen:
            seen.add(naam)
            print(f"  {naam}")
