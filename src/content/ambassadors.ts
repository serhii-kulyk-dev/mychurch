import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Per-ambassador page content. One `AmbassadorDetail` per church in
   `i18n.about.ambassadors.items`; the id must match exactly.
   Copy is authored in both languages — the page has no chrome of its
   own, so every string lives here.

   We publish no counts of the church's people, accounts or groups — how
   many are in the system is the church's own data, not our proof. Keep the
   copy qualitative: what the church does, not how many of them there are.
   ──────────────────────────────────────────────────────────────── */

export interface AmbassadorCopy {
  seoTitle: string;
  /** 120–160 characters. */
  seoDescription: string;

  eyebrow: string;
  /** H1: who this church is, 6–12 words. */
  title: string;
  lead: string;
  /** 3–4 hard facts shown as a strip under the hero. */
  facts: { label: string; value: string }[];
  siteCta: string;
  /** Label of the "back" link at the foot of the page; it leads to /about. */
  backLabel: string;

  changeEyebrow: string;
  changeTitle: string;
  beforeLabel: string;
  afterLabel: string;
  /** 4–5 paired rows: life before MyChurch vs. now. */
  change: { before: string; after: string }[];

  modulesEyebrow: string;
  modulesTitle: string;
  modulesText: string;
  modulesCta: string;
  /** Modules the church runs day to day. `id` links to /modules/<id>;
      `name` must match the module name in the dictionary. */
  modules: { id: string; name: string; text: string }[];

  photosEyebrow: string;
  /** 3 wide photos under the hero. Files live in /public/ambassadors/<id>/. */
  photos: { src: string; alt: string; caption: string }[];
  /** Credit line under the photos; the church owns every shot on this page. */
  photoCredit: string;
  photoCreditCta: string;

  voicesEyebrow: string;
  voicesTitle: string;
  voicesText: string;
  /** Short lines quoted verbatim from the church's own site, each paired
      with our note on what stands behind it in MyChurch. `href` is the
      exact page the line comes from; `photo` sits in the same folder. */
  voices: { quote: string; source: string; href: string; photo: string; alt: string; note: string }[];
  voicesNoteLabel: string;

  ministriesEyebrow: string;
  ministriesTitle: string;
  ministriesText: string;
  /** The church's real ministries, as they are named on its own site. */
  ministries: { name: string; text: string; meta: string; photo: string; alt: string }[];

  timelineEyebrow: string;
  timelineTitle: string;
  timelineText: string;
  /** 4–6 dated entries: how the rollout actually went. */
  timeline: { when: string; title: string; text: string }[];
}

export interface AmbassadorDetail {
  id: string;
  name: string;
  city: string;
  /** Accent colour used across the page; must read on light and dark. */
  accent: string;
  logo?: string;
  initials: string;
  website: string;
  /** Promo clip for the homepage: a Google Drive file id (embedded as
      /file/<id>/preview) plus a local poster frame, so nothing loads until
      the visitor presses play. */
  promo?: { fileId: string; poster: string };
  copy: Record<Lang, AmbassadorCopy>;
}

