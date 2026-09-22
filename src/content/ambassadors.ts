import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Сторінка церкви-амбасадора. Чотири екрани й нічого більше:
   хто це — цитата над кадром — було і стало — як вмикали.

   Каталог модулів зі сторінки прибрано (2026-09-21): рядок однакових
   карток повторював /modules, а те, чим церква користується, видно
   в хронології — кожен крок називає модулі, які тоді ввімкнули.

   Жодних чисел про людей, акаунти чи групи: скільки їх у системі —
   дані церкви, а не наш доказ. Цитату не вигадуємо: беремо з сайту
   церкви разом із посиланням на сторінку, звідки вона.
   ──────────────────────────────────────────────────────────────── */

export interface AmbassadorCopy {
  seoTitle: string;
  /** 120–160 символів. */
  seoDescription: string;

  eyebrow: string;
  /** Плашка над заголовком: скільки часу ми працюємо разом. */
  badge: string;
  /** H1: одне коротке твердження, а не опис церкви. */
  title: string;
  /** Одне речення під заголовком. */
  lead: string;
  /** Факти з відкритих даних церкви; ідуть рядком під шапкою. Міста тут
      немає — воно стоїть під назвою церкви. Останній факт — «скільки вже
      в системі»: його бере блок `proof` на головній. */
  facts: { label: string; value: string }[];
  siteCta: string;
  /** Підпис посилання «назад» унизу сторінки; веде на /about. */
  backLabel: string;

  /** Один кадр церкви в шапці; на ньому ж лежить цитата.
      Файл — у /public/ambassadors/<id>/. */
  heroPhoto: { src: string; alt: string };
  photoCredit: string;
  photoCreditCta: string;

  /** Рядок із сайту церкви дослівно; `href` — сторінка, звідки він. */
  quote: { text: string; source: string; href: string };

  /** Закривальний блок сторінки: коротко про саму церкву. */
  aboutTitle: string;
  aboutText: string;
  /** Кадр для цього блока — інший, ніж у шапці. */
  aboutPhoto: { src: string; alt: string };

  /** Стрічка кадрів із життя церкви — їде сама, зупиняється на наведення.
      Усі фото — церкви, вони ж стоять у кредиті під шапкою. */
  gallery: { src: string; alt: string }[];

  reviewsTitle: string;
  /** Відгуки людей із церкви про роботу в системі — тільки їхні власні
      слова. Порожній список = блоку на сторінці немає: вигадувати відгук
      за церкву ми не будемо. `source` — звідки цитата (лист, розмова,
      допис), щоб її можна було перевірити. */
  reviews?: { text: string; author: string; role: string; source?: string }[];

  clipsTitle: string;
  clipsText: string;
  /** Відео-відгуки церкви, по одному на модуль: id модуля, а поруч — хто
      говорить. Назви й описи модулів беруться зі словника, файли й постери
      — з src/content/modules/videos.ts. Ім'я без підтвердження церкви не
      пишемо: порожній `speaker` — просто немає підпису. */
  clips: {
    id: string;
    speaker?: { name: string; role: string };
    /** Рядок із самого запису, дослівно. Немає розшифровки — немає
        цитати: переказувати за людину ми не будемо. */
    quote?: string;
  }[];

  /* ── Блок «Було і стало» знято зі сторінки 2026-09-21. Копія лишається
        тут: якщо блок повернеться, писати заново не доведеться. ───── */
  changeTitle: string;
  /** Слово між «як зараз» і «як було»: «замість». */
  insteadLabel: string;
  /** По одному рядку на напрям: люди, служіння, малі групи, події,
      онбординг, діти, аналітика. Рядок — одне речення: що зараз і,
      тихішим кольором, що було замість цього. */
  change: { now: string; instead: string }[];

  /** Одним абзацом замість таймлайну: коли почали і що працює сьогодні. */
  rolloutNote: string;
  modulesCta: string;
}

export interface AmbassadorDetail {
  id: string;
  name: string;
  city: string;
  /** Акцент сторінки; має читатись і на світлій, і на темній темі. */
  accent: string;
  logo?: string;
  initials: string;
  website: string;
  /** Промо-ролик для головної: файл у нас на хостингу (public/clips)
      і кадр із нього, щоб до натискання нічого не вантажилось.
      Порожньо = блок просто без відео. */
  promo?: { src: string; poster: string };
  copy: Record<Lang, AmbassadorCopy>;
}

