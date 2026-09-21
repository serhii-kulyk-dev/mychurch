"""Набір бренд-файлів для соцмереж: аватарки, обкладинки, локапи.

    python3 brand/social.py        # усе в brand/out/social/

Знака тут немає — логотип сьогодні словесний (`src/components/shared/logo-link.tsx`),
і в соцмережах він має бути таким самим. Напис збирається з `word.py`
(Manrope 800, трекінг -0.04em, «Моя» синім), кольори — токени з `globals.css`.
Нічого не малюється руками: правимо константи тут і перезбираємо.

SVG-локапи потребують fontTools (`pip install fonttools`) — без нього
збираються тільки PNG, вектор пропускається з попередженням.
"""
import math
import os
import shutil
from PIL import Image, ImageDraw
import word

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(HERE, "out", "social")

# ---------------------------------------------------------------- кольори
BRAND = (0, 105, 224)        # --brand
BRAND_DARK = (61, 155, 255)  # --brand у темній темі
INK = (11, 11, 15)           # --ink
SURFACE_DARK = (17, 21, 29)  # --surface у темній темі
WHITE = (255, 255, 255)


def mix(c, bg, a):
    return tuple(round(x * a + y * (1 - a)) for x, y in zip(c, bg))


class Theme:
    """Фон і кольори тексту — більше на плакаті бренду нічого немає."""

    def __init__(self, name, bg, first, rest):
        self.name, self.bg, self.first, self.rest = name, bg, first, rest
        self.muted = mix(rest, bg, 0.6)


LIGHT = Theme("light", WHITE, BRAND, INK)
BRANDED = Theme("brand", BRAND, WHITE, WHITE)
DARK = Theme("ink", SURFACE_DARK, BRAND_DARK, WHITE)

LOGO = "Моя Церква"
FIRST, SECOND = LOGO.split(" ")
SLOGAN = "Досягай людей"
TAGLINE = "Організація церковних процесів"
SITE = "mychurch.com.ua"

# ------------------------------------------------ пропорції, все в C
# C — висота великої літери «М». Решта рахується від неї.
SUB_GAP = 0.92    # базова лінія напису → базова лінія гасла
SUB_CAP = 0.40    # висота великої літери гасла
FOOT_GAP = 0.78   # базова лінія гасла → базова лінія підпису
FOOT_CAP = 0.30   # висота великої літери підпису
STACK_GAP = 1.26  # базова лінія «Моя» → базова лінія «Церква»
DESC = word.DESC / word.CAP  # запас під «р» у частках C


# ------------------------------------------------------------- композиція
def _line(d, box_w, x0, y, text, px, colour, weight=word.WEIGHT_TEXT, tracking=0.0):
    w = word.width(text, px, weight, tracking)
    word.draw(d, (x0 + (box_w - w) / 2, y), text, px, colour, colour, weight, tracking)
    return w


def group_size(cap, stacked=False, slogan=None, foot=None):
    """Габарити напису з підписами: (ширина, висота, базова лінія від верху)."""
    px = word.cap_to_px(cap)
    w = max(word.width(FIRST, px), word.width(SECOND, px)) if stacked else word.width(LOGO, px)
    base = cap
    bottom = cap * (STACK_GAP + DESC) if stacked else cap * DESC
    if slogan:
        bottom = cap * (SUB_GAP + SUB_CAP * DESC) + (cap * STACK_GAP if stacked else 0)
        w = max(w, word.width(slogan, word.cap_to_px(cap * SUB_CAP), word.WEIGHT_TEXT, 0))
    if foot:
        bottom = cap * (SUB_GAP + FOOT_GAP + FOOT_CAP * DESC) + (cap * STACK_GAP if stacked else 0)
        w = max(w, word.width(foot, word.cap_to_px(cap * FOOT_CAP), word.WEIGHT_TEXT, 0))
    return w, base + bottom, base


