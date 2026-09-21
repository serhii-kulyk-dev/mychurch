import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/* Сайт — статика: збірка кладе готові HTML/CSS/JS у теку .static
   в корені, і їх можна покласти на будь-який хостинг без Node.
   Свого сервера в проєкті немає: статистику збирає GA4, а заявки
   приймає public/lead.php — єдиний серверний файл, який їде в корінь
   сайту разом зі статикою (адреса — NEXT_PUBLIC_LEAD_ENDPOINT). */

export default function config(phase: string): NextConfig {
  /* `next dev` і `next build` не діляться текою: інакше dev-сервер
     затирає експорт (на 4321 лишається саме .static/dev — і всі
     адреси віддають 404), а збірка зносить теку з-під живого dev
     і той сипле 500. Тому в розробці — звичайна .next. */
  const distDir = phase === PHASE_DEVELOPMENT_SERVER ? ".next" : ".static";

  return {
    output: "export",
    distDir,
    /* Apache (CityHost) сам додає слеш: /route → /route/. Щоб це не
       впиралось у 403 на теці, кожен маршрут має бути index.html. */
    trailingSlash: true,
    poweredByHeader: false,
    images: {
      /* Оптимізатор картинок — це сервер, якого в нас немає. */
      unoptimized: true,
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 60 * 60 * 24 * 365, // 1 рік
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [48, 64, 96, 128, 192, 256, 384],
    },
    experimental: {
      optimizeCss: true,
    },
  };
}
