import type { MetadataRoute } from "next";
import { AMBASSADOR_IDS } from "@/content/ambassadors";
import { BLOG_POSTS } from "@/content/blog";
import { MODULE_IDS } from "@/content/modules";
import { ROLE_IDS } from "@/components/shared/role-icons";
import { absoluteUrl } from "@/lib/seo";

/* Карта сайту: усі сторінки, які мають потрапити в пошук.
   Вартості й порівняння тут свідомо немає — вони закриті від індексації
   (noIndex у своїх pageMeta), на них ведемо тільки з самого сайту.
   Пріоритети — відносні: головна найвища, службові сторінки нижчі. */

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/modules", priority: 0.9, changeFrequency: "monthly" },
  { path: "/for-whom", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ai", priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/telegram", priority: 0.8, changeFrequency: "monthly" },
  { path: "/import", priority: 0.8, changeFrequency: "monthly" },
  { path: "/consulting", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/support", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

/* `lastModified` ставимо лише там, де дата справді відома — у статтях.
   Для решти сторінок «змінено сьогодні» оновлювалось би щобілда, хоча текст
   лежить незмінний місяцями: це хибний сигнал, і пошук швидко перестає
   йому вірити. Краще не заявляти дату взагалі. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...MODULE_IDS.map((id) => ({
      url: absoluteUrl(`/modules/${id}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...ROLE_IDS.map((role) => ({
      url: absoluteUrl(`/for-whom/${role}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...AMBASSADOR_IDS.map((id) => ({
      url: absoluteUrl(`/ambassadors/${id}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