def draw_group(img, xy, cap, theme, stacked=False, slogan=None, foot=None):
    """Малює «Моя Церква» з гаслом і підписом, усе по центру блока."""
    x0, y0 = xy
    w, _, base = group_size(cap, stacked, slogan, foot)
    d = ImageDraw.Draw(img)
    px = word.cap_to_px(cap)
    y = y0 + base

    if stacked:
        _line(d, w, x0, y, FIRST, px, theme.first, word.WEIGHT_LOGO, word.TRACKING)
        y += cap * STACK_GAP
        _line(d, w, x0, y, SECOND, px, theme.rest, word.WEIGHT_LOGO, word.TRACKING)
    else:
        lw = word.width(LOGO, px)
        word.draw(d, (x0 + (w - lw) / 2, y), LOGO, px, theme.first, theme.rest)

    if slogan:
        _line(d, w, x0, y + cap * SUB_GAP, slogan, word.cap_to_px(cap * SUB_CAP), theme.rest)
    if foot:
        _line(d, w, x0, y + cap * (SUB_GAP + FOOT_GAP), foot,
              word.cap_to_px(cap * FOOT_CAP), theme.muted)


def fit_cap(box_w, box_h, stacked=False, slogan=None, foot=None):
    """Найбільша висота літери, за якої блок вміщається в безпечну зону."""
    w1, h1, _ = group_size(100, stacked, slogan, foot)
    return min(box_w / w1, box_h / h1) * 100


def canvas(w, h, theme):
    return Image.new("RGBA", (w, h), theme.bg + (255,))


# ---------------------------------------------------------------- аватарки
def avatar(size, theme, text=FIRST, stacked=False):
    """Квадрат під круглий кроп: одне слово «Моя» або напис у два рядки.

    «Моя» — не скорочення заради місця: це найсильніший аргумент бренду
    (BRAND.md, §2), і на 32 пікселях воно ще читається, а повний напис — ні.
    """
    img = canvas(size, size, theme)
    d = ImageDraw.Draw(img)
    limit = size * 0.66  # хорда кола з запасом: у кут нічого не заходить
    if stacked:
        cap = size * 0.22
        px = word.cap_to_px(cap)
        w = max(word.width(FIRST, px), word.width(SECOND, px))
        if w > limit:
            px *= limit / w
            cap = px * word.CAP
        h = cap * (1 + STACK_GAP)
        y = (size - h) / 2 + cap
        _line(d, size, 0, y, FIRST, px, theme.first, word.WEIGHT_LOGO, word.TRACKING)
        _line(d, size, 0, y + cap * STACK_GAP, SECOND, px, theme.rest,
              word.WEIGHT_LOGO, word.TRACKING)
    else:
        cap = size * 0.34
        px = word.cap_to_px(cap)
        w = word.width(text, px)
        if w > limit:
            px *= limit / w
            cap = px * word.CAP
        _line(d, size, 0, (size + cap) / 2, text, px, theme.first,
              word.WEIGHT_LOGO, word.TRACKING)
    return img


# ---------------------------------------------------------------- формати
# ім'я, ширина, висота, безпечна зона (x, y, ш, в), підпис у README
COVERS = [
    ("facebook-cover", 1640, 856, (220, 220, 1200, 416),
     "Обкладинка сторінки Facebook. На комп'ютері видно центральну смугу — напис у ній."),
    ("x-header", 1500, 500, (400, 90, 1000, 300),
     "Шапка X. Лівий нижній кут перекриває аватарка, тому напис зміщений праворуч."),
    ("youtube-banner", 2560, 1440, (507, 508, 1546, 423),
     "Банер каналу YouTube. Напис у центральній зоні 1546×423 — її видно на телефоні."),
    ("linkedin-cover", 1128, 191, (330, 24, 700, 143),
     "Обкладинка сторінки LinkedIn. Ліворуч сидить логотип сторінки — там порожньо."),
    ("cover-1920x1080", 1920, 1080, (260, 240, 1400, 600),
     "Універсальна широка картка: спільнота Viber, Google Бізнес, титул презентації."),
    ("share-1200x630", 1200, 630, (130, 130, 940, 370),
     "Картка для поста й пересилання. Прев'ю самого сайту в месенджерах генерується "
     "окремо (src/app/opengraph-image.tsx) — цей файл для ручних постів."),
    ("instagram-post", 1080, 1080, (120, 240, 840, 600),
     "Квадратний пост Instagram і Facebook."),
    ("instagram-story", 1080, 1920, (120, 560, 840, 800),
     "Сторіс. Верх і низ лишаються порожні під інтерфейс мережі."),
]

