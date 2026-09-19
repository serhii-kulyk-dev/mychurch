import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Сторінка «Порівняння».

   Церква майже ніколи не обирає між двома церковними системами.
   Реальний вибір інший: лишитись у таблицях, взяти закордонну
   систему або зліпити своє на універсальній CRM. Тому колонки тут —
   це три способи життя, а не три бренди.

   Правила цієї сторінки:
     • нікого не сварим — у кожного варіанта є рядок «за що беруть»
       і рядок «коли нас брати не треба»;
     • є окремий блок про те, де конкуренти сильніші за нас, —
       без нього порівняння не варте читання;
     • усі цифри взяті з офіційних сторінок і мають джерело поруч.
       Перевірено 19 вересня 2026 року. Міняється ціна — міняємо тут
       і оновлюємо `checked`.

   Ціни й обіцянки мають збігатися з `pricing.ts` (щаблі, програма
   безкоштовного підключення) і з `legal.ts` (експорт, 60 днів,
   застосунок у розробці).
   ──────────────────────────────────────────────────────────────── */

/** Коли востаннє звіряли ціни й мови з офіційними сторінками. */
export const COMPARE_CHECKED = "2026-09-19";

export interface CompareRival {
  id: string;
  /** Підпис колонки в таблиці — має вміщатись у вузьку колонку. */
  short: string;
  /** Повна назва варіанта в розповіді. */
  name: string;
  /** Як це виглядає в церкві просто зараз. */
  reality: string;
  /** За що це беруть — без іронії. */
  strength: string;
  /** Де ламається, коли церква росте. */
  breaks: string[];
  /** Що на цьому місці робимо ми. */
  ours: string;
  /** Коли цього варіанта достатньо і нас брати не треба. */
  enough: string;
}

export interface CompareRow {
  id: string;
  criterion: string;
  /** Значення по кожному варіанту: ключ — `CompareRival.id`. */
  cells: Record<string, string>;
  /** Наше значення — завжди остання колонка. */
  ours: string;
}

export interface CompareSource {
  label: string;
  href: string;
  fact: string;
}

export interface CompareCopy {
  seoTitle: string;
  seoDescription: string;
  navLabel: string;

  eyebrow: string;
  title: string;
  lead: string;
  fairness: string;
  /* Посилання на розбір у блозі — для тих, хто ще не порівнює, а придивляється. */
  guide: { text: string; label: string; href: string };

  rivalsEyebrow: string;
  rivalsTitle: string;
  rivalsText: string;
  /** Підписи всередині картки варіанта. */
  realityLabel: string;
  strengthLabel: string;
  breaksLabel: string;
  oursLabel: string;
  enoughLabel: string;
  rivals: CompareRival[];

  tableEyebrow: string;
  tableTitle: string;
  tableText: string;
  /** Підпис нашої колонки. */
  usColumn: string;
  rows: CompareRow[];
  tableNote: string;

  strongerEyebrow: string;
  strongerTitle: string;
  strongerText: string;
  stronger: { title: string; text: string }[];

  noTitle: string;
  noText: string;
  no: string[];

  sourcesTitle: string;
  sourcesText: string;
  sources: CompareSource[];
}

