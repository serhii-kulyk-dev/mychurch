import type { Lang } from "@/lib/i18n";
import { SITE_TELEGRAM, SITE_TELEGRAM_HANDLE } from "@/lib/seo";

/* ────────────────────────────────────────────────────────────────
   Copy for /support — сторінка підтримки.

   Тут немає нових обіцянок: усе, що на сторінці, вже сказано в
   іншому місці сайту, і має збігатися з ним дослівно за змістом.
     • канали й контакти ....... sections/footer.tsx
     • час відповіді ........... i18n → faq.stillQuestionsText
     • бекапи, ЄС, оновлення ... i18n → faq.categories (Системні, Технічні)
     • етап «Супровід» ......... i18n → consultingPage.stages[3]
   Якщо міняється щось там — міняємо і тут.
   ──────────────────────────────────────────────────────────────── */

/** Канал зв'язку: чим є, для чого, коли відповідаємо. */
export interface SupportChannel {
  id: string;
  name: string;
  /** Адреса або підпис під назвою — те, що людина бачить і копіює. */
  handle: string;
  href?: string;
  text: string;
  when: string;
}

/** Крок обробки звернення. */
export interface SupportStep {
  title: string;
  text: string;
}

/** Рядок блоку «про що можна не турбуватись». */
export interface SupportFact {
  title: string;
  text: string;
}

export interface SupportLink {
  label: string;
  text: string;
  href: string;
}

export interface SupportCopy {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    ctaSecondary: string;
    note: string;
    facts: { value: string; label: string }[];
  };

  channels: {
    eyebrow: string;
    title: string;
    text: string;
    whenLabel: string;
    items: SupportChannel[];
  };

  flow: {
    eyebrow: string;
    title: string;
    text: string;
    steps: SupportStep[];
    note: string;
  };

  care: {
    eyebrow: string;
    title: string;
    text: string;
    items: SupportFact[];
  };

  self: {
    title: string;
    text: string;
    links: SupportLink[];
  };
}

const TELEGRAM_HREF = SITE_TELEGRAM;
const TELEGRAM_HANDLE = `@${SITE_TELEGRAM_HANDLE}`;
const MAIL = "team@mychurch.com.ua";
const PHONE = "+380 96 529 73 75";
const PHONE_HREF = "tel:+380965297375";

const ua: SupportCopy = {
  navLabel: "Підтримка",
  seoTitle: "Підтримка — Моя Церква",
  seoDescription:
    "Підтримка «Моєї Церкви»: телеграм, пошта і телефон, відповідь протягом дня, окремий канал для вашої команди, щоденні резервні копії та щотижневі оновлення.",

  hero: {
    eyebrow: "Підтримка",
    title: "Ви не лишаєтесь сам на сам із системою",
    lead: "Запуск, перенесення даних і перше навчання ми проходимо разом з вашою командою — і лишаємось поруч далі. Пишете у зручний канал, відповідає людина, яка знає вашу церкву.",
    cta: "Написати в телеграм",
    ctaSecondary: "Написати на пошту",
    note: "Без тікетів і номерів звернень. Просто напишіть, що сталось.",
    facts: [
      { value: "протягом дня", label: "відповідь на звернення" },
      { value: "до 14 днів", label: "запуск з нашою участю" },
      { value: "щотижня", label: "оновлення платформи" },
    ],
  },

  channels: {
    eyebrow: "Куди писати",
    title: "Чотири канали — і жодного автовідповідача",
    text: "Оберіть той, що зручніший вам. Усі ведуть до тієї самої команди, яка налаштовувала вашу систему.",
    whenLabel: "Коли відповідаємо",
    items: [
      {
        id: "telegram",
        name: "Телеграм",
        handle: TELEGRAM_HANDLE,
        href: TELEGRAM_HREF,
        text: "Найшвидший канал. Питання по ходу дня, скріншот екрана або голосове — як вам зручніше.",
        when: "Протягом робочого дня",
      },
      {
        id: "mail",
        name: "Пошта",
        handle: MAIL,
        href: `mailto:${MAIL}`,
        text: "Для докладних звернень: вивантаження, документи, доступи — усе, що варто зафіксувати текстом.",
        when: "Протягом дня",
      },
      {
        id: "phone",
        name: "Телефон",
        handle: PHONE,
        href: PHONE_HREF,
        text: "Коли щось стало перед служінням і швидше пояснити голосом, ніж описувати.",
        when: "Пн–Пт, 9:00–18:00",
      },
      {
        id: "team",
        name: "Спільний чат із вашою командою",
        handle: "окремий канал",
        text: "Заводимо на етапі впровадження: там ваші адміністратори, лідери і ми. Лишається й після запуску.",
        when: "Створюємо під час впровадження",
      },
    ],
  },

  flow: {
    eyebrow: "Як це працює",
    title: "Що відбувається після вашого повідомлення",
    text: "Оформлювати нічого не потрібно — достатньо описати своїми словами. Далі це наша робота.",
    steps: [
      {
        title: "Ви пишете",
        text: "Текст, скріншот або голосове. Без форм, шаблонів і обов'язкових полів.",
      },
      {
        title: "Ми відтворюємо",
        text: "Дивимось на ваших даних, що саме сталось, і чи це налаштування, навчання чи наша помилка.",
      },
      {
        title: "Пояснюємо або правимо",
        text: "Питання — показуємо, де це в системі. Помилка — правимо і кажемо, коли буде виправлення.",
      },
      {
        title: "Повертаємось",
        text: "Перевіряємо разом з вами, що все на місці. Часті питання додаємо у відповіді на сайті.",
      },
    ],
    note: "Якщо питання виявляється про процеси, а не про кнопки, — переводимо його в консалтинг, і теж без окремої оплати до 1 листопада.",
  },

  care: {
    eyebrow: "Надійність",
    title: "Про що можна не турбуватись",
    text: "Частина роботи підтримки відбувається без вашої участі — і про неї варто знати заздалегідь.",
    items: [
      {
        title: "Щоденні резервні копії",
        text: "Копіювання відбувається автоматично щодня. Відновити можна будь-який знімок за останні 30 днів.",
      },
      {
        title: "Дані в ЄС",
        text: "Зберігання на серверах у Європейському Союзі з шифруванням AES-256, передача захищена TLS.",
      },
      {
        title: "Оновлення без простою",
        text: "Дрібні виправлення виходять щотижня і непомітно. Про великі оновлення попереджаємо заздалегідь.",
      },
      {
        title: "Дані лишаються вашими",
        text: "Повний експорт у CSV або Excel доступний будь-коли. Після скасування підписки дані зберігаються ще 60 днів.",
      },
    ],
  },

  self: {
    title: "Часто відповідь знаходиться швидше",
    text: "Перш ніж писати — ось три місця, де вже є пояснення.",
    links: [
      { label: "Питання і відповіді", text: "Комунікація, техніка, безпека даних", href: "/faq" },
      { label: "Телеграм-бот", text: "Що бачить кожна роль і як це виглядає в чаті", href: "/telegram" },
      { label: "Консалтинг", text: "Аудит процесів, впровадження, навчання команди", href: "/consulting" },
    ],
  },
};