AVATAR_SIZES = (1024, 512, 400)


def cover(w, h, safe, theme, slogan=SLOGAN, foot=SITE):
    img = canvas(w, h, theme)
    sx, sy, sw, sh = safe
    cap = fit_cap(sw, sh, False, slogan, foot)
    gw, gh, _ = group_size(cap, False, slogan, foot)
    draw_group(img, (sx + (sw - gw) / 2, sy + (sh - gh) / 2), cap, theme, False, slogan, foot)
    return img


# ------------------------------------------------------------- SVG-локапи
def lockup_svg(first, rest, stacked=False, cap=100.0):
    """Напис у кривих: файл не залежить від того, чи є Manrope на машині."""
    px = word.cap_to_px(cap)
    if stacked:
        w = max(word.width(FIRST, px), word.width(SECOND, px))
        h = cap * (1 + STACK_GAP + DESC)
        body = ""
        for text, colour, y in ((FIRST, first, cap), (SECOND, rest, cap * (1 + STACK_GAP))):
            x = (w - word.width(text, px)) / 2
            for d, c in word.svg_paths(text, px, colour, colour):
                body += f'<path d="{d}" fill="{c}" transform="translate({x:.2f} {y:.2f})"/>'
    else:
        w, h = word.width(LOGO, px), cap * (1 + DESC)
        body = "".join(f'<path d="{d}" fill="{c}" transform="translate(0 {cap:.2f})"/>'
                       for d, c in word.svg_paths(LOGO, px, first, rest))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'width="{w:.0f}" height="{h:.0f}" fill="none">{body}</svg>')


# --------------------------------------------------- аватарка в Telegram
TG_SECOND = (168, 205, 250)  # «Церква» світліша: «Моя» лишається головною
TG_SAFE = 0.90               # частка радіуса, далі напис не заходить
TG_RATIO = 0.58              # висота «Церква» відносно «Моя»
TG_GAP = 0.26                # проміжок між рядками в частках великої «М»


def tg_avatar(size=512, first=WHITE, second=TG_SECOND, bg=BRAND):
    """Квадрат, який Telegram ріже в коло: напис вписано в коло, не в квадрат.

    `lockup_png` тут не годиться — його поля рахуються від прямокутника, і
    круглий кроп лишає дрібний напис посередині кружечка. Тому габарит двох
    рядків вписуємо в коло по діагоналі: напис займає весь видимий кружечок.

    Два рядки, а не один: щоб «Моя Церква» влізло в ширину кола одним рядком,
    кегль падає вдвічі, і в списку чатів (~50 px) лишається пляма.
    """
    lines = ((FIRST, 1.0, first), (SECOND, TG_RATIO, second))
    # рахуємо габарит при умовній висоті літери 100, далі масштабуємо
    ws = [word.width(t, word.cap_to_px(100 * k)) for t, k, _ in lines]
    hs = [100 * k for _, k, _ in lines]
    bw, bh = max(ws), sum(hs) + TG_GAP * 100 * (len(lines) - 1)
    s = size * TG_SAFE / math.hypot(bw, bh)  # діагональ = діаметр безпечного кола
    cap = 100 * s

    img = Image.new("RGBA", (size, size), bg + (255,))
    d = ImageDraw.Draw(img)
    y = (size - bh * s) / 2
    for (text, k, colour), w0, h0 in zip(lines, ws, hs):
        px = word.cap_to_px(cap * k)
        word.draw(d, ((size - w0 * s) / 2, y + h0 * s), text, px, colour, colour)
        y += h0 * s + TG_GAP * cap
    return img


