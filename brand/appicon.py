"""Іконка застосунку «Моя Церква»: монограма «МЦ» на синьому квадраті.

Використовується тільки як іконка вкладки/застосунку (favicon, icon, apple-icon)
— знак бренду в інтерфейсі лишається той, що рахує `gen.py`, а в хедері стоїть
словесний логотип, і монограма його не заміняє.

Літери беруться з Manrope 800 через `word.py`, тому монограма — це той самий
шрифт, що й логотип, а не окремий малюнок. Ширина ріже кегль раніше за висоту:
дві широкі кириличні великі літери впираються в бік плитки, і якщо цього не
врахувати, «Ц» вилазить за край.

Церква, яка стояла тут раніше, лишилась нижче (`church_png`) — вона намальована
параметрично в сітці 160×160 і готова, якщо монограма не приживеться.
"""
import os
from PIL import Image, ImageDraw
import word

U = 160.0  # умовна сітка, в якій записана геометрія

MONO = "М"  # що стоїть у плитці
MONO_CAP = 0.62  # бажана висота великої літери в частках сторони
MONO_MAXW = 0.78  # ширший за це напис не буває: зменшуємо кегль, а не ріжемо
MONO_TRACK = -0.03  # трекінг між двома літерами, em

R_OUT = 38.0  # скруглення квадрата
STROKE = 6.0  # товщина ліній церкви
ZOOM = 1.12  # церква на всю плитку: без рамки лишилось місце по краях

BLUE = (0, 105, 224)  # --brand, #0069e0 — той самий синій, що в кнопках
WHITE = (255, 255, 255)

# Ламані білого контуру: хрест, неф із дахом, два крила, спільна основа.
CROSS_V = [(79.5, 31.0), (79.5, 58.0)]
CROSS_H = [(69.0, 41.5), (90.0, 41.5)]
NAVE = [(62.5, 123.5), (62.5, 71.0), (79.5, 58.0), (96.5, 71.0), (96.5, 123.5)]
WING_L = [(37.0, 123.5), (37.0, 90.5), (62.5, 90.5)]
WING_R = [(122.5, 123.5), (122.5, 90.5), (96.5, 90.5)]
BASE = [(37.0, 123.5), (122.5, 123.5)]
SHAPES = (CROSS_V, CROSS_H, NAVE, WING_L, WING_R, BASE)

SMALL_AT = 32  # до цього розміру включно — товщий штрих
SMALL_STROKE = 9.0
CENTER = (80.0, 77.0)  # центр габариту контуру, навколо нього збільшуємо


def _polyline(draw, pts, width, k):
    """Ламана з круглими кінцями: PIL сам кінці не скругляє, дорисовуємо."""
    p = [(x * k, y * k) for x, y in pts]
    w = max(1, round(width * k))
    draw.line(p, fill=WHITE + (255,), width=w, joint="curve")
    r = w / 2
    for x, y in p:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=WHITE + (255,))


def _placed(pts, zoom):
    """Збільшує контур і ставить його по центру плитки.

    Хрест тягне габарит угору, тому без цієї поправки верхнє поле виходить
    вужчим за нижнє, і на вкладці іконка виглядає збитою до верхнього краю.
    """
    cx, cy = CENTER
    z = [(cx + (x - cx) * zoom, cy + (y - cy) * zoom) for x, y in pts]
    return [(x + OFFSET[0], y + OFFSET[1]) for x, y in z]


def _offset():
    """Зсув, який вирівнює габарит усіх ламаних по центру сітки 160×160."""
    cx, cy = CENTER
    xs = [cx + (x - cx) * ZOOM for pts in SHAPES for x, _ in pts]
    ys = [cy + (y - cy) * ZOOM for pts in SHAPES for _, y in pts]
    return (U / 2 - (min(xs) + max(xs)) / 2, U / 2 - (min(ys) + max(ys)) / 2)


OFFSET = _offset()


def to_png(size, square=False, path=None):
    """Монограма в плитці, `size` пікселів, через суперсемплінг."""
    ss = 8 if size <= 64 else 4
    n = size * ss
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if square:
        d.rectangle([0, 0, n - 1, n - 1], fill=BLUE + (255,))
    else:
        d.rounded_rectangle([0, 0, n - 1, n - 1], n * (R_OUT / U), fill=BLUE + (255,))

    cap = n * MONO_CAP
    tr = MONO_TRACK if len(MONO) > 1 else 0.0
    w = word.width(MONO, word.cap_to_px(cap), word.WEIGHT_LOGO, tr)
    if w > n * MONO_MAXW:
        cap *= n * MONO_MAXW / w
        w = word.width(MONO, word.cap_to_px(cap), word.WEIGHT_LOGO, tr)
    word.draw(d, ((n - w) / 2, n / 2 + cap / 2), MONO, word.cap_to_px(cap),
              WHITE, WHITE, word.WEIGHT_LOGO, tr)

    img = img.resize((size, size), Image.LANCZOS)
    if path:
        img.save(path)
    return img


def icon(size, path=None):
    """Розмір → готова іконка. Монограма однакова на всіх розмірах."""
    return to_png(size, path=path)


def church_png(size, stroke=STROKE, zoom=ZOOM, square=False, path=None):
    """Стара іконка — церква на плитці. Лишена як запасний варіант."""
    ss = 8 if size <= 256 else 3
    k = size * ss / U
    side = round(U * k)
    img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    box = [0, 0, side - 1, side - 1]
    if square:
        d.rectangle(box, fill=BLUE + (255,))
    else:
        d.rounded_rectangle(box, R_OUT * k, fill=BLUE + (255,))

    for pts in SHAPES:
        _polyline(d, _placed(pts, zoom), stroke, k)

    img = img.resize((size, size), Image.LANCZOS)
    if path:
        img.save(path)
    return img


def church_svg(stroke=STROKE, zoom=ZOOM):
    """Векторний майстер церкви. Для монограми його немає: літери довелось би
    перевести в криві, а fontTools на машині не стоїть."""
    def d(pts):
        head = f"M{pts[0][0]:g} {pts[0][1]:g}"
        return head + "".join(f"L{x:g} {y:g}" for x, y in pts[1:])

    def hexc(c):
        return "#%02x%02x%02x" % c

    bg = f'<rect width="160" height="160" rx="{R_OUT:g}" fill="{hexc(BLUE)}"/>'
    paths = "".join(f'<path d="{d(_placed(p, zoom))}"/>' for p in SHAPES)
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
