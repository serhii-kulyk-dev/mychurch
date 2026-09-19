import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/* Індексуємо весь сайт. Технічні маршрути Next (/_next, /api) і кабінет
   аналітики (/admin) пошуку не потрібні, а карта сайту вказана явно —
   так її знаходять швидше. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/", "/admin"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
