import type { Lang } from "@/lib/i18n";
import type { BlogCategoryId, BlogPost } from "./types";

import { post as piatPytan } from "./posts/piat-pytan-pro-systemu";
import { post as vashaTserkvaUnikalna } from "./posts/vasha-tserkva-unikalna";
import { post as daniVRiznykhMistsiakh } from "./posts/dani-v-riznykh-mistsiakh";
import { post as vidVidviduvachaDoLidera } from "./posts/vid-vidviduvacha-do-lidera";
import { post as aiAhent } from "./posts/yak-nalashtuvaty-ai-ahenta";
import { post as stavteTsili } from "./posts/stavte-tsili";
import { post as yakObratySystemu } from "./posts/yak-obraty-systemu-dlia-tserkvy";

export type { BlogPost, BlogCopy, BlogBlock, BlogSection, BlogCategoryId } from "./types";

/* ────────────────────────────────────────────────────────────────
   Реєстр статей і текст самої сторінки блогу.

   Тексти сторінки живуть тут, а не в i18n.ts: так само зроблено
   для /telegram, /support і /import. Порядок у списку — за датою.
   ──────────────────────────────────────────────────────────────── */

const ALL: BlogPost[] = [
  piatPytan,
  vashaTserkvaUnikalna,
  vidVidviduvachaDoLidera,
  aiAhent,
  yakObratySystemu,
  daniVRiznykhMistsiakh,
  stavteTsili,
];

/** Усі статті, найновіші зверху. */
export const BLOG_POSTS: BlogPost[] = [...ALL].sort((a, b) => (a.date < b.date ? 1 : -1));

const BY_SLUG = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BY_SLUG.get(slug);
}

/** Пов'язані статті: спершу ті, що вказані вручну, далі — сусіди по рубриці. */
export function getRelated(post: BlogPost, limit = 3): BlogPost[] {
  const picked: BlogPost[] = [];
  for (const slug of post.related) {
    const found = BY_SLUG.get(slug);
    if (found && found.slug !== post.slug) picked.push(found);
  }
  for (const other of BLOG_POSTS) {
    if (picked.length >= limit) break;
    if (other.slug === post.slug || picked.some((p) => p.slug === other.slug)) continue;
    if (other.category === post.category) picked.push(other);
  }
  return picked.slice(0, limit);
}