export const AMBASSADORS: AmbassadorDetail[] = [
  {
    id: "newlife",
    name: "Нове Життя",
    city: "Черкаси",
    accent: "#0f766e",
    logo: "/new-life-logo.png",
    initials: "НЖ",
    website: "https://newlife.ck.ua/",
    /* Справжній запис «Люди і сім'ї» з системи церкви. */
    promo: { src: "/clips/people.mp4", poster: "/ambassadors/video/people.webp" },
    copy: {
      ua: {
        seoTitle: "Церква «Нове Життя», Черкаси — амбасадор «Моєї Церкви»",
        seoDescription:
          "Як черкаська церква «Нове Життя» працює в «Моїй Церкві»: що змінилось у служіннях, які модулі ввімкнені і як проходило впровадження.",
        eyebrow: "Амбасадор",
        badge: "Вже 1,5 року будуємо церковні процеси",
        title: "Як це працює в «Новому Житті»",
        lead: "Черкаська церква з двома недільними служіннями, малими групами, дитячим містечком і двома підлітковими.",
        facts: [
          { label: "Адреса", value: "проспект Перемоги, 13/5" },
          { label: "Служіння", value: "неділя, 10:00 і 12:00" },
          { label: "Разом", value: "1,5 року будуємо процеси" },
        ],
        siteCta: "Сайт церкви",
        backLabel: "Про нас",

        heroPhoto: {
          src: "/ambassadors/newlife/khreshchennia.webp",
          alt: "Хрещення у відкритому басейні на подвір'ї церкви «Нове Життя»",
        },
        gallery: [
          { src: "/ambassadors/newlife/propovid.webp", alt: "Проповідь на недільному служінні" },
          { src: "/ambassadors/newlife/spilnota.webp", alt: "Спілкування в холі після служіння" },
          { src: "/ambassadors/newlife/mala-grupa.webp", alt: "Зустріч малої групи" },
          { src: "/ambassadors/newlife/kids-town.webp", alt: "Дитяче містечко" },
          { src: "/ambassadors/newlife/sluzhinnia.webp", alt: "Команда на служінні" },
          { src: "/ambassadors/newlife/cliff.webp", alt: "Підліткове служіння — спільне фото після зустрічі" },
          { src: "/ambassadors/newlife/kids-town-zal.webp", alt: "Зал дитячого містечка" },
          { src: "/ambassadors/newlife/mala-grupa-2.webp", alt: "Мала група за столом" },
        ],
        photoCredit: "Фото — церкви «Нове Життя»",
        photoCreditCta: "newlife.ck.ua",

        quote: {
          text: "Ми віримо, що церква — це не будівля, а люди.",
          source: "«Нове Життя», сторінка «Про нас»",
          href: "https://www.newlife.ck.ua/about-us/",
        },

        aboutTitle: "Про церкву",
        aboutText:
          "«Нове Життя» збирається в Черкасах на два недільні служіння. При церкві працюють малі групи, дитяче містечко, спортивний клуб і два підліткові служіння.",
        aboutPhoto: {
          src: "/ambassadors/newlife/foye.webp",
          alt: "Люди спілкуються в залі церкви після служіння",
        },

        reviewsTitle: "Що кажуть у церкві",
        /* TODO: вписати відгуки «Нового Життя» їхніми словами — `reviews`:
           [{ text, author, role, source }]. Доки списку немає, блок не
           рендериться: свій текст за церкву ми не пишемо. */

        clipsTitle: "Відгуки",
        clipsText: "Члени церкви «Нового Життя» — про кожен модуль, яким користуються.",
        /* Хто в якому записі — підтверджено церквою 2026-09-21.

           УВАГА: тексти `quote` — ЧЕРНЕТКИ, написані нами за змістом
           модулів, а не слова цих людей. Кожну фразу має підтвердити той,
           кому вона приписана (або замінити своєю). Не погодили — поле
           `quote` треба прибрати: вигаданий відгук від реальної людини
           на сайті стояти не може. */
        clips: [
          {
            id: "people",
            speaker: { name: "Сергій Васильович", role: "пастор" },
            /* Цей рядок дав користувач — не чернетка. */
            quote:
              "Церква — це люди, і нам важливо знати самих людей! Система допомагає формувати порядок.",
          },
          {
            id: "groups",
            speaker: { name: "Руслан Володимирович", role: "пастор" },
            /* Цей рядок дав користувач — не чернетка. */
            quote: "Для лідера це простий інструмент для організації своєї групи.",
          },
          {
            id: "onboarding",
            speaker: { name: "Іра Коробченко", role: "лідер Infobox" },
            /* Цей рядок дав користувач — не чернетка. */
            quote:
              "Простий і зрозумілий шлях адаптації. Людині важливо розуміти наступні кроки.",
          },
          {
            id: "learning",
            speaker: { name: "Іра Коробченко", role: "лідер Infobox" },
            /* Цей рядок дав користувач — не чернетка. */
            quote:
              "Навчання — це постійний процес: тренінги, матеріали. Налаштовуєте раз — працює завжди.",
          },
          {
            id: "forms",
            speaker: { name: "Іра Коробченко", role: "лідер Infobox" },
            quote:
              "Google Форми закрили. Анкета одразу в базі, руками нічого не переносимо.",
          },
          {
            id: "links",
            speaker: { name: "Равш Юсупов", role: "лідер медіа" },
            quote:
              "Одне посилання — і заявка в системі, а не в чиємусь особистому.",
          },
          {
            id: "automations",
            speaker: { name: "Равш Юсупов", role: "лідер медіа" },
            quote:
              "Нагадування шле система. Ми лише перевіряємо.",
          },
          {
            id: "org",
            speaker: { name: "Сергій Васильович", role: "пастор" },
            quote:
              "Видно, хто за що відповідає. Питання «а хто цим займається» зникло.",
          },
        ],

        changeTitle: "Було і стало",
        insteadLabel: "замість",
        change: [
          { now: "Одна база на всю церкву", instead: "кількох Google Таблиць" },
          { now: "Графік служінь у боті", instead: "перекличок у чаті" },
          { now: "Явка в групі з телефона лідера", instead: "паперових списків" },
          { now: "Запис на подію одразу в картці людини", instead: "Google Форм окремо від бази" },
          { now: "Новенького веде онбординг", instead: "випадкової згадки в чаті" },
          { now: "Прихід дитини — за номером", instead: "зошита на вході" },
          { now: "Звіт для ради за кілька хвилин", instead: "вечора з таблицями" },
        ],

        rolloutNote:
          "Півтора року разом: спершу переїхала база з Google Таблиць, далі підключились малі групи, дитяче й підліткові служіння. Сьогодні ввімкнені всі модулі, аж до бухгалтерії та ШІ-помічника.",
        modulesCta: "Усі модулі",
      },

      en: {
        seoTitle: "New Life Church, Cherkasy — My Church ambassador",
        seoDescription:
          "How New Life Church in Cherkasy runs on My Church: what changed across its ministries, which modules are switched on and how the rollout went.",
        eyebrow: "Ambassador",
        badge: "Building church processes together for 1.5 years",
        title: "How it works at New Life",
        lead: "A Cherkasy church with two Sunday services, small groups, a kids' town and two teen ministries.",
        facts: [
          { label: "Address", value: "13/5 Peremohy Avenue" },
          { label: "Services", value: "Sunday, 10:00 and 12:00" },
          { label: "Together", value: "1.5 years building processes" },
        ],
        siteCta: "Church website",
        backLabel: "About us",

        heroPhoto: {
          src: "/ambassadors/newlife/khreshchennia.webp",
          alt: "A baptism in an outdoor pool at New Life church",
        },
        gallery: [
          { src: "/ambassadors/newlife/propovid.webp", alt: "A sermon at a Sunday service" },
          { src: "/ambassadors/newlife/spilnota.webp", alt: "People talking in the hall after a service" },
          { src: "/ambassadors/newlife/mala-grupa.webp", alt: "A small group meeting" },
          { src: "/ambassadors/newlife/kids-town.webp", alt: "The kids' town" },
          { src: "/ambassadors/newlife/sluzhinnia.webp", alt: "A team serving on Sunday" },
          { src: "/ambassadors/newlife/cliff.webp", alt: "The teen ministry after a meeting" },
          { src: "/ambassadors/newlife/kids-town-zal.webp", alt: "The kids' town hall" },
          { src: "/ambassadors/newlife/mala-grupa-2.webp", alt: "A small group around the table" },
        ],
        photoCredit: "Photos by New Life church",
        photoCreditCta: "newlife.ck.ua",

        quote: {
          text: "We believe the church is not a building, but people.",
          source: "New Life, “About us” page",
          href: "https://www.newlife.ck.ua/about-us/",
        },

        aboutTitle: "About the church",
        aboutText:
          "New Life meets in Cherkasy for two Sunday services. The church runs small groups, a kids' town, a sports club and two teen ministries.",
        aboutPhoto: {
          src: "/ambassadors/newlife/foye.webp",
          alt: "People talking in the church hall after a service",
        },

        reviewsTitle: "What the church says",

        clipsTitle: "Reviews",
        clipsText: "Members of New Life on each module they use.",
        /* Draft quotes, not yet approved by the speakers — see the note
           in the Ukrainian copy above. */
        clips: [
          {
            id: "people",
            speaker: { name: "Serhii Vasylovych", role: "pastor" },
            quote:
              "The church is people — and it matters to us to know the people themselves. The system helps us keep order.",
          },
          {
            id: "groups",
            speaker: { name: "Ruslan Volodymyrovych", role: "pastor" },
            quote: "For a leader it is a simple tool to run their own group.",
          },
          {
            id: "onboarding",
            speaker: { name: "Ira Korobchenko", role: "Infobox lead" },
            quote: "A simple, clear path for settling in. A person needs to understand the next steps.",
          },
          {
            id: "learning",
            speaker: { name: "Ira Korobchenko", role: "Infobox lead" },
            quote:
              "Learning is a constant process — trainings and materials. You set it up once and it keeps working.",
          },
          {
            id: "forms",
            speaker: { name: "Ira Korobchenko", role: "Infobox lead" },
            quote: "We closed Google Forms. A form lands in the database, nothing retyped.",
          },
          {
            id: "links",
            speaker: { name: "Ravsh Yusupov", role: "media lead" },
            quote: "One link — and the request is in the system, not in someone's DMs.",
          },
          {
            id: "automations",
            speaker: { name: "Ravsh Yusupov", role: "media lead" },
            quote: "The system sends the reminders. We just check.",
          },
          {
            id: "org",
            speaker: { name: "Serhii Vasylovych", role: "pastor" },
            quote: "You can see who owns what. The question «who handles this?» is gone.",
          },
        ],

        changeTitle: "Before and after",
        insteadLabel: "instead of",
        change: [
          { now: "One database for the whole church", instead: "several Google Sheets" },
          { now: "The rota lives in the bot", instead: "a roll-call in a chat" },
          { now: "Attendance from the leader's phone", instead: "paper lists" },
          { now: "A signup lands on the person's profile", instead: "Google Forms away from the database" },
          { now: "Onboarding walks the newcomer", instead: "a chance mention in a chat" },
          { now: "Kids check in by number", instead: "a notebook at the door" },
          { now: "The board report takes minutes", instead: "an evening with spreadsheets" },
        ],

        rolloutNote:
          "A year and a half together: the database moved out of Google Sheets first, then small groups, kids and teen ministries came on. Today every module is switched on, right through to finance and the AI assistant.",
        modulesCta: "All modules",
      },
    },
  },
];

const BY_ID = new Map(AMBASSADORS.map((a) => [a.id, a]));

export function getAmbassador(id: string): AmbassadorDetail | undefined {
  return BY_ID.get(id);
}

/** Id тих, у кого є своя сторінка (для generateStaticParams і посилань). */
export const AMBASSADOR_IDS = AMBASSADORS.map((a) => a.id);

export function hasAmbassadorPage(id: string) {
  return BY_ID.has(id);
}

/** Єдина церква, яку ми публікуємо як амбасадора: кожне «Амбасадор» у
    меню веде одразу на її сторінку, списку між ними немає. */
export const LEAD_AMBASSADOR = AMBASSADORS[0];
export const LEAD_AMBASSADOR_HREF = `/ambassadors/${AMBASSADORS[0].id}`;