const ua: CompareCopy = {
  seoTitle: "Порівняння систем для церкви — «Моя Церква», таблиці, Planning Center, Breeze",
  seoDescription:
    "Чесне порівняння: Google Таблиці й чати, закордонні системи (Planning Center, Breeze, ChurchTools) та універсальні CRM проти «Моєї Церкви» — мова, ціна, Telegram, перенесення даних і де вони сильніші за нас.",
  navLabel: "Порівняння",

  eyebrow: "Порівняння",
  title: "З чим порівнюють «Мою Церкву» — і де різниця справді є",
  lead: "Церква рідко обирає між двома церковними системами. Реальний вибір інший: лишитись у таблицях, взяти закордонну систему або зліпити своє на універсальній CRM. Тут усі три варіанти — за що їх беруть, де вони ламаються і де сильніші за нас.",
  fairness:
    "Ми нікого не сварим. Planning Center, Breeze і ChurchTools зроблені добре — просто зроблені не для української церкви. Якщо вам у них добре, переходити немає сенсу, і ми скажемо це на дзвінку.",
  guide: {
    text: "Ще не порівнюєте, а тільки придивляєтесь?",
    label: "Дванадцять запитань, які варто поставити будь-якій системі на демонстрації",
    href: "/blog/yak-obraty-systemu-dlia-tserkvy",
  },

  rivalsEyebrow: "Варіанти",
  rivalsTitle: "Три способи, якими церкви ведуть облік просто зараз",
  rivalsText:
    "Кожен з них комусь підходить. Питання не в тому, який кращий взагалі, а в тому, на якому розмірі й темпі він перестає витримувати.",
  realityLabel: "Як це виглядає",
  strengthLabel: "За що беруть",
  breaksLabel: "Де ламається",
  oursLabel: "Що на цьому місці робимо ми",
  enoughLabel: "Коли цього достатньо і нас брати не треба",
  rivals: [
    {
      id: "sheets",
      short: "Таблиці й чати",
      name: "Google Таблиці, чати і зошит лідера",
      reality:
        "Список членів — в одній таблиці, явка — в зошиті лідера, оголошення — в трьох чатах, фінанси — в окремому файлі, який бачить одна людина.",
      strength: "Нічого не коштує, нікого не треба вчити й працює з першого дня.",
      breaks: [
        "Немає історії: ви бачите сьогоднішній стан, але не бачите, що людина не приходила шість тижнів.",
        "Дані дублюються: та сама сім'я живе в трьох файлах, і в кожному по-своєму.",
        "Права доступу — це чиясь добра воля: або файл відкритий усім, або нікому.",
        "Звіт для ради збирається руками, і щоразу заново.",
      ],
      ours: "Ваша таблиця лишається основою — ми її забираємо й зв'язуємо: людина належить сім'ї, групі та служінню, явка сама лягає в аналітику, а звіт складається без зведення файлів.",
      enough:
        "Якщо в громаді 20–30 людей і всі знають одне одного на ім'я, таблиці справді працюють. Це не той випадок, коли треба щось впроваджувати.",
    },
    {
      id: "foreign",
      short: "Закордонна система",
      name: "Planning Center, Breeze, ChurchTools",
      reality:
        "Зрілі продукти з великою спільнотою й докладною довідкою. Саме їх радять, коли питаєш пораду англійською.",
      strength:
        "Роками обкатані сценарії, вбудований прийом пожертв карткою і власні застосунки для прихожан — цього в нас поки немає.",
      breaks: [
        "Інтерфейс і підтримка — англійською, у ChurchTools ще німецькою й фінською. Українською не говорить жодна.",
        "Оплата — картка в доларах або євро: Breeze бере 72 долари на місяць, ChurchTools — від 34 до 369 євро залежно від розміру громади, Planning Center виставляє окремий рахунок за кожен зі своїх десяти продуктів.",
        "Telegram там не робочий канал. Церква, яка живе в Telegram, отримує систему, у яку треба окремо заходити.",
        "Перенесення ваших таблиць і навчання команди — ваш клопіт, не їхній.",
        "Підтримка відповідає у своєму часовому поясі й своєю мовою.",
      ],
      ours: "Українська — в інтерфейсі, у боті й у відповідях підтримки. Оплата в гривні, без валютної картки. Telegram — не канал сповіщень, а місце, де лідер відмічає явку й відповідає на служіння.",
      enough:
        "Якщо команда вільно працює англійською, валютна картка є, а система вас влаштовує — лишайтесь. Міграція заради міграції нікому не потрібна.",
    },
    {
      id: "crm",
      short: "Універсальна CRM",
      name: "Універсальна CRM, Notion, дошки й самописні бази",
      reality:
        "Хтось із команди зібрав базу людей у Notion, заявки — на дошці, нагадування — у планувальнику. Виглядає акуратно й майже нічого не коштує.",
      strength: "Повна свобода: процес можна описати рівно так, як він живе саме у вашій церкві.",
      breaks: [
        "Усе, що в церковній системі є з коробки — сім'ї, групи, служіння, явка, сезони, — доводиться проєктувати самому.",
        "Ролі «пастор», «лідер групи», «служитель» треба вигадати й підтримувати руками.",
        "Усе тримається на людині, яка це зібрала. Коли вона переходить в інше служіння, система стає непрозорою за місяць.",
        "Ціна рахується за кожного користувача — а в церкві їх десятки.",
      ],
      ours: "Церковна модель уже описана: сім'я, група, служіння, явка, заявка, сезон. Ролі й права теж — їх не треба вигадувати. Якщо процес у вас інший, його налаштовують, а не малюють з нуля.",
      enough:
        "Якщо у вас є своя людина в розробці, яка супроводжує це роками, самописне рішення буде точнішим за будь-яку готову систему.",
    },
  ],

  tableEyebrow: "Поруч",
  tableTitle: "Те саме — рядок за рядком",
  tableText:
    "Тільки ті критерії, через які церкви справді повертаються до нас після демонстрації. Решту — кількість модулів і довжину списку функцій — ви й так побачите у всіх.",
  usColumn: "Моя Церква",
  rows: [
    {
      id: "language",
      criterion: "Мова інтерфейсу й підтримки",
      cells: {
        sheets: "Ваша — ви ж її і пишете",
        foreign: "Англійська, подекуди німецька",
        crm: "Українська буває, церковних слів немає",
      },
      ours: "Українська та англійська, підтримка українською",
    },
    {
      id: "model",
      criterion: "Сім'ї, групи, служіння, явка",
      cells: {
        sheets: "Малюєте самі, у кожному файлі по-своєму",
        foreign: "Є — зібрані під їхню культуру служіння",
        crm: "Немає: є контакти й угоди",
      },
      ours: "Є — зібрані під українську церкву",
    },
    {
      id: "telegram",
      criterion: "Telegram як робоче місце",
      cells: {
        sheets: "Чат живе окремо від бази",
        foreign: "Немає",
        crm: "Хіба що сповіщення",
      },
      ours: "Явка, заявки, служіння й розсилки — у боті",
    },
    {
      id: "payment",
      criterion: "Чим платити",
      cells: {
        sheets: "Нічим",
        foreign: "Картка в доларах або євро",
        crm: "Плата за кожного користувача",
      },
      ours: "Гривня, без валютної картки",
    },
    {
      id: "price",
      criterion: "Скільки це орієнтовно",
      cells: {
        sheets: "0",
        foreign: "72 долари на місяць (Breeze), 34–369 євро (ChurchTools)",
        crm: "Ставка за користувача × десятки людей",
      },
      ours: "Від 4 чашок кави на місяць; підключення зараз безкоштовне",
    },
    {
      id: "migration",
      criterion: "Перенесення з таблиць",
      cells: {
        sheets: "Нікуди не треба",
        foreign: "Ваш клопіт",
        crm: "Ваш клопіт",
      },
      ours: "Переносимо ми, до 14 днів",
    },
    {
      id: "training",
      criterion: "Навчання команди",
      cells: {
        sheets: "Не потрібне",
        foreign: "Відео й довідка англійською",
        crm: "Вчить той, хто збирав",
      },
      ours: "Входить у підключення — поки не почнуть працювати самі",
    },
    {
      id: "export",
      criterion: "Якщо вирішите піти",
      cells: {
        sheets: "Файл і так ваш",
        foreign: "Експорт є, домовленість англійською",
        crm: "Залежить від сервісу",
      },
      ours: "Експорт у CSV і Excel будь-коли, база чекає 60 днів",
    },
    {
      id: "maturity",
      criterion: "Скільки продукту років",
      cells: {
        sheets: "Десятиліття звички",
        foreign: "Не перший десяток років на ринку",
        crm: "Стільки, скільки в тієї людини було часу",
      },
      ours: "Молодий: понад рік щоденної роботи в церкві «Нове Життя»",
    },
  ],
  tableNote:
    "Ціни закордонних систем — з їхніх офіційних сторінок, посилання нижче. Ставка за користувача в універсальних CRM залежить від сервісу й тарифу, тому точної суми ми тут не називаємо.",

  strongerEyebrow: "Чесно",
  strongerTitle: "Де закордонні системи сильніші за нас",
  strongerText: "Порівняння без цього блоку не варте читання. Ось що вони вміють, а ми — ще ні.",
  stronger: [
    {
      title: "Вік і спільнота",
      text: "Вони на ринку не перший десяток років. Тисячі церков уже наступили за них на всі граблі, і майже на будь-яке питання в довідці є відповідь. Такого за рік не пишуть.",
    },
    {
      title: "Прийом пожертв карткою",
      text: "У Planning Center і Breeze це вбудований платіжний модуль: людина жертвує просто в системі. У нас пожертви й витрати ведуться в обліку, але гроші через систему не проходять.",
    },
    {
      title: "Власний застосунок для прихожан",
      text: "У Planning Center для цього є окремий застосунок Church Center. У нас систему адаптовано під телефон у браузері, а окремий застосунок для iOS та Android — у розробці.",
    },
    {
      title: "Ширина інтеграцій",
      text: "У них десятки готових з'єднань зі звичними для них сервісами. Наш список коротший і росте під те, чим користуються українські церкви.",
    },
  ],

  noTitle: "Коли ми самі скажемо, що нас брати не треба",
  noText: "Це не кокетство: невдале впровадження коштує церкві більше, ніж відсутність системи.",
  no: [
    "Громада до 30 людей, у якій таблиця поки не болить.",
    "Вам потрібно приймати пожертви карткою всередині системи вже зараз.",
    "Ви роками працюєте в закордонній системі, команда вільно говорить англійською і нічого не ламається.",
    "Ви шукаєте безкоштовне назавжди: безкоштовне підключення колись стане платною підпискою, і ми попередимо про це заздалегідь.",
  ],

  sourcesTitle: "Звідки цифри",
  sourcesText:
    "Ціни й мови взяті з офіційних сторінок цих систем і звірені 19 вересня 2026 року. Вони змінюються — побачите розбіжність, напишіть нам, і ми виправимо.",
  sources: [
    {
      label: "Planning Center — тарифи",
      href: "https://www.planningcenter.com/pricing",
      fact: "Десять окремих продуктів, у кожного свій безкоштовний рівень і свій рахунок; ціни в доларах.",
    },
    {
      label: "Breeze — тарифи",
      href: "https://www.breezechms.com/pricing",
      fact: "72 долари на місяць, без обмеження на кількість людей у базі.",
    },
    {
      label: "ChurchTools — тарифи",
      href: "https://church.tools/preise",
      fact: "Від 34 до 369 євро на місяць за розміром громади; інтерфейс німецькою, англійською та фінською.",
    },
  ],
};