/** Запити, за якими люди шукають ці теми: беремо з самих статей. */
export function searchQueries(lang: Lang, limit = 24): { query: string; slug: string }[] {
  const seen = new Set<string>();
  const out: { query: string; slug: string }[] = [];
  for (const post of BLOG_POSTS) {
    for (const query of post.copy[lang].keywords.slice(0, 2)) {
      const key = query.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ query, slug: post.slug });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────
   «З чого почати» — сім статей, які закривають те, з чим церкви
   приходять найчастіше. Це не найновіше і не найпопулярніше, а
   порядок читання: спершу перевірка, далі правило, потім люди,
   процеси, цифри і аж наприкінці — вибір системи.
   ──────────────────────────────────────────────────────────────── */

export interface BlogStarterItem {
  slug: string;
  /** Одне речення: чому саме цю статтю варто прочитати зараз. */
  why: string;
}

export const BLOG_STARTER: Record<Lang, BlogStarterItem[]> = {
  ua: [
    { slug: "piat-pytan-pro-systemu", why: "Перевірка на п'ять хвилин: у вас уже система чи просто люди, які все пам'ятають." },
    { slug: "vasha-tserkva-unikalna", why: "Головне правило: спершу ваш порядок, і лише потім налаштування під нього." },
    { slug: "dani-v-riznykh-mistsiakh", why: "Звідки береться відчуття, що ніхто нічого не знає напевно." },
    { slug: "vid-vidviduvacha-do-lidera", why: "Шлях людини від першого візиту до служіння — по етапах, а не навмання." },
    { slug: "yak-nalashtuvaty-ai-ahenta", why: "Що можна віддати помічнику, а що має залишитись за людьми." },
    { slug: "stavte-tsili", why: "Які цифри показують рух, а які просто заспокоюють." },
    { slug: "yak-obraty-systemu-dlia-tserkvy", why: "Питання, які варто поставити будь-якій системі — і нам теж — перед рішенням." },
  ],
  en: [
    { slug: "piat-pytan-pro-systemu", why: "A five-minute check: do you have a system, or people who remember everything." },
    { slug: "vasha-tserkva-unikalna", why: "The rule that saves the rollout: your order first, settings after it." },
    { slug: "dani-v-riznykh-mistsiakh", why: "Where the feeling that nobody knows anything for sure comes from." },
    { slug: "vid-vidviduvacha-do-lidera", why: "The path from a first visit to serving, stage by stage." },
    { slug: "yak-nalashtuvaty-ai-ahenta", why: "What you can hand to the assistant and what must stay with people." },
    { slug: "stavte-tsili", why: "Which numbers show movement and which merely reassure." },
    { slug: "yak-obraty-systemu-dlia-tserkvy", why: "The questions to ask any system, ours included, before you decide." },
  ],
};

/** Статті «з чого почати» в порядку читання. */
export function starterPosts(lang: Lang): { post: BlogPost; why: string }[] {
  const out: { post: BlogPost; why: string }[] = [];
  for (const item of BLOG_STARTER[lang]) {
    const post = BY_SLUG.get(item.slug);
    if (post) out.push({ post, why: item.why });
  }
  return out;
}

export interface BlogCategory {
  id: BlogCategoryId;
  title: string;
  text: string;
}

export const BLOG_CATEGORIES: Record<Lang, BlogCategory[]> = {
  ua: [
    { id: "people", title: "Люди", text: "Як не втрачати людей: гості, групи, відвідуваність, звернення." },
    { id: "process", title: "Процеси", text: "Служіння, графіки, передача справ і команда, яка не вигорає." },
    { id: "growth", title: "Цілі та аналітика", text: "Що вимірювати в церкві й як зрозуміти, чи рухаємось." },
    { id: "data", title: "Дані", text: "Один список замість п'яти таблиць: перенос, доступи, безпека." },
    { id: "ai", title: "Помічник і бот", text: "Що можна автоматизувати, а що має залишитись людям." },
    { id: "choice", title: "Вибір системи", text: "Як обирати й впроваджувати систему, щоб нею справді користувались." },
  ],
  en: [
    { id: "people", title: "People", text: "Not losing people: guests, groups, attendance, requests." },
    { id: "process", title: "Processes", text: "Ministries, rotas, handovers and teams that do not burn out." },
    { id: "growth", title: "Goals and analytics", text: "What to measure in a church and how to tell whether you are moving." },
    { id: "data", title: "Data", text: "One list instead of five spreadsheets: migration, access, safety." },
    { id: "ai", title: "Assistant and bot", text: "What to automate and what must stay with people." },
    { id: "choice", title: "Choosing a system", text: "How to choose and roll out software people actually use." },
  ],
};

export interface BlogChrome {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  hero: { eyebrow: string; title: string; lead: string };
  stats: { posts: string; topics: string };
  starterTitle: string;
  starterText: string;
  queriesTitle: string;
  queriesText: string;
  readLabel: string;
  minutes: string;
  post: {
    breadcrumbHome: string;
    breadcrumbBlog: string;
    back: string;
    author: string;
    published: string;
    updated: string;
    contents: string;
    problemLabel: string;
    keywordsTitle: string;
    keywordsText: string;
    takeaways: string;
    faqTitle: string;
    relatedTitle: string;
    demoLabel: string;
    shareText: string;
  };
}

export const BLOG_COPY: Record<Lang, BlogChrome> = {
  ua: {
    navLabel: "Блог",
    seoTitle: "Блог про організацію церковних процесів — Моя Церква",
    seoDescription:
      "Практичні статті для пасторів, лідерів і адміністраторів: облік людей, малі групи, відвідуваність, служіння, аналітика, дані та вибір системи для церкви.",
    seoKeywords: [
      "блог про церковне адміністрування",
      "як організувати процеси в церкві",
      "поради пастору",
      "управління церквою",
      "облік у церкві",
    ],
    hero: {
      eyebrow: "Блог",
      title: "Як організувати церковні процеси",
      lead: "Пишемо про те, з чим церкви стикаються щотижня: як не втрачати людей, як вести групи й служіння, що вимірювати і як звести дані в одне місце.",
    },
    stats: { posts: "статей", topics: "тем" },
    starterTitle: "З чого почати",
    starterText: "Сім статей, які закривають те, що болить найчастіше, — у порядку, в якому їх варто читати.",
    queriesTitle: "Що шукають найчастіше",
    queriesText: "Реальні запити, з якими до нас приходять. Натисніть — відкриється стаття по темі.",
    readLabel: "Читати",
    minutes: "хв",
    post: {
      breadcrumbHome: "Головна",
      breadcrumbBlog: "Блог",
      back: "Усі статті",
      author: "Команда «Моєї Церкви»",
      published: "Опубліковано",
      updated: "Оновлено",
      contents: "У статті",
      problemLabel: "Проблема",
      keywordsTitle: "Шукають так",
      keywordsText: "Запити, за якими знаходять цю тему.",
      takeaways: "Коротко",
      faqTitle: "Питання та відповіді",
      relatedTitle: "Читати далі",
      demoLabel: "Замовити демо",
      shareText: "Маєте таку саму ситуацію? Покажемо, як це влаштовано у вашій церкві — на ваших даних, а не на прикладах.",
    },
  },
  en: {
    navLabel: "Blog",
    seoTitle: "Blog on running church processes — MyChurch",
    seoDescription:
      "Practical articles for pastors, leaders and administrators: people records, small groups, attendance, ministries, analytics, data and choosing church software.",
    seoKeywords: [
      "church administration blog",
      "church management advice",
      "church processes",
      "pastoral leadership tools",
      "church data",
    ],
    hero: {
      eyebrow: "Blog",
      title: "How to run church processes",
      lead: "About what churches face every week: not losing people, running groups and ministries, what to measure, and how to bring data into one place.",
    },
    stats: { posts: "articles", topics: "topics" },
    starterTitle: "Start here",
    starterText: "Seven articles covering what hurts most often, in the order worth reading them.",
    queriesTitle: "What people search for",
    queriesText: "Real questions churches bring us. Tap one to open the article.",
    readLabel: "Read",
    minutes: "min",
    post: {
      breadcrumbHome: "Home",
      breadcrumbBlog: "Blog",
      back: "All articles",
      author: "The MyChurch team",
      published: "Published",
      updated: "Updated",
      contents: "In this article",
      problemLabel: "The problem",
      keywordsTitle: "Searched as",
      keywordsText: "Queries that lead people to this topic.",
      takeaways: "In short",
      faqTitle: "Questions and answers",
      relatedTitle: "Read next",
      demoLabel: "Book a demo",
      shareText: "Sound familiar? We will show how this works in your church, on your data rather than examples.",
    },
  },
};

/** Приблизна кількість слів статті — для розмітки BlogPosting. */
export function postWordCount(post: BlogPost, lang: Lang): number {
  const copy = post.copy[lang];
  const parts: string[] = [copy.title, copy.lead, copy.problem.title, copy.problem.text, ...copy.takeaways];
  for (const section of copy.sections) {
    parts.push(section.heading);
    for (const block of section.blocks) {
      switch (block.kind) {
        case "text":
        case "quote":
          parts.push(block.text);
          break;
        case "callout":
          parts.push(block.title, block.text);
          break;
        case "list":
          parts.push(...block.items, block.title ?? "");
          break;
        case "steps":
          for (const item of block.items) parts.push(item.title, item.text);
          break;
        case "table":
          parts.push(...block.columns, ...block.rows.flat());
          break;
      }
    }
  }
  for (const item of copy.faq) parts.push(item.q, item.a);
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}
