"""Словесна частина «Моя Церква»: Manrope 800, трекінг -0.04em, «Моя» синім.

Той самий напис, що в хедері (`src/components/shared/logo-link.tsx`), але
зібраний з метрик шрифту, а не з CSS: растр і вектор рахуються з одних
позицій, тому PNG для соцмереж і SVG-локап збігаються.

Шрифт лежить поруч — `brand/fonts/Manrope[wght].ttf`, ліцензія OFL
(`Manrope-OFL.txt`), так само як Geist для Open Graph.
"""
import os
from PIL import ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "fonts", "Manrope[wght].ttf")

TRACKING = -0.04  # em, як `tracking-[-0.04em]` у хедері
UPM = 2000.0
CAP = 1440 / UPM  # висота великої літери в em (OS/2 sCapHeight)
ASC = 1440 / UPM
DESC = 420 / UPM  # запас під «р» у «Церква»

WEIGHT_LOGO = 800  # логотип
WEIGHT_TEXT = 500  # гасло й підписи під логотипом

_cache = {}


def font(px, weight=WEIGHT_LOGO):
    """Екземпляр варіативного Manrope потрібної ваги."""
    key = (round(px, 2), weight)
    if key not in _cache:
        f = ImageFont.truetype(FONT, round(px))
        f.set_variation_by_axes([weight])
        _cache[key] = f
    return _cache[key]


def cap_to_px(cap_px):
    """Розмір шрифту, при якому велика літера має задану висоту."""
    return cap_px / CAP


def positions(text, px, weight=WEIGHT_LOGO, tracking=TRACKING):
    """Зсув кожної літери від лівого краю — спільний для растру й вектора."""
    f = font(px, weight)
    out, x = [], 0.0
    for ch in text:
        out.append(x)
        x += f.getlength(ch) + tracking * px
    return out, x - tracking * px  # хвостовий трекінг у ширину не йде


def width(text, px, weight=WEIGHT_LOGO, tracking=TRACKING):
    return positions(text, px, weight, tracking)[1]


def draw(d, xy, text, px, first, rest, weight=WEIGHT_LOGO, tracking=TRACKING):
    """Малює напис від (лівий край, базова лінія). Перше слово — кольором `first`.

    Перше слово синє не для краси: «Моя» — найсильніший аргумент бренду
    (BRAND.md, §2), тому воно звучить у самому логотипі.
    """
    x0, y = xy
    pos, w = positions(text, px, weight, tracking)
    split = text.find(" ")
    f = font(px, weight)
    for i, ch in enumerate(text):
        colour = first if (split < 0 or i < split) else rest
        d.text((x0 + pos[i], y), ch, font=f, fill=colour, anchor="ls")
    return w


# ------------------------------------------------------------------ вектор
def svg_paths(text, px, first, rest, weight=WEIGHT_LOGO, tracking=TRACKING):
    """[(d, колір)] з контурів гліфів — базова лінія в y=0, вісь y вниз.

    Потребує fontTools (`pip install fonttools`); растр без нього працює.
    """
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.misc.transform import Transform

    inst = instancer.instantiateVariableFont(TTFont(FONT), {"wght": weight}, inplace=False)
    gs, cmap = inst.getGlyphSet(), inst.getBestCmap()
    pos, _ = positions(text, px, weight, tracking)
    s = px / UPM
    split = text.find(" ")
    parts = {first: [], rest: []}
    for i, ch in enumerate(text):
        if ch == " ":
            continue
        colour = first if (split < 0 or i < split) else rest
        pen = SVGPathPen(gs)
        gs[cmap[ord(ch)]].draw(TransformPen(pen, Transform(s, 0, 0, -s, pos[i], 0)))
        parts[colour].append(pen.getCommands())
    return [(" ".join(v), k) for k, v in parts.items() if v]
