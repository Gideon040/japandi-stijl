import json

# Vaste promptstaart: close-up materiaaltextuur, neutraal en consistent.
STYLE = ", macro close-up material texture, flat top-down view filling the frame, even soft natural daylight, warm neutral palette, photorealistic, high detail, no objects, no people, no text in image"

# (key, NL-alt, English material core voor de prompt)
texturen = [
    # --- Houtsoorten ---
    ("walnoot", "Close-up van massief walnoot met warme donkere nerf", "Solid walnut wood surface, warm dark brown grain, matte natural finish"),
    ("eiken-licht", "Close-up van licht eikenhout met fijne nerf", "Light oak wood surface, pale honey tone, fine straight grain, matte finish"),
    ("eiken-donker", "Close-up van donker gerookt eiken", "Dark smoked oak wood surface, deep brown grain, matte finish"),
    ("essen", "Close-up van essenhout met lichte nerf", "Ash wood surface, light cream tone, subtle flowing grain, matte finish"),
    ("teak", "Close-up van teakhout met warme goudbruine nerf", "Teak wood surface, warm golden brown, natural oily grain, matte finish"),
    ("mango-acacia", "Close-up van mango- of acaciahout met levendige nerf", "Mango and acacia wood surface, varied warm brown tones, lively grain, matte finish"),
    ("bamboe", "Close-up van bamboe met verticale vezels", "Bamboo surface, pale warm tone, vertical fibrous nodes, matte finish"),
    ("houtfineer", "Close-up van houtfineer op plaat met gesloten nerf", "Wood veneer surface on panel, smooth oak or walnut grain, matte finish"),
    ("houtlook-imitatie", "Close-up van houtprint op melamine, vlakke imitatienerf", "Printed wood-look melamine surface, flat repeating fake grain, slight sheen"),
    # --- Steen en mineraal ---
    ("travertijn", "Close-up van travertijn met poreuze natuursteennerf", "Travertine stone surface, off-white with soft horizontal pores and veins, matte"),
    ("steenlook-wabisabi", "Close-up van matte wabi-sabi steenlook in gebroken wit", "Wabi-sabi stone-look surface, matte off-white mineral plaster, organic irregular texture"),
    ("keramiek-mat", "Close-up van mat ongeglazuurd keramiek in zandtint", "Matte unglazed ceramic surface, sandy beige, fine grainy texture"),
    ("marmer-koel", "Close-up van koel marmer met grijze adering", "Cool marble surface, soft grey veining on off-white, smooth matte"),
    # --- Textiel ---
    ("linnen", "Close-up van natuurlijk linnen weefsel", "Natural linen fabric, woven flax texture, warm oatmeal tone, soft weave"),
    ("wol", "Close-up van gebreide wol met zichtbare steken", "Knitted wool surface, chunky soft loops, warm cream tone"),
    ("katoen", "Close-up van katoenen stof met fijne wieldraad", "Plain cotton fabric, fine even weave, soft sand tone"),
    ("boucle", "Close-up van bouclestof met lusjesstructuur", "Boucle fabric surface, looped curly yarn texture, creamy off-white"),
    ("jute", "Close-up van grove jute met grof weefsel", "Jute fabric surface, coarse natural fibre weave, warm tan tone"),
    ("rotan", "Close-up van gevlochten rotan", "Woven rattan surface, natural pale cane, regular diagonal weave"),
    ("papierkoord", "Close-up van handgevlochten papierkoord", "Handwoven paper cord surface, twisted natural fibre, warm beige weave"),
    ("velvet", "Close-up van velours met zachte glans", "Velvet fabric surface, soft pile with subtle sheen, muted warm tone"),
    ("leer", "Close-up van natuurlijk leer met fijne korrel", "Natural leather surface, fine grain, warm cognac brown, matte"),
    # --- Papier en wand ---
    ("rijstpapier", "Close-up van rijstpapier met vezelstructuur", "Rice paper surface, translucent warm white with visible plant fibres"),
    ("structuurbehang", "Close-up van vliesbehang met linnenlookstructuur", "Non-woven wallpaper surface, subtle linen-look embossed texture, sand tone"),
    ("voile", "Close-up van transparante voile gordijnstof", "Sheer voile curtain fabric, fine translucent weave, soft cream tone"),
    # --- Metaal ---
    ("metaal-zwart", "Close-up van mat zwart staal", "Matte black powder-coated steel surface, fine even texture"),
    ("aluminium", "Close-up van geborsteld aluminium", "Brushed aluminium surface, fine linear satin texture, cool grey"),
    ("messing", "Close-up van geborsteld messing met warme glans", "Brushed brass surface, warm golden satin sheen"),
    # --- Vlakke kleurstalen ---
    ("gebroken-wit", "Vlak van warm gebroken wit met fijne kalkstructuur", "Off-white warm wall surface, fine matte lime-plaster texture"),
    ("zand", "Vlak van zandkleurige kalkafwerking", "Sand-coloured wall surface, soft matte mineral plaster texture"),
    ("greige", "Vlak van greige met subtiele structuur", "Greige wall surface, warm grey-beige matte plaster, subtle texture"),
    ("beige-creme", "Vlak van beige en creme met zachte structuur", "Beige and cream wall surface, soft matte plaster, gentle texture"),
    ("warm-grijs", "Vlak van warm grijs met fijne structuur", "Warm grey wall surface, fine matte plaster texture"),
    ("blauwgrijs", "Vlak van koel blauwgrijs met matte afwerking", "Cool blue-grey wall surface, soft matte plaster texture"),
    ("mat-zwart", "Vlak van diep mat zwart", "Deep matte black painted surface, fine even texture"),
    ("terracotta", "Vlak van terracotta in warme aardetint", "Terracotta wall surface, warm earthy clay tone, matte plaster texture"),
    ("olijfgroen", "Vlak van gedempt olijfgroen", "Muted olive green wall surface, soft matte plaster texture"),
    ("warm-bruin", "Vlak van warm bruin met zachte structuur", "Warm brown wall surface, soft matte plaster texture"),
    # --- Afraders (hoogglans en kunststof) ---
    ("hoogglans-wit", "Close-up van hoogglans wit kunststof met spiegeling", "Glossy white plastic surface, reflective high-shine lacquer, smooth"),
    ("faux-fur", "Close-up van faux fur met lange vezels", "Faux fur surface, long synthetic pile, pale shiny fibres"),
]

entries = []
for key, alt, core in texturen:
    entries.append({
        "id": f"textuur-{key}",
        "page": "textuur-bibliotheek",
        "slot": "textuur",
        "aspect_ratio": "1:1",
        "alt": alt,
        "prompt": core + STYLE,
    })

with open("content/image-manifest-texturen.json", "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(entries)} texture entries")
