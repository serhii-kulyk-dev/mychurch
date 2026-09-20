import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/* Статичний експорт: файл генерується під час збірки, не на запит. */
export const dynamic = "force-static";

/* Індексуємо весь сайт. Технічні файли Next (/_next) пошуку не потрібні,
   а карта сайту вказана явно — так її знаходять швидше. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
