import type { NextConfig } from "next";

/* Сайт — статика: збірка кладе готові HTML/CSS/JS у теку .static
   в корені, і їх можна покласти на будь-який хостинг без Node.
   Свого сервера в проєкті немає: статистику збирає GA4, а заявки
   їдуть на зовнішній приймач (NEXT_PUBLIC_LEAD_ENDPOINT). */

const nextConfig: NextConfig = {
  output: "export",
  distDir: ".static",
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

export default nextConfig;
