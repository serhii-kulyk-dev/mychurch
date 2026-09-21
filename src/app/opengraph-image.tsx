import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Статичний експорт: файл генерується під час збірки, не на запит. */
export const dynamic = "force-static";

/* Картинка для соцмереж і месенджерів — одна на весь сайт.

   Це не окремий макет, а закривна панель сайту (`sections/cta.tsx`),
   взята разом із її градієнтом, сяйвами й сіткою — той самий синій, та
   сама плашка з блакитною крапкою. Текст — заголовок і речення героя.

   Синя панель, а не тема сайту: вона однакова і в світлій, і в темній
   темі, тож картка не залежить від того, що обрав відвідувач, і в
   стрічці Telegram не зливається в чорний прямокутник.

   Знака немає — як і в хедері (`shared/logo-link.tsx`), бренд тримає
   сама словесна частина: Manrope 800, трекінг -0.04em, «Моя» синім.
   Заголовок і текст — Inter, той самий, що на сайті. Шрифти лежать
   статичними зрізами (див. brand/ogfonts.py): satori не вміє ні woff2
   з next/font, ні варіативні осі. */

export const alt = "Моя Церква — єдиний простір для вашої церкви";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Кольори закривної панелі (`sections/cta.tsx`) — вона навмисне однакова
   в обох темах, тому значення тут задані числами, а не токенами. */
const PANEL = "linear-gradient(115deg, #0a1f3d 0%, #06356e 52%, #0b4f9e 100%)";
const INK = "#ffffff";
const INK_2 = "rgba(255,255,255,0.70)";
/* Блакитний акцент панелі: крапка в плашці, хвіст заголовка. */
const ACCENT = "#8cc2ff";
const BADGE_BG = "rgba(255,255,255,0.10)";
const HAIRLINE = "rgba(255,255,255,0.20)";
const GRID_LINE = "rgba(255,255,255,0.07)";

/* Ті самі два сяйва, що в панелі: тепле синє зліва згори й блакитне
   справа знизу. Координати перелічені з її 1120px на кадр 1200×630. */
const AURORAS = [
  { x: 240, y: 0, r: 620, a: "rgba(0,122,255,0.55)" },
  { x: 1030, y: 620, r: 520, a: "rgba(140,194,255,0.30)" },
];

const GRID_STEP = 54; // як `backgroundSize: 54px` у панелі

/* Плашка бере на себе те, чого не кажуть ні заголовок, ні рядок ролей:
   що це за категорія і що вона українська — головна відмінність від
   закордонних ChMS (BRAND.md). */
const BADGE = "Допомагаємо досягати людей";
/* Заголовок героя з зафіксованим хвостом: на сайті останній рядок
   перебирає «вашої церкви / вашого служіння / вашої групи», на картці
   стоїть перший варіант — і так само синім. */
const HEADLINE_TOP = "Єдиний простір для";
const HEADLINE_TAIL = "вашої церкви";
/* Рядок під заголовком відповідає на «а це для кого» — ті самі ролі,
   що й на /for-whom. */
const SUBTITLE = "Для пасторів, лідерів, служителів, членів церкви, гостей";

/* Сітку героя малюємо лініями, а не тлом: satori не вміє ні повторювати
   градієнт через background-size, ні гасити його маскою по краях. */
function grid() {
  const lines = [];
  for (let x = GRID_STEP; x < size.width; x += GRID_STEP) {
    lines.push(
      <div key={`v${x}`} style={{ position: "absolute", left: x, top: 0, width: 1, height: size.height, background: GRID_LINE }} />
    );
  }
  for (let y = GRID_STEP; y < size.height; y += GRID_STEP) {
    lines.push(
      <div key={`h${y}`} style={{ position: "absolute", left: 0, top: y, width: size.width, height: 1, background: GRID_LINE }} />
    );
  }
  return lines;
}

export default async function OpengraphImage() {
  const [manrope, semibold, regular] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Manrope-ExtraBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Inter-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Inter-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PANEL,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {AURORAS.map((glow) => (
          <div
            key={`${glow.x}-${glow.y}`}
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle ${glow.r}px at ${glow.x}px ${glow.y}px, ${glow.a} 0%, rgba(140,194,255,0) 100%)`,
            }}
          />
        ))}

        {grid()}

        {/* Хедер: лише словесна частина, знака немає. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 44,
            left: 64,
            fontFamily: "Manrope",
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: -1.44,
          }}
        >
          <span style={{ color: ACCENT }}>Моя</span>
          <span style={{ color: INK }}>&nbsp;Церква</span>
        </div>

        {/* Перший екран */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
            width: "100%",
            height: "100%",
            padding: "0 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: BADGE_BG,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 999,
              padding: "9px 18px 9px 13px",
            }}
          >
            <div style={{ width: 9, height: 9, borderRadius: 999, background: ACCENT }} />
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.85)", letterSpacing: -0.2 }}>{BADGE}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 88, fontWeight: 600, color: INK, letterSpacing: -2.9, lineHeight: 1.06 }}>
              {HEADLINE_TOP}
            </div>
            <div style={{ display: "flex", fontSize: 88, fontWeight: 600, color: ACCENT, letterSpacing: -2.9, lineHeight: 1.06 }}>
              {HEADLINE_TAIL}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 29, color: INK_2, letterSpacing: -0.3 }}>{SUBTITLE}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semibold, style: "normal", weight: 600 },
        { name: "Inter", data: regular, style: "normal", weight: 400 },
        { name: "Manrope", data: manrope, style: "normal", weight: 800 },
      ],
    }
  );
}
