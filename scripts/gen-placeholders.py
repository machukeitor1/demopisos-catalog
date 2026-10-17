"""Genera imágenes SVG de demostración (texturas de materiales) en public/demo/."""
import os, random
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "demo")
os.makedirs(OUT, exist_ok=True)

def planks(c1, c2, vertical=False, gap="#00000022"):
    r = random.Random(c1 + c2)
    g = []
    for i in range(8):
        y = i * 100
        off = r.randint(0, 400)
        for x in (-off, -off + 520, -off + 1040):
            col = r.choice([c1, c2])
            g.append(f'<rect x="{x}" y="{y}" width="510" height="96" fill="{col}"/>')
            for k in range(5):
                yy = y + r.randint(10, 86)
                g.append(f'<path d="M{x} {yy} q 130 {r.randint(-6,6)} 255 0 t 255 0" stroke="{gap}" fill="none" stroke-width="2"/>')
        g.append(f'<rect x="0" y="{y+96}" width="800" height="4" fill="{gap}"/>')
    body = "".join(g)
    if vertical:
        body = f'<g transform="rotate(90 400 400)">{body}</g>'
    return body

def metal(c1, c2):
    g = [f'<rect width="800" height="800" fill="{c1}"/>']
    for x in range(0, 800, 80):
        g.append(f'<rect x="{x}" width="40" height="800" fill="{c2}"/>')
        g.append(f'<rect x="{x+38}" width="4" height="800" fill="#ffffff33"/>')
    return "".join(g)

def stone(c1, c2):
    r = random.Random(c1)
    g = [f'<rect width="800" height="800" fill="#00000055"/>']
    y = 0
    while y < 800:
        h = r.randint(70, 130); x = -r.randint(0, 60)
        while x < 800:
            w = r.randint(90, 200)
            col = r.choice([c1, c2])
            g.append(f'<rect x="{x+4}" y="{y+4}" width="{w-8}" height="{h-8}" rx="14" fill="{col}"/>')
            x += w
        y += h
    return "".join(g)

def svg(body, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">'
            f'<defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/>'
            f'<stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>'
            f'{body}<rect width="800" height="800" fill="url(#sh)"/>'
            f'<rect x="24" y="720" width="{len(label)*17+40}" height="52" rx="10" fill="#000000aa"/>'
            f'<text x="44" y="755" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="#fff">{label}</text></svg>')

PRODUCTS = {
  "spc-roble-natural": (planks("#c9a27a", "#b88f66"), "SPC Roble Natural"),
  "spc-gris-ceniza":   (planks("#a7a29b", "#958f87"), "SPC Gris Ceniza"),
  "spc-nogal-oscuro":  (planks("#6b4a33", "#5a3d2a"), "SPC Nogal Oscuro"),
  "flotante-haya":     (planks("#d8b48b", "#cba57a"), "Flotante Haya"),
  "flotante-blanco":   (planks("#e7e1d7", "#dad3c7"), "Flotante Blanco"),
  "flotante-cerezo":   (planks("#9b5a3c", "#8a4f34"), "Flotante Cerezo"),
  "deck-teca":         (planks("#8a5a36", "#7a4e2e", vertical=True), "Deck WPC Teca"),
  "deck-grafito":      (planks("#4a4a4a", "#3e3e3e", vertical=True), "Deck WPC Grafito"),
  "deck-cafe":         (planks("#5e4030", "#523628", vertical=True), "Deck WPC Café"),
  "metal-negro":       (metal("#2b2b2b", "#1f1f1f"), "Metal Siding Negro"),
  "metal-madera":      (metal("#9a6a43", "#8a5d39"), "Metal Siding Madera"),
  "metal-gris":        (metal("#8d949a", "#7c8389"), "Metal Siding Gris"),
  "wpc-siding-teca":   (planks("#9c6b44", "#8d603d"), "Siding WPC Teca"),
  "wpc-siding-gris":   (planks("#8f8f8f", "#828282"), "Siding WPC Gris"),
  "wpc-siding-nogal":  (planks("#6e4c35", "#61432f"), "Siding WPC Nogal"),
  "piedra-pizarra":    (stone("#55585c", "#4a4d51"), "Piedra PU Pizarra"),
  "piedra-arena":      (stone("#cdb894", "#bfa982"), "Piedra PU Arena"),
  "piedra-rustica":    (stone("#9b8a78", "#8a7a6a"), "Piedra PU Rústica"),
}
for slug, (body, label) in PRODUCTS.items():
    open(os.path.join(OUT, f"{slug}.svg"), "w").write(svg(body, label))

def banner(name, title, sub, c1, c2):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500">'
         f'<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>'
         f'<rect width="1600" height="500" fill="url(#g)"/>'
         + "".join(f'<rect x="{900+i*70}" y="{-50+i*10}" width="50" height="700" fill="#ffffff" opacity="{0.04+i*0.01}" transform="rotate(15 1200 250)"/>' for i in range(10)) +
         f'<text x="100" y="230" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="700" fill="#fff">{title}</text>'
         f'<text x="100" y="300" font-family="Arial,Helvetica,sans-serif" font-size="34" fill="#ffffffcc">{sub}</text></svg>')
    open(os.path.join(OUT, name), "w").write(s)

banner("banner-1.svg", "Pisos que duran", "Catálogo demo · SPC, flotantes y deck WPC", "#1f2937", "#8a5a36")
banner("banner-2.svg", "Cotiza en minutos", "Portal de vendedores con PDF y DOCX", "#0f3d3e", "#3e7c6b")
print("ok", len(os.listdir(OUT)))
