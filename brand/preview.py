"""Збирає preview.html: усе на одній сторінці, шрифт і картинки вшиті в base64."""
import base64
import glob
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(HERE, "out")
PUB = os.path.join(ROOT, "public")
MEDIA = os.path.join(ROOT, ".next", "dev", "static", "media")


def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()


def manrope_cyrillic():
    """Кириличний підмножинний файл Manrope із кешу next/font.

    Він варіативний — один і той самий для 500 і 800, тому беремо будь-який
    @font-face, чий unicode-range покриває кирилицю.
    """
    css = glob.glob(f"{ROOT}/.next/dev/static/chunks/*manrope*single.css")
    for blk in re.findall(r"@font-face\s*{[^}]*}", open(css[0]).read()):
        ur = re.search(r"unicode-range:\s*([^;]+)", blk)
        if ur and "U+400-45F" in ur.group(1):
            name = re.search(r'url\("\.\./media/([^"]+)"', blk).group(1)
            return os.path.join(MEDIA, name)
    raise SystemExit("не знайшов кириличний Manrope — запустіть `npm run dev`")


font = b64(manrope_cyrillic(), "font/woff2")
mark = open(f"{PUB}/logo.svg").read()
mark_white = open(f"{PUB}/brand/logo-white.svg").read()
small = open(f"{OUT}/mark-small.svg").read()
tg = b64(f"{PUB}/brand/telegram-avatar.png", "image/png")
apple = b64(f"{ROOT}/src/app/apple-icon.png", "image/png")
icons = {s: b64(f"{OUT}/icon-{s}.png", "image/png") for s in (16, 24, 32, 48)}

html = f"""<!doctype html><html lang="uk"><head><meta charset="utf-8">
<style>
@font-face {{ font-family: Manrope; font-weight: 100 900; font-display: block;
  src: url("{font}") format("woff2"); }}
:root {{ --brand:#0069e0; --ink:#0b1220; --muted:#5b6472; --line:#e6e9ee; }}
* {{ box-sizing:border-box; }}
body {{ margin:0; padding:48px; background:#fff; color:var(--ink);
  font:15px/1.5 -apple-system,system-ui,sans-serif; }}
h2 {{ font-size:13px; letter-spacing:.08em; text-transform:uppercase;
  color:var(--muted); font-weight:600; margin:0 0 16px; }}
section {{ margin-bottom:44px; padding-bottom:36px; border-bottom:1px solid var(--line); }}
.row {{ display:flex; align-items:center; gap:40px; flex-wrap:wrap; }}
.lockup {{ display:flex; align-items:center; gap:14px; }}
.lockup > span {{ display:inline-block; }}
.lockup svg {{ display:block; width:100%; height:auto; }}
.chip span[style] {{ display:inline-block; }}
.wm {{ font-family:Manrope; font-weight:800; letter-spacing:-.04em; line-height:1.15;
  white-space:nowrap; }}
.wm b {{ color:var(--brand); font-weight:800; }}
.dark {{ background:#0b1220; color:#fff; padding:28px 32px; border-radius:16px; }}
.dark .wm {{ color:#fff; }} .dark .wm b {{ color:#3d9bff; }}
.chip {{ display:flex; flex-direction:column; align-items:center; gap:8px;
  font:11px/1 ui-monospace,monospace; color:var(--muted); }}
.zoom {{ image-rendering:pixelated; }}
.btn {{ background:#0069e0; color:#fff; border:0; border-radius:10px; padding:11px 20px;
  font:600 15px/1 -apple-system,system-ui,sans-serif;
  box-shadow: inset 0 1px 0 1px #8cc2ff, 0 0 0 1px #005fc6; }}
.bar {{ display:flex; align-items:center; justify-content:space-between; gap:24px;
  border:1px solid var(--line); border-radius:14px; padding:14px 20px; max-width:720px; }}
.nav {{ display:flex; gap:22px; color:var(--muted); font-size:14px; }}
.avatar {{ width:96px; height:96px; border-radius:50%; overflow:hidden; }}
.avatar img {{ width:100%; height:100%; display:block; }}
.note {{ color:var(--muted); font-size:13px; margin-top:14px; }}
</style></head><body>

<section>
  <h2>Знак і словесна частина</h2>
  <div class="row">
    <div class="lockup"><span style="width:76px">{mark}</span>
      <span class="wm" style="font-size:40px"><b>Моя</b> Церква</span></div>
    <div class="lockup"><span style="width:44px">{mark}</span>
      <span class="wm" style="font-size:23px"><b>Моя</b> Церква</span></div>
    <div class="lockup"><span style="width:30px">{mark}</span>
      <span class="wm" style="font-size:16px"><b>Моя</b> Церква</span></div>
  </div>
  <div class="note">Manrope 800, трекінг −0.04em. «Моя» — <code>#0069e0</code>, «Церква» — колір тексту.</div>
</section>

<section>
  <h2>Виворіт</h2>
  <div class="row">
    <div class="dark"><div class="lockup"><span style="width:60px">{mark_white}</span>
      <span class="wm" style="font-size:32px"><b>Моя</b> Церква</span></div></div>
    <div class="dark"><div class="lockup" style="flex-direction:column;gap:18px">
      <span style="width:104px">{mark_white}</span>
      <span class="wm" style="font-size:26px"><b>Моя</b> Церква</span></div></div>
  </div>
</section>

<section>
  <h2>У хедері, поруч із кнопкою</h2>
  <div class="bar">
    <div class="lockup"><span style="width:32px">{mark}</span>
      <span class="wm" style="font-size:22px"><b>Моя</b> Церква</span></div>
    <div class="nav"><span>Модулі</span><span>Ціни</span><span>Про нас</span></div>
    <button class="btn">Залишити заявку</button>
  </div>
  <div class="note">Знак і кнопка — один синій <code>#0069e0</code>. Раніше знак був <code>#1438A8</code>.</div>
</section>

<section>
  <h2>Малі розміри — справжній піксель і збільшення ×6</h2>
  <div class="row">
    {''.join(f'<div class="chip"><img src="{icons[s]}" width="{s}"><span>{s}px</span></div>' for s in (16,24,32,48))}
    <div style="width:24px"></div>
    {''.join(f'<div class="chip"><img class="zoom" src="{icons[s]}" width="{s*6}"><span>{s}px ×6</span></div>' for s in (16,24,32))}
  </div>
  <div class="note">Для 16–32 px — спрощена побудова: 6 кружечків, ширший розрив, товщі перемички.</div>
</section>

<section>
  <h2>Аватарка Telegram-бота і піктограма застосунку</h2>
  <div class="row">
    <div class="chip"><div class="avatar"><img src="{tg}"></div><span>обрізка в коло</span></div>
    <div class="chip"><img src="{apple}" width="96" style="border-radius:21px"><span>apple-icon</span></div>
  </div>
</section>

</body></html>"""

open(f"{HERE}/preview.html", "w").write(html)
print(f"{HERE}/preview.html", len(html))