export const AMBASSADORS: AmbassadorDetail[] = [
  {
    id: "nove-zhyttia",
    name: "Нове Життя",
    city: "Черкаси",
    accent: "#0f766e",
    logo: "/new-life-logo.png",
    initials: "НЖ",
    website: "https://newlife.ck.ua/",
    /* TODO: replace with the church's own promo clip once it is uploaded.
       Until then this is the real «Люди і сім'ї» recording from its system. */
    promo: { fileId: "1Lch0m1YFJVIltcaR2DaGk5Z2VGhuy9HB", poster: "/ambassadors/video/people.webp" },
    copy: {
      ua: {
        seoTitle: "Церква «Нове Життя», Черкаси — амбасадор «Моя Церква»",
        seoDescription:
          "Як черкаська церква «Нове Життя» працює в «Моїй Церкві»: які модулі використовує щодня, що змінилось у служіннях і як проходило впровадження.",
        eyebrow: "Головний амбасадор",
        title: "«Нове Життя» — перша церква, яка перевела своє служіння в MyChurch",
        lead:
          "Черкаська церква з двома недільними служіннями, дитячим містечком, спортивним клубом і двома підлітковими служіннями. Поки що це наш головний і єдиний амбасадор: церква користується всіма модулями системи, і саме на її процесах ми перевіряємо кожен з них, перш ніж віддати іншим церквам.",
        facts: [
          { label: "Місто", value: "Черкаси" },
          { label: "Адреса", value: "проспект Перемоги, 13/5" },
          { label: "Служіння", value: "Неділя, 10:00 і 12:00" },
          { label: "У MyChurch", value: "понад рік — з березня 2025" },
        ],
        siteCta: "Сайт церкви",
        backLabel: "Про нас",

        changeEyebrow: "Що змінилось",
        changeTitle: "Було і стало",
        beforeLabel: "До MyChurch",
        afterLabel: "Зараз",
        change: [
          {
            before: "База церкви жила в кількох Google Таблицях, і кожне служіння вело свою.",
            after: "Одна база на всю церкву: у кожної картки — група, служіння та відповідальна людина.",
          },
          {
            before: "Явку рахували на папері, а потім зводили вручну перед нарадою.",
            after: "Лідер відмічає присутніх з телефона, звіт по групі збирається сам.",
          },
          {
            before: "Новенький потрапляв у чат і губився за два тижні.",
            after: "Онбординг веде людину від першого візиту до групи — видно, хто застряг на кроці.",
          },
          {
            before: "Дітей на Kid's Town записували в зошит на вході.",
            after: "Відмітка приходу дитини за номером, батьки й алергії — у картці, а не в зошиті.",
          },
          {
            before: "Оголошення про служіння дублювали в кілька чатів руками.",
            after: "Telegram-бот церкви шле розклад і нагадування сам, за групами й служіннями.",
          },
        ],

        modulesEyebrow: "Модулі в роботі",
        modulesTitle: "Церква користується всіма модулями системи",
        modulesText:
          "«Нове Життя» — єдина церква, у якій увімкнено MyChurch повністю: від карток людей до бухгалтерії, інтеграцій та ШІ-помічника. Ось ті модулі, які працюють у ній щодня.",
        modulesCta: "Усі модулі MyChurch",
        modules: [
          { id: "people", name: "Люди", text: "Серце системи: картки з контактами, родинами, статусами й історією участі." },
          { id: "groups", name: "Малі групи", text: "У кожної групи свій лідер і відмітки явки з телефона після зустрічі." },
          { id: "ministries", name: "Служіння", text: "Команди прославлення, гостинності й медіа з графіками та ролями на кожну неділю." },
          { id: "kids-town", name: "Дитяче містечко", text: "Дитяче служіння Kid's Town: запис, відмітка приходу, групи за віком і безпека." },
          { id: "onboarding", name: "Онбординг", text: "Шлях новенького від першого візиту до малої групи — з відповідальною людиною на кожному кроці." },
          { id: "events", name: "Організатор подій", text: "Ярмарок малих груп, День Подяки, табори: реєстрація, команда й нагадування." },
          { id: "telegram-bot", name: "Telegram-бот", text: "Розклад, реєстрації та молитовні потреби приходять у бот церкви, а не в особисті повідомлення." },
          { id: "analytics", name: "Аналітика та звіти", text: "Відвідуваність двох служінь, ріст груп і активність служінь — на одному дашборді." },
        ],

        photosEyebrow: "Церква в кадрі",
        photos: [
          { src: "/ambassadors/nove-zhyttia/propovid.webp", alt: "Проповідь у День Подяки на сцені церкви «Нове Життя»", caption: "День Подяки — одна з подій, які церква планує в системі" },
          { src: "/ambassadors/nove-zhyttia/khreshchennia.webp", alt: "Хрещення у відкритому басейні", caption: "Хрещення: заявка, підготовка і список — у картках людей" },
          { src: "/ambassadors/nove-zhyttia/foye.webp", alt: "Люди спілкуються в залі церкви після служіння", caption: "Після служіння: гості, з якими далі працює онбординг" },
        ],
        photoCredit: "Фото — церкви «Нове Життя»",
        photoCreditCta: "newlife.ck.ua",

        voicesEyebrow: "Голос церкви",
        voicesTitle: "Як церква говорить про себе — і що за цим у системі",
        voicesText:
          "Ліворуч — рядки з сайту «Нового Життя», слово в слово. Праворуч — наша нотатка: що саме тримає цю обіцянку в MyChurch щодня.",
        voices: [
          {
            quote: "Ми віримо, що церква — це не будівля, а люди.",
            source: "«Нове Життя», сторінка «Про нас»",
            href: "https://www.newlife.ck.ua/about-us/",
            photo: "/ambassadors/nove-zhyttia/spilnota.webp",
            alt: "Люди спілкуються після служіння, чоловік тримає дитину на руках",
            note: "Картка людини й сім'ї: історія служіння, група, контакт — замість рядка в таблиці.",
          },
          {
            quote: "У Kid\u2019s Town кожна дитина — це унікальна особистість.",
            source: "«Нове Життя», сторінка Kid\u2019s Town",
            href: "https://www.newlife.ck.ua/prostir_dlia_pokolin/kids-town/",
            photo: "/ambassadors/nove-zhyttia/kids-town-zal.webp",
            alt: "Діти сидять колом у дитячій кімнаті Kid\u2019s Town",
            note: "Бейджик з іменем і код для батьків на вході — це відмітка приходу дитячого служіння в системі.",
          },
          {
            quote: "Тут ми дружимо, молимося і підтримуємо один одного.",
            source: "«Нове Життя», сторінка малих груп",
            href: "https://www.newlife.ck.ua/next-steps/small-groups/",
            photo: "/ambassadors/nove-zhyttia/mala-grupa-2.webp",
            alt: "Учасники малої групи розмовляють у домашній обстановці",
            note: "Групи з розкладом і явкою: лідер бачить свою групу, пастор — усю мережу.",
          },
        ],
        voicesNoteLabel: "У MyChurch",

        ministriesEyebrow: "Служіння церкви",
        ministriesTitle: "Простір для поколінь — і кожне покоління в системі",
        ministriesText:
          "«Нове Життя» веде служіння для всіх вікових груп. Кожне з них має в MyChurch свій склад, графік і явку.",
        ministries: [
          { name: "Kid's Town", text: "Дитяче служіння із записом і відміткою приходу на вході.", meta: "Щонеділі на обох служіннях", photo: "/ambassadors/nove-zhyttia/kids-town.webp", alt: "Діти за столиками на занятті Kid\u2019s Town" },
          { name: "Awana", text: "Спортивний клуб: команди, тренування та облік участі.", meta: "Щотижневі тренування", photo: "/ambassadors/nove-zhyttia/awana.webp", alt: "Збір спортивного клубу Awana у залі з прапорцями" },
          { name: "YL Cliff", text: "Підліткове служіння зі своїм розкладом і командою лідерів.", meta: "Свій розклад зустрічей", photo: "/ambassadors/nove-zhyttia/cliff.webp", alt: "Спільне фото підлітків і лідерів YL Cliff" },
          { name: "WL West", text: "Друге підліткове служіння — окремий склад і своя явка.", meta: "Окремий склад і явка", photo: "/ambassadors/nove-zhyttia/west.webp", alt: "Зустріч WL West: підлітки перед екраном Young Life" },
          { name: "Малі групи", text: "Мережа домашніх груп із зустрічами протягом тижня.", meta: "Зустрічі протягом тижня", photo: "/ambassadors/nove-zhyttia/mala-grupa.webp", alt: "Мала група за столом з Бібліями" },
          { name: "Прославлення й медіа", text: "Графіки команд на два недільні служіння та онлайн-трансляцію.", meta: "2 служіння щонеділі", photo: "/ambassadors/nove-zhyttia/sluzhinnia.webp", alt: "Зал під час недільного служіння, команда прославлення на сцені" },
        ],

        timelineEyebrow: "Впровадження",
        timelineTitle: "Як церква переходила в систему",
        timelineText: "Без «великого запуску». Ось що відбувалось крок за кроком — і скільки це зайняло насправді.",
        timeline: [
          {
            when: "Лютий 2025",
            title: "Перша розмова",
            text: "Сорок хвилин із пастором і адміністрацією: як влаштовані служіння, хто веде облік і що болить найбільше.",
          },
          {
            when: "Березень 2025",
            title: "Перенесення бази",
            text: "Уся база з Google Таблиць за три дні. Дублікати система показала ще до імпорту.",
          },
          {
            when: "Квітень 2025",
            title: "Лідери в системі",
            text: "Акаунти, ролі й доступи для команди: лідер бачить свою групу, пастор — усю церкву.",
          },
          {
            when: "Вересень 2025",
            title: "Уся система в роботі",
            text: "Kid's Town, Awana та двоє підліткових служінь отримали власні склади й відмітку приходу — і церква ввімкнула решту модулів, аж до бухгалтерії та ШІ-помічника.",
          },
          {
            when: "Вересень 2026",
            title: "Церква працює сама",
            text: "Понад рік у системі без повернення до таблиць. Звіти за місяць — за кілька хвилин замість вечора; ми поруч, але щоденна робота йде без нас.",
          },
        ],
      },

      en: {
        seoTitle: "New Life Church, Cherkasy — MyChurch ambassador",
        seoDescription:
          "How New Life Church in Cherkasy runs on MyChurch: which modules they use daily, what changed across their ministries and how the rollout went.",
        eyebrow: "Lead ambassador",
        title: "New Life — the first church to move its ministry into MyChurch",
        lead:
          "A Cherkasy church with two Sunday services, a kids' town, a sports club and two teen ministries. It is still our lead and only ambassador: the church uses every module in the system, and it is their processes we test each one against before other churches get it.",
        facts: [
          { label: "City", value: "Cherkasy" },
          { label: "Address", value: "13/5 Peremohy Avenue" },
          { label: "Services", value: "Sunday, 10:00 and 12:00" },
          { label: "On MyChurch", value: "over a year — since March 2025" },
        ],
        siteCta: "Church website",
        backLabel: "About us",

        changeEyebrow: "What changed",
        changeTitle: "Before and after",
        beforeLabel: "Before MyChurch",
        afterLabel: "Now",
        change: [
          {
            before: "The church database lived in several Google Sheets, one per ministry.",
            after: "One database for the whole church: every profile has a group, a ministry and someone responsible.",
          },
          {
            before: "Attendance was counted on paper and merged by hand before the meeting.",
            after: "A leader marks attendance from a phone and the group report builds itself.",
          },
          {
            before: "A newcomer landed in a chat and disappeared within two weeks.",
            after: "Onboarding walks a person from first visit to a small group — you can see who is stuck.",
          },
          {
            before: "Kids at Kid's Town were signed in on a paper list at the door.",
            after: "Child check-in by number, with parents and allergies in the profile instead of a notebook.",
          },
          {
            before: "Service announcements were copied into several chats by hand.",
            after: "The church Telegram bot sends the schedule and reminders on its own, per group and ministry.",
          },
        ],

        modulesEyebrow: "Modules in use",
        modulesTitle: "The church runs every module in the system",
        modulesText:
          "New Life is the one church with the whole of MyChurch switched on: from people profiles to finance, integrations and the AI assistant. These are the modules it uses every day.",
        modulesCta: "All MyChurch modules",
        modules: [
          { id: "people", name: "People", text: "The heart of the system: profiles with contacts, families, statuses and history." },
          { id: "groups", name: "Small groups", text: "Every group has its leader, with attendance marked from a phone after the meeting." },
          { id: "ministries", name: "Ministries", text: "Worship, hospitality and media teams with schedules and roles for every Sunday." },
          { id: "kids-town", name: "Kids Town", text: "The Kid's Town children's ministry: registration, check-in, age groups and safety." },
          { id: "onboarding", name: "Onboarding", text: "A newcomer's path from first visit to a small group, with a named owner at every step." },
          { id: "events", name: "Event organiser", text: "The small-groups fair, Thanksgiving Day, camps: registration, team and reminders." },
          { id: "telegram-bot", name: "Telegram bot", text: "Schedule, registrations and prayer requests arrive in the church bot, not in private messages." },
          { id: "analytics", name: "Analytics and reports", text: "Attendance for both services, group growth and ministry activity on one dashboard." },
        ],

        photosEyebrow: "The church, unposed",
        photos: [
          { src: "/ambassadors/nove-zhyttia/propovid.webp", alt: "A sermon on Thanksgiving Day at New Life church", caption: "Thanksgiving Day — one of the events the church plans in the system" },
          { src: "/ambassadors/nove-zhyttia/khreshchennia.webp", alt: "A baptism in an outdoor pool", caption: "Baptism: the request, the prep and the list all sit in people's profiles" },
          { src: "/ambassadors/nove-zhyttia/foye.webp", alt: "People talking in the church hall after a service", caption: "After the service: the guests onboarding picks up from here" },
        ],
        photoCredit: "Photos by New Life church",
        photoCreditCta: "newlife.ck.ua",

        voicesEyebrow: "The church's own words",
        voicesTitle: "How the church describes itself — and what backs it in the system",
        voicesText:
          "On the left, lines from New Life's own site, word for word. On the right, our note: what actually keeps that promise running in MyChurch.",
        voices: [
          {
            quote: "We believe the church is not a building, but people.",
            source: "New Life, “About us” page",
            href: "https://www.newlife.ck.ua/about-us/",
            photo: "/ambassadors/nove-zhyttia/spilnota.webp",
            alt: "People talking after a service, a man holding a baby",
            note: "A profile per person and family: ministry history, group and contact instead of a spreadsheet row.",
          },
          {
            quote: "In Kid\u2019s Town every child is a unique person.",
            source: "New Life, Kid\u2019s Town page",
            href: "https://www.newlife.ck.ua/prostir_dlia_pokolin/kids-town/",
            photo: "/ambassadors/nove-zhyttia/kids-town-zal.webp",
            alt: "Children sitting in a circle in the Kid\u2019s Town room",
            note: "A name badge and a parent code at the door — that is the children's ministry check-in in the system.",
          },
          {
            quote: "This is where we make friends, pray and support each other.",
            source: "New Life, small groups page",
            href: "https://www.newlife.ck.ua/next-steps/small-groups/",
            photo: "/ambassadors/nove-zhyttia/mala-grupa-2.webp",
            alt: "Small group members talking in a living room",
            note: "Groups with schedules and attendance: a leader sees their group, the pastor sees the whole network.",
          },
        ],
        voicesNoteLabel: "In MyChurch",

        ministriesEyebrow: "Church ministries",
        ministriesTitle: "A space for every generation — and every generation in the system",
        ministriesText:
          "New Life runs ministries for every age group. Each one has its own members, schedule and attendance in MyChurch.",
        ministries: [
          { name: "Kid's Town", text: "Children's ministry with registration and check-in at the door.", meta: "Every Sunday, both services", photo: "/ambassadors/nove-zhyttia/kids-town.webp", alt: "Children at tables during a Kid\u2019s Town session" },
          { name: "Awana", text: "A sports club: teams, practice and participation records.", meta: "Weekly practice", photo: "/ambassadors/nove-zhyttia/awana.webp", alt: "An Awana sports club gathering in a hall with bunting" },
          { name: "YL Cliff", text: "A teen ministry with its own schedule and team of leaders.", meta: "Its own meeting schedule", photo: "/ambassadors/nove-zhyttia/cliff.webp", alt: "A group photo of YL Cliff teens and leaders" },
          { name: "WL West", text: "The second teen ministry — separate members and its own attendance.", meta: "Separate members and attendance", photo: "/ambassadors/nove-zhyttia/west.webp", alt: "A WL West meeting: teens in front of a Young Life screen" },
          { name: "Small groups", text: "A network of home groups meeting through the week.", meta: "Meeting through the week", photo: "/ambassadors/nove-zhyttia/mala-grupa.webp", alt: "A small group around a table with Bibles" },
          { name: "Worship and media", text: "Team schedules for two Sunday services and the live stream.", meta: "2 services a Sunday", photo: "/ambassadors/nove-zhyttia/sluzhinnia.webp", alt: "The hall during a Sunday service with the worship team on stage" },
        ],

        timelineEyebrow: "Rollout",
        timelineTitle: "How the church moved into the system",
        timelineText: "No big-bang launch. Here is what happened step by step — and how long it really took.",
        timeline: [
          {
            when: "February 2025",
            title: "The first conversation",
            text: "Forty minutes with the pastor and the administration: how ministries work, who keeps the records, what hurts most.",
          },
          {
            when: "March 2025",
            title: "Database migration",
            text: "The whole database out of Google Sheets in three days. Duplicates were flagged before the import ran.",
          },
          {
            when: "April 2025",
            title: "Leaders on board",
            text: "Accounts, roles and access for the team: a leader sees their group, the pastor sees the whole church.",
          },
          {
            when: "September 2025",
            title: "The whole system switched on",
            text: "Kid's Town, Awana and both teen ministries got their own members and check-in — and the church turned on the remaining modules, right through to finance and the AI assistant.",
          },
          {
            when: "September 2026",
            title: "The church runs it itself",
            text: "More than a year in the system with no going back to spreadsheets. Monthly reports take minutes instead of an evening; we're still here, but the daily work runs without us.",
          },
        ],
      },
    },
  },
];

const BY_ID = new Map(AMBASSADORS.map((a) => [a.id, a]));

export function getAmbassador(id: string): AmbassadorDetail | undefined {
  return BY_ID.get(id);
}

/** Ids that have a dedicated page (used by generateStaticParams and links). */
export const AMBASSADOR_IDS = AMBASSADORS.map((a) => a.id);

export function hasAmbassadorPage(id: string) {
  return BY_ID.has(id);
}

/** The single church we publish as an ambassador — every "Амбасадор" link
    in the chrome goes straight to its page, there is no listing in between. */
export const LEAD_AMBASSADOR = AMBASSADORS[0];
export const LEAD_AMBASSADOR_HREF = `/ambassadors/${AMBASSADORS[0].id}`;
