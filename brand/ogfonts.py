"""Шрифти для картинок соцмереж.

    pip install fonttools brotli && python3 brand/ogfonts.py

Картинки для Open Graph малює satori (`next/og`), і він читає лише
статичні ttf: ні woff2 з `next/font`, ні варіативні осі йому не даються.
`brand/fonts/Manrope[wght].ttf` він показав би дефолтною вагою 200 —
павутиною замість логотипа. Тому вирізаємо потрібні ваги наперед.

Manrope лежить поруч, а Inter у репозиторії немає: його тягне `next/font`
під час збірки. Беремо його звідти — з `.static/_next/static/media`.
Google роздає Inter підмножинами (латиниця, кирилиця, грецька… окремими
файлами), тож їх треба зшити в один шрифт, інакше в заголовку замість
кирилиці будуть порожні квадрати.

Результат лежить у репозиторії — скрипт потрібен лише щоб його оновити,
і запускати його треба після `npm run build`.
"""
import glob
import os
import shutil
import tempfile

from fontTools.merge import Merger
from fontTools.subset import Subsetter
from fontTools.ttLib import TTFont
from fontTools.ttLib.woff2 import decompress
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "src", "assets", "fonts")
MEDIA = os.path.join(ROOT, ".static", "_next", "static", "media")
MANROPE = os.path.join(HERE, "fonts", "Manrope[wght].ttf")

# Латиниця з розширеннями, кирилиця й типографська пунктуація («—», «'»).
# Решту підмножин (грецька, вʼєтнамська) викидаємо — це половина ваги файлу.
KEEP = ["U+0000-024F", "U+0400-04FF", "U+2000-206F", "U+20A0-20BF"]


def family(font):
    return {r.nameID: str(r) for r in font["name"].names if r.platformID == 3}.get(1, "")


def trim(font):
    """Лишає тільки потрібні діапазони — файл худне десь утричі."""
    s = Subsetter()
    s.populate(unicodes=[c for r in KEEP for c in _range(r)])
    s.subset(font)
    return font


def _range(spec):
    lo, _, hi = spec[2:].partition("-")
    return range(int(lo, 16), int(hi, 16) + 1)


def save(font, name):
    path = os.path.join(OUT, name)
    font.save(path)
    print(f"{name}: {os.path.getsize(path) // 1024} КБ")


def inter(weight, name, tmp):
    """Inter потрібної ваги, зшитий з усіх підмножин, які поклав next/font."""
    parts = []
    for i, src in enumerate(sorted(glob.glob(os.path.join(MEDIA, "*.woff2")))):
        ttf = os.path.join(tmp, f"{i}.ttf")
        decompress(src, ttf)
        if family(TTFont(ttf)) != "Inter":
            continue
        cut = os.path.join(tmp, f"{i}-{weight}.ttf")
        instantiateVariableFont(TTFont(ttf), {"wght": weight}).save(cut)
        parts.append(cut)
    if not parts:
        raise SystemExit(f"Inter не знайдено в {MEDIA} — спершу `npm run build`")
    save(trim(Merger().merge(parts)), name)


os.makedirs(OUT, exist_ok=True)

# 800 — словесна частина логотипа, як у хедері (shared/logo-link.tsx).
save(instantiateVariableFont(TTFont(MANROPE), {"wght": 800}, updateFontNames=True), "Manrope-ExtraBold.ttf")

# 600 — заголовки (`font-semibold` героя), 400 — текст під ними.
with tempfile.TemporaryDirectory() as tmp:
    inter(600, "Inter-SemiBold.ttf", tmp)
    inter(400, "Inter-Regular.ttf", tmp)

shutil.copyfile(os.path.join(HERE, "fonts", "Manrope-OFL.txt"), os.path.join(OUT, "Manrope-OFL.txt"))
print("Manrope-OFL.txt")