def lockup_png(cap, theme, stacked=False, transparent=True, pad=0.34):
    """Той самий напис растром — з прозорим фоном або на фоні теми."""
    w, h, _ = group_size(cap, stacked)
    m = cap * pad
    img = Image.new("RGBA", (round(w + 2 * m), round(h + 2 * m)),
                    (0, 0, 0, 0) if transparent else theme.bg + (255,))
    draw_group(img, (m, m), cap, theme, stacked)
    return img


# ------------------------------------------------------------------ збірка
MADE = []  # (шлях відносно OUT, підпис для README і прев'ю)


def add(content, rel, caption):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if isinstance(content, str):
        open(path, "w").write(content)
    else:
        content.save(path, optimize=True)
    MADE.append((rel, caption))


def build_avatars():
    for size in AVATAR_SIZES:
        add(avatar(size, BRANDED), f"avatar/word-brand-{size}.png",
            "Основна аватарка: «Моя» виворотом на синьому. Telegram чекає 512, X — 400.")
    add(avatar(1024, LIGHT), "avatar/word-light-1024.png",
        "«Моя» синім на білому — там, де навколо темний інтерфейс.")
    add(avatar(1024, DARK), "avatar/word-ink-1024.png",
        "«Моя» на темному — для світлих стрічок.")
    for size in (1024, 512):
        add(avatar(size, BRANDED, stacked=True), f"avatar/stacked-brand-{size}.png",
            "Повний напис у два рядки. Читається від 200 пікселів — для обкладинок "
            "груп і профілів, які показують аватарку великою.")
    add(avatar(1024, LIGHT, stacked=True), "avatar/stacked-light-1024.png",
        "Повний напис у два рядки, на білому.")


def build_covers():
    for name, w, h, safe, note in COVERS:
        for theme in (LIGHT, BRANDED):
            suffix = "" if theme is LIGHT else "-brand"
            add(cover(w, h, safe, theme), f"cover/{name}{suffix}-{w}x{h}.png",
                note if theme is LIGHT else f"{note} Синій варіант.")


def build_lockups():
    for theme, name, stacked in (
        (LIGHT, "wordmark-colour", False),
        (BRANDED, "wordmark-white", False),
        (LIGHT, "stacked-colour", True),
        (BRANDED, "stacked-white", True),
    ):
        add(lockup_png(240, theme, stacked), f"lockup/{name}.png",
            "Напис растром, прозорий фон — для презентацій і партнерських сторінок.")
    try:
        for name, first, rest, stacked in (
            ("wordmark-colour", "#0069e0", "#0b0b0f", False),
            ("wordmark-white", "#ffffff", "#ffffff", False),
            ("wordmark-ink", "#0b0b0f", "#0b0b0f", False),
            ("wordmark-dark", "#3d9bff", "#ffffff", False),
            ("stacked-colour", "#0069e0", "#0b0b0f", True),
            ("stacked-white", "#ffffff", "#ffffff", True),
        ):
            add(lockup_svg(first, rest, stacked), f"lockup/{name}.svg",
                "Векторний напис у кривих — шрифт на машині не потрібен.")
    except ImportError:
        print("! SVG-локапи пропущено: немає fontTools (pip install fonttools)")