const en: SupportCopy = {
  navLabel: "Support",
  seoTitle: "Support — MyChurch",
  seoDescription:
    "MyChurch support: Telegram, email and phone, a reply within the day, a shared channel for your team, daily backups and weekly updates.",

  hero: {
    eyebrow: "Support",
    title: "You are never left alone with the system",
    lead: "We go through launch, data migration and the first training together with your team — and stay around afterwards. Write to whichever channel suits you; the person who answers knows your church.",
    cta: "Message us on Telegram",
    ctaSecondary: "Send an email",
    note: "No tickets, no reference numbers. Just tell us what happened.",
    facts: [
      { value: "within a day", label: "reply to any request" },
      { value: "up to 14 days", label: "launch with us alongside" },
      { value: "weekly", label: "platform updates" },
    ],
  },

  channels: {
    eyebrow: "Where to write",
    title: "Four channels — and not a single auto-reply",
    text: "Pick the one that suits you. They all reach the same team that set your system up.",
    whenLabel: "When we reply",
    items: [
      {
        id: "telegram",
        name: "Telegram",
        handle: TELEGRAM_HANDLE,
        href: TELEGRAM_HREF,
        text: "The fastest channel. Questions as the day goes, a screenshot of the screen or a voice note — whichever is easier.",
        when: "Within the working day",
      },
      {
        id: "mail",
        name: "Email",
        handle: MAIL,
        href: `mailto:${MAIL}`,
        text: "For detailed requests: exports, documents, access rights — anything worth putting in writing.",
        when: "Within the day",
      },
      {
        id: "phone",
        name: "Phone",
        handle: PHONE,
        href: PHONE_HREF,
        text: "For when something breaks right before a service and talking is faster than typing.",
        when: "Mon–Fri, 9:00–18:00",
      },
      {
        id: "team",
        name: "A shared chat with your team",
        handle: "a channel of your own",
        text: "We open it during rollout: your admins, your leaders and us. It stays after launch too.",
        when: "Opened during rollout",
      },
    ],
  },

  flow: {
    eyebrow: "How it works",
    title: "What happens after your message",
    text: "Nothing needs to be formatted — describing it in your own words is enough. The rest is our job.",
    steps: [
      {
        title: "You write",
        text: "Text, a screenshot or a voice note. No forms, no templates, no required fields.",
      },
      {
        title: "We reproduce it",
        text: "We look at your own data to see what happened, and whether it is setup, training or a bug on our side.",
      },
      {
        title: "We explain or fix",
        text: "A question — we show you where it lives in the system. A bug — we fix it and tell you when the fix lands.",
      },
      {
        title: "We come back",
        text: "We check with you that everything is in place. Frequent questions go into the answers on the site.",
      },
    ],
    note: "If the question turns out to be about processes rather than buttons, we move it to consulting — also at no cost until 1 November.",
  },

  care: {
    eyebrow: "Reliability",
    title: "Things you don't have to think about",
    text: "Part of what support does happens without you — and it is worth knowing about in advance.",
    items: [
      {
        title: "Daily backups",
        text: "Backups run automatically every day. Any snapshot from the last 30 days can be restored.",
      },
      {
        title: "Data in the EU",
        text: "Stored on servers in the European Union with AES-256 encryption; transfer is protected by TLS.",
      },
      {
        title: "Updates without downtime",
        text: "Small fixes ship weekly and go unnoticed. We announce larger updates in advance.",
      },
      {
        title: "The data stays yours",
        text: "A full export to CSV or Excel is available at any time. After a cancellation the data is kept for another 60 days.",
      },
    ],
  },

  self: {
    title: "Often the answer is quicker to find",
    text: "Before you write — three places that already explain it.",
    links: [
      { label: "Questions and answers", text: "Communication, technology, data safety", href: "/faq" },
      { label: "Telegram bot", text: "What each role sees and how it looks in the chat", href: "/telegram" },
      { label: "Consulting", text: "Process audit, rollout, training for the team", href: "/consulting" },
    ],
  },
};

export const SUPPORT_COPY: Record<Lang, SupportCopy> = { ua, en };
