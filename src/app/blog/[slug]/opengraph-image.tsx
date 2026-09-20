import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BLOG_CATEGORIES, BLOG_SLUGS, getPost } from "@/content/blog";
import { SITE_URL } from "@/lib/seo";

/* Статичний експорт: файл генерується під час збірки, не на запит. */
export const dynamic = "force-static";

/* Обкладинка статті для соцмереж і месенджерів.

   Одна картинка на весь сайт погано працює для блогу: у стрічці
   двадцять одна стаття виглядає як двадцять одне однакове посилання.
   Тут на картці — заголовок самої статті, рубрика й дата.

   Ця ж адреса йде в розмітку BlogPosting як `image`: Google хоче
   обкладинку від 1200px завширшки, а логотип на 256px їй не був. */

export const alt = "Стаття в блозі «Моєї Церкви»";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Сторінок мало й вони відомі наперед — генеруємо на білді. */
export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

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

  const [font, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "public/logo.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          background: "linear-gradient(150deg, #0a1f3d 0%, #06356e 48%, #0b4f9e 100%)",
          fontFamily: "Geist",
        }}
      >
        {/* Бренд і рубрика */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={logoSrc} width={40} height={40} alt="" />
            </div>
            <span style={{ fontSize: 32, color: "#ffffff", letterSpacing: -0.8 }}>MyChurch</span>
          </div>

          {category ? (
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "rgba(255,255,255,0.82)",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
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
              color: "#ffffff",
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
                color: "rgba(255,255,255,0.6)",
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
          <span style={{ fontSize: 22, color: "#8cc2ff" }}>{new URL(SITE_URL).host}/blog</span>
          {post ? (
            <span style={{ display: "flex", fontSize: 19, color: "rgba(255,255,255,0.55)" }}>
              {formatDate(post.updated ?? post.date)}
            </span>
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: font, style: "normal", weight: 400 }],
    }
  );
}
