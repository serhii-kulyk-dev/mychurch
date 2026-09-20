"""Іконка застосунку «Моя Церква»: церква на синьому квадраті зі скругленням.

Використовується тільки як іконка вкладки/застосунку (favicon, icon, apple-icon)
— знак бренду в інтерфейсі лишається той, що рахує `gen.py`.

Геометрія знята з ескізу (сітка 160×160) і задана параметрично, тому будь-який
розмір рахується заново, а не масштабується з растру. Малі розміри (16–32 px)
беруть товщий штрих і без світлої рамки: інакше на вкладці лишається пляма.
"""
import os
from PIL import Image, ImageDraw

U = 160.0  # умовна сітка, в якій записана геометрія

BAND = 8.0  # світла рамка по краю
R_OUT = 38.0  # скруглення зовнішнього квадрата
R_IN = 31.0  # скруглення синього поля під рамкою
STROKE = 6.0  # товщина ліній церкви

BLUE = (0, 122, 255)
BLUE_LIGHT = (140, 194, 255)
WHITE = (255, 255, 255)

# Ламані білого контуру: хрест, неф із дахом, два крила, спільна основа.
CROSS_V = [(79.5, 31.0), (79.5, 58.0)]
CROSS_H = [(69.0, 41.5), (90.0, 41.5)]
NAVE = [(62.5, 123.5), (62.5, 71.0), (79.5, 58.0), (96.5, 71.0), (96.5, 123.5)]
WING_L = [(37.0, 123.5), (37.0, 90.5), (62.5, 90.5)]
WING_R = [(122.5, 123.5), (122.5, 90.5), (96.5, 90.5)]
BASE = [(37.0, 123.5), (122.5, 123.5)]
SHAPES = (CROSS_V, CROSS_H, NAVE, WING_L, WING_R, BASE)

SMALL_AT = 32  # до цього розміру включно — спрощена побудова
SMALL_STROKE = 10.0
SMALL_ZOOM = 1.12  # без рамки лишається місце: підсуваємо церкву ближче до країв
CENTER = (80.0, 77.0)  # оптичний центр контуру, навколо нього збільшуємо


def _polyline(draw, pts, width, k):
    """Ламана з круглими кінцями: PIL сам кінці не скругляє, дорисовуємо."""
    p = [(x * k, y * k) for x, y in pts]
    w = max(1, round(width * k))
    draw.line(p, fill=WHITE + (255,), width=w, joint="curve")
    r = w / 2
    for x, y in p:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=WHITE + (255,))


def _zoomed(pts, zoom):
    cx, cy = CENTER
    return [(cx + (x - cx) * zoom, cy + (y - cy) * zoom) for x, y in pts]


def to_png(size, band=True, stroke=STROKE, zoom=1.0, square=False, path=None):
    """Рендер у `size` пікселів через 8× суперсемплінг."""
    ss = 8 if size <= 256 else 3
    k = size * ss / U
    side = round(U * k)
    img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    outer = BLUE_LIGHT if band else BLUE
    box = [0, 0, side - 1, side - 1]
    if square:
        d.rectangle(box, fill=outer + (255,))
    else:
        d.rounded_rectangle(box, R_OUT * k, fill=outer + (255,))
    if band:
        b = BAND * k
        d.rounded_rectangle([b, b, side - 1 - b, side - 1 - b], R_IN * k, fill=BLUE + (255,))

    for pts in SHAPES:
        _polyline(d, _zoomed(pts, zoom), stroke, k)

    img = img.resize((size, size), Image.LANCZOS)
    if path:
        img.save(path)
    return img


def icon(size, path=None):
    """Розмір → готова іконка з потрібним для нього спрощенням."""
    small = size <= SMALL_AT
    return to_png(
        size,
        band=not small,
        stroke=SMALL_STROKE if small else STROKE,
        zoom=SMALL_ZOOM if small else 1.0,
        path=path,
    )


def svg(band=True, stroke=STROKE, zoom=1.0):
    """Векторний майстер — те саме, що й растр, один в один."""
    def d(pts):
        head = f"M{pts[0][0]:g} {pts[0][1]:g}"
        return head + "".join(f"L{x:g} {y:g}" for x, y in pts[1:])

    def hexc(c):
        return "#%02x%02x%02x" % c

    bg = (
        f'<rect width="160" height="160" rx="{R_OUT:g}" fill="{hexc(BLUE_LIGHT)}"/>'
        f'<rect x="{BAND:g}" y="{BAND:g}" width="{160 - 2 * BAND:g}"'
        f' height="{160 - 2 * BAND:g}" rx="{R_IN:g}" fill="{hexc(BLUE)}"/>'
        if band
        else f'<rect width="160" height="160" rx="{R_OUT:g}" fill="{hexc(BLUE)}"/>'
    )
    paths = "".join(f'<path d="{d(_zoomed(p, zoom))}"/>' for p in SHAPES)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">'
        f"{bg}"
        f'<g fill="none" stroke="#fff" stroke-width="{stroke:g}"'
        ' stroke-linecap="round" stroke-linejoin="round">'
        f"{paths}</g></svg>\n"
    )


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
    os.makedirs(out, exist_ok=True)
    sheet = Image.new("RGBA", (16 + 24 + 32 + 48 + 64 + 128 + 256 + 8 * 7, 280), (255, 255, 255, 255))
    x = 8
    for s in (16, 24, 32, 48, 64, 128, 256):
        im = icon(s)
        sheet.alpha_composite(im, (x, 8))
        x += s + 8
    sheet.save(os.path.join(out, "appicon-sheet.png"))
    print("превʼю:", os.path.join(out, "appicon-sheet.png"))
