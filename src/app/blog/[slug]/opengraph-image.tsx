import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BLOG_CATEGORIES, BLOG_SLUGS, getPost } from "@/content/blog";

/* Статичний експорт: файл генерується під час збірки, не на запит. */
export const dynamic = "force-static";

/* Обкладинка статті для соцмереж і месенджерів.

   Одна картинка на весь сайт погано працює для блогу: у стрічці
   двадцять одна стаття виглядає як двадцять одне однакове посилання.
   Тут на картці — заголовок самої статті, рубрика й дата.

   Поверхня й шрифти — ті самі, що в спільній картці (../../opengraph-image.tsx):
   синя закривна панель сайту, знака немає, бренд тримає словесна частина
   в Manrope 800, заголовок — Inter, як на сторінці самої статті.

   Ця ж адреса йде в розмітку BlogPosting як `image`: Google хоче
   обкладинку від 1200px завширшки, а логотип на 256px їй не був. */

export const alt = "Стаття в блозі «Моєї Церкви»";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Сторінок мало й вони відомі наперед — генеруємо на білді. */
export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

/* Кольори закривної панелі (`sections/cta.tsx`) — див. спільну картку. */
const PANEL = "linear-gradient(115deg, #0a1f3d 0%, #06356e 52%, #0b4f9e 100%)";
const GLOW = "radial-gradient(circle 620px at 240px 0px, rgba(0,122,255,0.55) 0%, rgba(0,122,255,0) 100%)";
const INK = "#ffffff";
const INK_2 = "rgba(255,255,255,0.70)";
const INK_3 = "rgba(255,255,255,0.55)";
const ACCENT = "#8cc2ff";
const BADGE_BG = "rgba(255,255,255,0.10)";
const HAIRLINE = "rgba(255,255,255,0.20)";

const MONTHS = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
];

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/* Заголовки різної довжини мають займати однакову висоту блоку. */
function titleSize(title: string) {
  if (title.length <= 38) return 68;
  if (title.length <= 56) return 58;
  return 48;
}

export default async function BlogOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const copy = post?.copy.ua;
  const category = BLOG_CATEGORIES.ua.find((c) => c.id === post?.category);

  const [manrope, semibold, regular] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Manrope-ExtraBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Inter-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Inter-Regular.ttf")),
  ]);

  const title = copy?.title ?? "Блог «Моєї Церкви»";
  const lead = copy?.lead ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: PANEL,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: GLOW }} />

        {/* Хедер: словесна частина й рубрика. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontFamily: "Manrope", fontSize: 36, fontWeight: 800, letterSpacing: -1.44 }}>
            <span style={{ color: ACCENT }}>Моя</span>
            <span style={{ color: INK }}>&nbsp;Церква</span>
          </div>

          {category ? (
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "rgba(255,255,255,0.85)",
                background: BADGE_BG,
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {category.title}
            </div>
          ) : null}
        </div>

        {/* Заголовок статті */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1000 }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize(title),
              fontWeight: 600,
              color: INK,
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {lead ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: INK_2,
                letterSpacing: -0.5,
                lineHeight: 1.35,
              }}
            >
              {lead.length > 130 ? `${lead.slice(0, 128).trimEnd()}…` : lead}
            </div>
          ) : null}
        </div>

        {/* Підвал */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, color: ACCENT, letterSpacing: -0.3 }}>Блог</span>
          {post ? (
            <span style={{ display: "flex", fontSize: 19, color: INK_3 }}>
              {formatDate(post.updated ?? post.date)}
            </span>
          ) : null}
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
