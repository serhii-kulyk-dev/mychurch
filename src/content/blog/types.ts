import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Блог MyChurch.

   Кожна стаття — це відповідь на реальний пошуковий запит церкви:
   «як вести облік членів церкви», «програма для малих груп»,
   «як передати служіння». Тому в кожній статті обов'язково є
   `keywords` (за чим шукають) і `problem` (з яким болем приходять) —
   вони йдуть і в метатеги, і в саму сторінку.

   Тексти пишемо двома мовами. Українська — основна: в ній не має
   бути англійських слів.
   ──────────────────────────────────────────────────────────────── */

/** Рубрика. Назви рубрик живуть у BLOG_COPY, id — у посту. */
export type BlogCategoryId = "people" | "process" | "growth" | "data" | "ai" | "choice";

/** Блок тексту всередині розділу статті. */
export type BlogBlock =
  | { kind: "text"; text: string }
  /** Маркований список: 3–6 пунктів. */
  | { kind: "list"; title?: string; items: string[] }
  /** Нумеровані кроки: що робити по черзі. */
  | { kind: "steps"; items: { title: string; text: string }[] }
  /** Виноска — практична порада або застереження. */
  | { kind: "callout"; title: string; text: string }
  /** Порівняння «як зазвичай» / «як має бути»: 2–4 колонки. */
  | { kind: "table"; columns: string[]; rows: string[][] }
  /** Фраза, яку варто запам'ятати. */
  | { kind: "quote"; text: string };

export interface BlogSection {
  /** H2. Якщо ключовий запит лягає в заголовок природно — ставимо його сюди. */
  heading: string;
  blocks: BlogBlock[];
}

export interface BlogCopy {
  /** <title>, 50–65 символів, ключовий запит на початку. */
  seoTitle: string;
  /** 120–165 символів. */
  seoDescription: string;
  /** H1 — коротший за seoTitle, без бренду. */
  title: string;
  /** 1–2 речення під H1. */
  lead: string;
  /** Пошукові запити, за якими люди шукають цю тему. 4–8 штук. */
  keywords: string[];
  /** Біль, з яким людина відкриває цю статтю. */
  problem: { title: string; text: string };
  /** 4–7 розділів. */
  sections: BlogSection[];
  /** «Коротко»: 3–5 тез. */
  takeaways: string[];
  /** 2–4 питання, які ставлять по цій темі (йдуть і в FAQ-розмітку). */
  faq: { q: string; a: string }[];
  /** Куди вести далі — завжди на реальну сторінку сайту. */
  cta: { title: string; text: string; label: string; href: string };
}

export interface BlogPost {
  /** Частина адреси: /blog/<slug>. Транслітерація без англійських слів. */
  slug: string;
  category: BlogCategoryId;
  /** Дата публікації, YYYY-MM-DD. */
  date: string;
  /** Дата оновлення, якщо статтю переписували. */
  updated?: string;
  /** Хвилин читання. */
  minutes: number;
  /** 2–3 слуги інших статей. */
  related: string[];
  copy: Record<Lang, BlogCopy>;
}