README_HEAD = """# Бренд для соцмереж — «Моя Церква»

Усе в цій теці зібрано скриптом і руками не редагується:

    python3 brand/social.py

Логотип сьогодні словесний, тому і в соцмережах він словесний — знака в цих
файлах немає. Напис збирається з `brand/word.py` (Manrope 800, трекінг
-0.04em, «Моя» синім), кольори — токени з `src/app/globals.css`.

## Кольори

| Токен | Значення | Де |
|---|---|---|
| `--brand` | `#0069e0` | слово «Моя», синій фон |
| `--ink` | `#0b0b0f` | «Церква» на світлому |
| `--surface` (темна тема) | `#11151d` | темний фон |
| `--brand` (темна тема) | `#3d9bff` | «Моя» на темному |

Без градієнтів і тіней — правило 7 у `BRAND.md`.

## Що куди вантажити

| Мережа | Аватарка | Обкладинка |
|---|---|---|
| Telegram (канал, бот) | `avatar/word-brand-512.png` | — |
| Facebook | `avatar/word-brand-1024.png` | `cover/facebook-cover-1640x856.png` |
| Instagram | `avatar/word-brand-1024.png` | — |
| YouTube | `avatar/word-brand-1024.png` | `cover/youtube-banner-2560x1440.png` |
| X | `avatar/word-brand-400.png` | `cover/x-header-1500x500.png` |
| LinkedIn | `avatar/word-brand-1024.png` | `cover/linkedin-cover-1128x191.png` |
| Viber, Google Бізнес | `avatar/word-brand-1024.png` | `cover/cover-1920x1080.png` |
| Пости й пересилання | — | `cover/share-1200x630.png`, `cover/instagram-post-1080x1080.png` |

Аватарку всюди обрізають у коло — відступ уже закладений, нічого не
домальовуємо зверху й не додаємо рамок.

## Одне слово чи два

За замовчуванням в аватарці стоїть **«Моя»**: на 32 пікселях у списку чатів
повний напис перетворюється на пляму, а одне слово читається. Це не
скорочення заради місця — «Моя» і є головний аргумент бренду (`BRAND.md`, §2).
Варіант `stacked-*` з повним написом у два рядки беремо там, де аватарку
показують великою. Мішати не варто: одна аватарка в усіх мережах.

## Файли

"""


def build_readme():
    rows = "\n".join(f"| `{rel}` | {cap} |" for rel, cap in sorted(MADE))
    open(os.path.join(OUT, "README.md"), "w").write(
        README_HEAD + "| Файл | Що це |\n|---|---|\n" + rows + "\n")


def build_preview():
    cards = "\n".join(
        f'<figure><img src="{rel}" alt=""><figcaption><code>{rel}</code>{cap}</figcaption></figure>'
        for rel, cap in sorted(MADE))
    open(os.path.join(OUT, "preview.html"), "w").write(f"""<!doctype html>
<meta charset="utf-8"><title>Моя Церква — файли для соцмереж</title>
<style>
 body{{font:15px/1.5 system-ui,sans-serif;margin:40px;background:#f4f5f7;color:#0b0b0f}}
 h1{{font-size:24px;letter-spacing:-.02em}}
 .grid{{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}}
 figure{{margin:0;background:#fff;border:1px solid #e6e8ec;border-radius:16px;padding:16px}}
 img{{max-width:100%;display:block;margin:0 auto 12px;
     background:conic-gradient(#eee 0 25%,#fff 0 50%,#eee 0 75%,#fff 0) 0 0/20px 20px}}
 figcaption{{font-size:13px;color:rgba(11,11,15,.6)}}
 code{{display:block;font-size:12px;color:#0069e0;margin-bottom:4px}}
</style>
<h1>Моя Церква — файли для соцмереж</h1>
<p>Зібрано <code>python3 brand/social.py</code>. Опис — у <a href="README.md">README.md</a>.</p>
<div class="grid">
{cards}
</div>
""")


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(OUT, exist_ok=True)
    build_avatars()
    build_covers()
    build_lockups()
    build_readme()
    build_preview()
    print(f"{len(MADE)} файлів у brand/out/social/ — опис у README.md, "
          f"усе разом у preview.html")


if __name__ == "__main__":
    main()
