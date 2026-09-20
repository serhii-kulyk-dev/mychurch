import type { Metadata } from "next";

/* ────────────────────────────────────────────────────────────────
   Один спільний шар SEO для всіх сторінок.

   Кожна сторінка викликає `pageMeta()` — так канонічна адреса,
   Open Graph і Twitter-картка збираються однаково й нічого не
   губиться при додаванні нових розділів.
   ──────────────────────────────────────────────────────────────── */

/** Продакшн-домен. Переозначається через NEXT_PUBLIC_SITE_URL (прев'ю, стейджинг). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mychurch.com.ua").replace(/\/+$/, "");

/* Бренд в усіх метаданих — українською: саме «Моя Церква» шукають церкви,
   і саме цю назву ми реєструємо. Латинка лишається лише як alternateName —
   нею нас знаходять ті, хто бачив логотип у застосунку. */
export const SITE_NAME = "Моя Церква";
/** Латинське написання — для структурованих даних (alternateName). */
export const SITE_NAME_LATIN = "MyChurch";
export const SITE_EMAIL = "team@mychurch.com.ua";
export const SITE_PHONE = "+380965297375";

/** Юзернейм у Telegram — без «@». Показуємо його як контакт поруч із поштою й телефоном. */
export const SITE_TELEGRAM_HANDLE = "mychurch_team";

/** Усі кнопки «Написати в Telegram» читають цю константу — правити в одному місці. */
export const SITE_TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM_URL ?? `https://t.me/${SITE_TELEGRAM_HANDLE}`;

/** Загальний опис продукту — дефолт для головної та для сторінок без свого тексту. */
export const SITE_DESCRIPTION =
  "«Моя Церква» — українська система обліку та управління церквою: люди, сім'ї, малі групи, служіння, події, відвідуваність, заявки й аналітика в одному просторі. Досягай людей.";

/** Ключові запити, за якими церкви шукають таку систему. */
export const SITE_KEYWORDS = [
  "система управління церквою",
  "програма для церкви",
  "облік членів церкви",
  "церковна CRM",
  "ChMS українською",
  "облік відвідуваності в церкві",
  "малі групи облік",
  "планування служінь",
  "церковна аналітика",
  "MyChurch",
  "Моя Церква",
];

/* Картинка для соцмереж — генерується з src/app/opengraph-image.tsx.
   Її доводиться додавати в кожну сторінку явно: сторінка, яка задає свій
   `openGraph`, повністю перекриває батьківський, разом із картинкою. */
export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export const OG_IMAGE: OgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Моя Церква — організація церковних процесів. Досягай людей.",
};

/* `trailingSlash: true` у next.config: канонічна адреса сторінки завжди
   зі слешем на кінці. Карта сайту мусить вести туди ж — інакше кожен її
   рядок це зайвий 301, а пошук бачить дві адреси однієї сторінки.
   Файли (/sitemap.xml, /opengraph-image) слеша не отримують. */
export function absoluteUrl(path = "/") {
  const clean = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const isFile = /\.[a-z0-9]+$/i.test(clean) || clean.endsWith("opengraph-image");
  return `${SITE_URL}${clean.endsWith("/") || isFile ? clean : `${clean}/`}`;
}

interface PageMetaInput {
  /** <title> цієї сторінки — повний, разом із брендом. */
  title: string;
  /** 120–165 символів, з ключовим запитом на початку. */
  description: string;
  /** Шлях від кореня: "/blog", "/modules/people". */
  path: string;
  /** Додаткові запити саме цієї сторінки. */
  keywords?: string[];
  /** "article" для статей блогу, інакше "website". */
  type?: "website" | "article";
  /** Дати для статей — у форматі YYYY-MM-DD. */
  publishedTime?: string;
  modifiedTime?: string;
  /** Сторінку не пускаємо в пошук, але посилання з неї лишаються живими:
      index: false + follow: true — інакше ми б обрізали власну перелінковку. */
  noIndex?: boolean;
  /** Своя картинка для соцмереж. За замовчуванням — спільна `OG_IMAGE`. */
  image?: OgImage;
}

/** Повний набір метатегів для сторінки: canonical + Open Graph + Twitter. */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
  image = OG_IMAGE,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: keywords?.length ? [...keywords, ...SITE_KEYWORDS.slice(0, 4)] : undefined,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: true } } : null),
    openGraph: {
      type: type === "article" ? "article" : "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "uk_UA",
      alternateLocale: ["en_US"],
      images: [image],
      ...(type === "article" ? { publishedTime, modifiedTime } : null),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
