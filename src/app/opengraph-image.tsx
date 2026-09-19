import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_URL } from "@/lib/seo";

/* Картинка для соцмереж і месенджерів — одна на весь сайт.

   Показуємо продукт, а не гасло: зліва слоган, справа фрагмент
   дашборда церкви. Темна панель — той самий акцент, що й блок
   заклику на головній, тому в стрічці картка читається одразу.

   Шрифт лежить у репозиторії (Geist, OFL — див. сусідній LICENSE),
   бо satori не вміє woff2 з next/font, а кирилиця потрібна. */

export const alt = "Моя Церква — організація церковних процесів. Досягай людей.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b0b0f";
const MUTED = "rgba(11,11,15,0.5)";
const BRAND = "#007aff";

/* Відвідуваність за 8 тижнів — той самий приклад, що й у демо на сайті.
   Висоти вже в пікселях: рядок під графік має рівно BARS_HEIGHT. */
const BARS_HEIGHT = 64;
const BARS = [40, 47, 43, 53, 50, 58, 54, 64];

const KPI = [
  { value: "428", label: "людей" },
  { value: "24", label: "групи" },
  { value: "11", label: "служінь" },
];

const ATTENTION = [
  { initials: "ОК", name: "Олена Ковальчук", note: "не була 3 тижні" },
  { initials: "ДЛ", name: "Дмитро Лис", note: "не був 2 тижні" },
];

export default async function OpengraphImage() {
  const [font, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "public/logo.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          position: "relative",
        }}
      >
        {/* Бренд */}
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
          <span style={{ fontSize: 32, color: "#ffffff", letterSpacing: -0.8 }}>Моя Церква</span>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.45)" }}>· MyChurch</span>
        </div>

        {/* Слоган + фрагмент системи */}
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 540, gap: 18 }}>
            <div style={{ display: "flex", fontSize: 74, color: "#ffffff", letterSpacing: -3, lineHeight: 1.04 }}>
              Досягай людей
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.62)", letterSpacing: -0.6, lineHeight: 1.3 }}>
              Організація церковних процесів
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {["Люди", "Малі групи", "Служіння", "Відвідуваність"].map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    fontSize: 19,
                    color: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    padding: "8px 16px",
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* Дашборд церкви */}
          <div
            style={{
              width: 452,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "#ffffff",
              borderRadius: 24,
              padding: 22,
              boxShadow: "0 30px 60px rgba(3,18,40,0.35)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 19, color: INK, letterSpacing: -0.4 }}>Дашборд церкви</span>
              <span
                style={{
                  display: "flex",
                  fontSize: 13,
                  color: MUTED,
                  background: "#f4f5f7",
                  borderRadius: 999,
                  padding: "5px 12px",
                }}
              >
                Оновлено щойно
              </span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {KPI.map((kpi) => (
                <div
                  key={kpi.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: 2,
                    background: "#f7f8fa",
                    borderRadius: 14,
                    padding: "12px 14px",
                  }}
                >
                  <span style={{ fontSize: 26, color: INK, letterSpacing: -1 }}>{kpi.value}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{kpi.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 13, color: MUTED }}>Відвідуваність · 8 тижнів</span>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 9, height: BARS_HEIGHT }}>
                {BARS.map((value, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flex: 1,
                      height: value,
                      borderRadius: 7,
                      background: i === BARS.length - 1 ? BRAND : "rgba(0,122,255,0.24)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontSize: 13, color: MUTED }}>Потребують уваги · 3</span>
              {ATTENTION.map((person) => (
                <div key={person.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: "#eaf3ff",
                      color: BRAND,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {person.initials}
                  </div>
                  <span style={{ fontSize: 15, color: INK }}>{person.name}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{person.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Підвал */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, color: "#8cc2ff" }}>{new URL(SITE_URL).host}</span>
          <span style={{ display: "flex", fontSize: 19, color: "rgba(255,255,255,0.55)" }}>
            Діє програма безкоштовного підключення
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: font, style: "normal", weight: 400 }],
    }
  );
}