const en: CompareCopy = {
  seoTitle: "Church software compared — MyChurch, spreadsheets, Planning Center, Breeze",
  seoDescription:
    "An honest comparison: spreadsheets and chats, foreign systems (Planning Center, Breeze, ChurchTools) and general-purpose CRMs against MyChurch — language, price, Telegram, data migration, and where they beat us.",
  navLabel: "Comparison",

  eyebrow: "Comparison",
  title: "What churches compare us with — and where the difference is real",
  lead: "A church rarely chooses between two church systems. The real choice is different: stay in spreadsheets, buy a foreign system, or build something on a general-purpose CRM. Here are all three — what they are taken for, where they break, and where they beat us.",
  fairness:
    "We are not running anyone down. Planning Center, Breeze and ChurchTools are built well — they are simply not built for a Ukrainian church. If they work for you, there is no reason to move, and we will say so on the call.",
  guide: {
    text: "Not comparing yet, just looking around?",
    label: "Twelve questions worth asking any system during a demo",
    href: "/blog/yak-obraty-systemu-dlia-tserkvy",
  },

  rivalsEyebrow: "The options",
  rivalsTitle: "Three ways churches keep records right now",
  rivalsText:
    "Each of them suits someone. The question is not which is better in general, but at what size and pace it stops holding up.",
  realityLabel: "What it looks like",
  strengthLabel: "Why people take it",
  breaksLabel: "Where it breaks",
  oursLabel: "What we do in its place",
  enoughLabel: "When it is enough and you don't need us",
  rivals: [
    {
      id: "sheets",
      short: "Spreadsheets",
      name: "Google Sheets, group chats and a leader's notebook",
      reality:
        "The member list is in one spreadsheet, attendance in a leader's notebook, announcements across three chats, and the finances in a separate file only one person can open.",
      strength: "It costs nothing, needs no training and works from day one.",
      breaks: [
        "There is no history: you see today, but not that someone has been away for six weeks.",
        "Data duplicates: the same family lives in three files, spelled differently in each.",
        "Access rights are somebody's goodwill: the file is open to everyone or to no one.",
        "The report for the board is assembled by hand, from scratch, every time.",
      ],
      ours: "Your spreadsheet stays the starting point — we take it and connect it: a person belongs to a family, a group and a ministry, attendance lands in the analytics by itself, and the report assembles without merging files.",
      enough:
        "With 20–30 people who all know each other by name, spreadsheets genuinely work. That is not a case for rolling anything out.",
    },
    {
      id: "foreign",
      short: "Foreign system",
      name: "Planning Center, Breeze, ChurchTools",
      reality:
        "Mature products with a large community and thorough documentation. They are exactly what you are pointed to when you ask for advice in English.",
      strength:
        "Scenarios polished over years, built-in card giving and their own apps for the congregation — none of which we have yet.",
      breaks: [
        "The interface and the support are in English, and in German and Finnish for ChurchTools. None of them speaks Ukrainian.",
        "You pay by card in dollars or euros: Breeze charges 72 dollars a month, ChurchTools 34 to 369 euros depending on the size of the congregation, and Planning Center bills separately for each of its ten products.",
        "Telegram is not a working channel there. A church that lives in Telegram gets a system it has to log into separately.",
        "Migrating your spreadsheets and training your team is your problem, not theirs.",
        "Support answers in its own time zone and its own language.",
      ],
      ours: "Ukrainian in the interface, in the bot and in the answers from support. Payment in hryvnia, with no foreign-currency card. Telegram is not a notification channel but the place where a leader marks attendance and answers about serving.",
      enough:
        "If your team works in English comfortably, you have a card for it and the system suits you — stay. Nobody needs a migration for its own sake.",
    },
    {
      id: "crm",
      short: "General CRM",
      name: "A general-purpose CRM, Notion, boards and home-made databases",
      reality:
        "Someone on the team built a people database in Notion, requests on a board and reminders in a planner. It looks tidy and costs almost nothing.",
      strength: "Complete freedom: the process can be described exactly as it lives in your church.",
      breaks: [
        "Everything a church system has out of the box — families, groups, ministries, attendance, seasons — you have to design yourself.",
        "The roles of pastor, group leader and volunteer have to be invented and maintained by hand.",
        "It all rests on the person who built it. When they move to another ministry, the system becomes opaque within a month.",
        "The price is counted per user — and a church has dozens of them.",
      ],
      ours: "The church model is already described: family, group, ministry, attendance, request, season. So are the roles and permissions — there is nothing to invent. If your process differs, it gets configured, not drawn from scratch.",
      enough:
        "If you have your own developer maintaining it for years, a home-made solution will fit you more precisely than any ready-made system.",
    },
  ],

  tableEyebrow: "Side by side",
  tableTitle: "The same thing, row by row",
  tableText:
    "Only the criteria that actually bring churches back to us after a demo. The rest — module counts and the length of a feature list — you will see everywhere anyway.",
  usColumn: "MyChurch",
  rows: [
    {
      id: "language",
      criterion: "Language of the interface and support",
      cells: {
        sheets: "Yours — you write it",
        foreign: "English, sometimes German",
        crm: "Ukrainian happens; church vocabulary does not",
      },
      ours: "Ukrainian and English, support in Ukrainian",
    },
    {
      id: "model",
      criterion: "Families, groups, ministries, attendance",
      cells: {
        sheets: "You draw it yourself, differently in each file",
        foreign: "Present — shaped by their culture of ministry",
        crm: "Absent: there are contacts and deals",
      },
      ours: "Present — shaped by the Ukrainian church",
    },
    {
      id: "telegram",
      criterion: "Telegram as a place of work",
      cells: {
        sheets: "The chat lives apart from the database",
        foreign: "None",
        crm: "Notifications at best",
      },
      ours: "Attendance, requests, serving and campaigns — in the bot",
    },
    {
      id: "payment",
      criterion: "What you pay with",
      cells: {
        sheets: "Nothing",
        foreign: "A card in dollars or euros",
        crm: "A fee for every user",
      },
      ours: "Hryvnia, with no foreign-currency card",
    },
    {
      id: "price",
      criterion: "Roughly how much",
      cells: {
        sheets: "0",
        foreign: "72 dollars a month (Breeze), 34–369 euros (ChurchTools)",
        crm: "A per-user rate × dozens of people",
      },
      ours: "From 4 cups of coffee a month; onboarding is free right now",
    },
    {
      id: "migration",
      criterion: "Moving off spreadsheets",
      cells: {
        sheets: "Nowhere to move",
        foreign: "Your problem",
        crm: "Your problem",
      },
      ours: "We do it, within 14 days",
    },
    {
      id: "training",
      criterion: "Training the team",
      cells: {
        sheets: "Not needed",
        foreign: "Videos and a help centre in English",
        crm: "Taught by whoever built it",
      },
      ours: "Part of onboarding — until they can work on their own",
    },
    {
      id: "export",
      criterion: "If you decide to leave",
      cells: {
        sheets: "The file is yours anyway",
        foreign: "Export exists; the agreement is in English",
        crm: "Depends on the service",
      },
      ours: "Export to CSV and Excel any time; the database waits 60 days",
    },
    {
      id: "maturity",
      criterion: "How old the product is",
      cells: {
        sheets: "Decades of habit",
        foreign: "More than a decade on the market",
        crm: "As old as that person's spare time",
      },
      ours: "Young: over a year of daily work in the New Life church",
    },
  ],
  tableNote:
    "Prices for the foreign systems come from their own pages, linked below. The per-user rate in general-purpose CRMs depends on the service and the plan, so we name no exact figure here.",

  strongerEyebrow: "Honestly",
  strongerTitle: "Where the foreign systems beat us",
  strongerText: "A comparison without this block is not worth reading. Here is what they can do and we cannot — yet.",
  stronger: [
    {
      title: "Age and community",
      text: "They have been on the market for more than a decade. Thousands of churches have already hit every rake for them, and almost any question has an answer in the help centre. That is not written in a year.",
    },
    {
      title: "Card giving",
      text: "In Planning Center and Breeze this is a built-in payment module: a person gives inside the system. With us, giving and spending are recorded in the books, but the money does not pass through the system.",
    },
    {
      title: "Their own app for the congregation",
      text: "Planning Center has a separate app for it, Church Center. We have the system adapted for a phone browser, and a dedicated iOS and Android app is in development.",
    },
    {
      title: "Breadth of integrations",
      text: "They have dozens of ready connections to the services they are used to. Our list is shorter and grows towards what Ukrainian churches actually use.",
    },
  ],

  noTitle: "When we will tell you not to take us",
  noText: "This is not modesty: a failed rollout costs a church more than having no system at all.",
  no: [
    "A congregation of under 30 people where the spreadsheet does not hurt yet.",
    "You need to accept card giving inside the system right now.",
    "You have worked in a foreign system for years, the team speaks English comfortably and nothing is breaking.",
    "You are looking for free forever: free onboarding will one day become a paid subscription, and we will give you notice before it does.",
  ],

  sourcesTitle: "Where the figures come from",
  sourcesText:
    "Prices and languages are taken from these systems' own pages and were checked on 19 September 2026. They change — if you spot a discrepancy, write to us and we will correct it.",
  sources: [
    {
      label: "Planning Center — pricing",
      href: "https://www.planningcenter.com/pricing",
      fact: "Ten separate products, each with its own free tier and its own bill; prices in dollars.",
    },
    {
      label: "Breeze — pricing",
      href: "https://www.breezechms.com/pricing",
      fact: "72 dollars a month, with no limit on the number of people in the database.",
    },
    {
      label: "ChurchTools — pricing",
      href: "https://church.tools/preise",
      fact: "From 34 to 369 euros a month by congregation size; interface in German, English and Finnish.",
    },
  ],
};

export const COMPARE_COPY: Record<Lang, CompareCopy> = { ua, en };
