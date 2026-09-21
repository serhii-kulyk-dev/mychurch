"""Словесний логотип «Моя Церква» у PNG великого розміру.

    python3 brand/logopng.py        # усе в brand/out/logo-png/

Те саме, що локапи в `social.py`, але не для стрічки, а щоб віддати файл
назовні: партнеру в презентацію, на друк, у чужий сайт. Тому висота великої
«М» — 400 px (напис виходить ~3400 px завширшки) і поруч лежить весь набір
фонів, щоб ніхто не перефарбовував напис руками.

Напис збирається з `word.py` (Manrope 800, трекінг -0.04em, «Моя» синім),
кольори — токени з `globals.css` через `social.py`.
"""
import os
from PIL import Image
import social as S

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out", "logo-png")

CAP = 400  # висота великої «М» у пікселях
INK_ONLY = S.Theme("ink-only", S.WHITE, S.INK, S.INK)  # друк в одну фарбу


def block(theme, stacked=False, slogan=None, transparent=True, pad=0.34):
    """Напис із полями `pad` (у частках висоти літери) на фоні теми або без нього."""
    w, h, _ = S.group_size(CAP, stacked, slogan)
    m = CAP * pad
    img = Image.new("RGBA", (round(w + 2 * m), round(h + 2 * m)),
                    (0, 0, 0, 0) if transparent else theme.bg + (255,))
    S.draw_group(img, (m, m), CAP, theme, stacked, slogan)
    return img


FILES = (
    ("logo-wordmark-colour.png", dict(theme=S.LIGHT)),
    ("logo-wordmark-ink.png", dict(theme=INK_ONLY)),
    ("logo-wordmark-white.png", dict(theme=S.BRANDED)),
    ("logo-wordmark-on-brand.png", dict(theme=S.BRANDED, transparent=False, pad=0.5)),
    ("logo-wordmark-on-dark.png", dict(theme=S.DARK, transparent=False, pad=0.5)),
    ("logo-wordmark-slogan.png", dict(theme=S.LIGHT, slogan=S.SLOGAN)),
    ("logo-stacked-colour.png", dict(theme=S.LIGHT, stacked=True)),
    ("logo-stacked-white.png", dict(theme=S.BRANDED, stacked=True)),
    ("logo-stacked-slogan-on-brand.png",
     dict(theme=S.BRANDED, stacked=True, slogan=S.SLOGAN, transparent=False, pad=0.5)),
)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, kw in FILES:
        img = block(**kw)
        img.save(os.path.join(OUT, name), optimize=True)
        print(f"{name:34} {img.width}×{img.height}")
    print("тека:", OUT)


if __name__ == "__main__":
    main()
