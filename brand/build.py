"""Збирає весь набір файлів знака з одного джерела геометрії (gen.py).

    python3 brand/build.py

Кладе файли одразу туди, де їх чекає застосунок (`public/`, `src/app/`),
а додаткові формати — у `brand/out/`. Нічого не малюється руками: щоб змінити
знак, правимо параметри вгорі `gen.py` і перезбираємо.
"""
import io
import os
import struct
from PIL import Image
import gen

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(HERE, "out")
PUB = os.path.join(ROOT, "public")
APP = os.path.join(ROOT, "src", "app")
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(PUB, "brand"), exist_ok=True)

BRAND = (0, 105, 224)  # --brand, #0069e0 — той самий синій, що в кнопках
WHITE = (255, 255, 255)
INK = (11, 18, 32)

# Спрощена побудова для 16-32 px: менше кружечків, ширший розрив, товщі
# перемички — інакше на фавіконі окрема фігура зливається з кільцем.
SMALL = dict(N=6, r=0.40, rf=0.12, DIST=1.35)


def write_ico(path, images):
    """ICO — це контейнер: заголовок, каталог і PNG-и всередині."""
    blobs = []
    for im in images:
        b = io.BytesIO()
        im.save(b, "PNG")
        blobs.append(b.getvalue())
    head = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries, body = b"", b""
    for im, blob in zip(images, blobs):
        w = 0 if im.width >= 256 else im.width  # 0 означає 256
        entries += struct.pack("<BBBBHHII", w, w, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
        body += blob
    open(path, "wb").write(head + entries + body)


def params(**kw):
    """Тимчасово підміняє параметри геометрії, повертає старі."""
    old = {k: getattr(gen, k) for k in kw}
    for k, v in kw.items():
        setattr(gen, k, v)
    return old


def main():
    bad, total = gen.check()
    assert bad / total < 0.01, f"контур не збігається з маскою: {bad}/{total}"

    # ---- векторний майстер -------------------------------------------
    open(f"{PUB}/logo.svg", "w").write(gen.svg("#0069e0"))
    open(f"{PUB}/brand/logo-white.svg", "w").write(gen.svg("#ffffff"))
    open(f"{OUT}/mark-ink.svg", "w").write(gen.svg("#0b1220"))

    # ---- компонент для хедера: колір бере з теми, тому не PNG ---------
    comp = os.path.join(ROOT, "src", "components", "shared", "brand-mark.tsx")
    open(comp, "w").write(
        "/* Згенеровано `python3 brand/build.py` з `brand/gen.py` — руками не правимо.\n"
        "   Знак бере колір з теми (`currentColor`), щоб на темному фоні світлішав\n"
        "   разом із рештою бренду. Растр для OG і аватарок — у `public/`. */\n\n"
        "export default function BrandMark({ className }: { className?: string }) {\n"
        '  return (\n'
        '    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>\n'
        f'      <path d="{gen.path_d()}" fill="currentColor" />\n'
        "    </svg>\n"
        "  );\n"
        "}\n")

    # ---- растр для застосунку ----------------------------------------
    gen.to_png(512, BRAND, 0.05, path=f"{PUB}/logo.png")
    gen.to_png(512, BRAND, 0.05, path=f"{APP}/icon.png")
    gen.to_png(180, BRAND, 0.13, bg=WHITE + (255,), path=f"{APP}/apple-icon.png")
    gen.to_png(1024, BRAND, 0.05, path=f"{OUT}/logo-1024.png")

    # ---- аватарка бота: обрізається в коло, тому виворіт із відступом --
    tg = Image.new("RGBA", (512, 512), BRAND + (255,))
    tg.alpha_composite(gen.to_png(512, WHITE, 0.20))
    tg.save(f"{PUB}/brand/telegram-avatar.png")

    # ---- фавікон: малі розміри — зі спрощеної побудови ----------------
    old = params(**SMALL)
    open(f"{OUT}/mark-small.svg", "w").write(gen.svg("#0069e0"))
    icons = {s: gen.to_png(s, BRAND, 0.03) for s in (16, 24, 32)}
    params(**old)
    icons.update({s: gen.to_png(s, BRAND, 0.04) for s in (48, 64, 128, 256)})
    write_ico(f"{APP}/favicon.ico", [icons[s] for s in sorted(icons)])
    for s, im in icons.items():
        im.save(f"{OUT}/icon-{s}.png")

    print("у застосунок: public/logo.svg, public/logo.png, public/brand/,")
    print("              src/components/shared/brand-mark.tsx,")
    print("              src/app/icon.png, apple-icon.png, favicon.ico")
    print("додатково:    brand/out/", sorted(os.listdir(OUT)))


if __name__ == "__main__":
    main()
