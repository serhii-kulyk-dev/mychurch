import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Copy for /telegram — сторінка бота.

   Кожен екран тут списаний з бекенду (my-church-backend/src/telegram):
   підписи кнопок, тексти відмов і легенда статусів — дослівні, щоб
   сторінка показувала бот, а не його переказ. Якщо бот міняє підпис —
   міняємо і тут.
     • меню за ролями ......... utils/main-menu.util.ts
     • відмови розділів ....... services/telegram-bot-access.ts
     • картка групи ........... telegram-bot.update.ts → handleGroupDetail
     • явка ................... handlers/attendance.handler.ts
     • заявка за посиланням ... handlers/form-apply.handler.ts
     • рішення по заявці ...... handlers/submissions.handler.ts
     • служіння й графік ...... utils/serving-text.util.ts
     • асистент у чаті ........ services/telegram-chat-watcher.service.ts
   ──────────────────────────────────────────────────────────────── */

/** Рядок повідомлення в макеті чату. */
export interface TgLine {
  /** "b" — жирний, "d" — приглушений, "n" — звичайний. */
  s?: "b" | "d";
  t: string;
}

export interface TgButton {
  t: string;
  /** Синя кнопка — головна дія екрана. */
  primary?: boolean;
  tone?: "green" | "red";
}

export interface TelegramRole {
  id: string;
  /** Підпис вкладки. */
  tab: string;
  /** Хто це — одним рядком під вкладками. */
  who: string;
  /** Реальна reply-клавіатура цієї людини. */
  keyboard: string[][];
  /** Що відкривається за кнопкою — 3 рядки. */
  sees: string[];
  /** Розділ, якого в цієї людини немає, і дослівна відмова бота. */
  denied?: { button: string; text: string };
}

export interface TelegramCopy {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    facts: { value: string; label: string }[];
    cta: string;
    ctaSecondary: string;
    phone: {
      bot: string;
      status: string;
      greeting: TgLine[];
      keyboard: string[][];
      hint: string;
    };
  };

  menus: {
    eyebrow: string;
    title: string;
    text: string;
    keyboardLabel: string;
    seesLabel: string;
    deniedLabel: string;
    roles: TelegramRole[];
    note: string;
  };

  join: {
    eyebrow: string;
    title: string;
    text: string;
    steps: {
      id: string;
      badge: string;
      who: string;
      title: string;
      text: string;
      screen: {
        header: string;
        sub: string;
        lines: TgLine[];
        buttons: TgButton[][];
        /** Підпис під екраном — що сталося в базі. */
        result: string;
      };
    }[];
    footnote: string;
  };

  speed: {
    eyebrow: string;
    title: string;
    text: string;
    timeline: { at: string; title: string; text: string; tag: string }[];
    rules: { value: string; label: string; text: string }[];
  };

  groups: {
    eyebrow: string;
    title: string;
    text: string;
    leaderLabel: string;
    memberLabel: string;
    leader: { lines: TgLine[]; buttons: TgButton[][] };
    member: { lines: TgLine[]; buttons: TgButton[][] };
    attendance: {
      title: string;
      head: TgLine[];
      legend: { icon: string; label: string }[];
      people: { name: string; icon: string }[];
      actions: TgButton[];
      note: string;
    };
  };

  serving: {
    eyebrow: string;
    title: string;
    text: string;
    slotLabel: string;
    rotaLabel: string;
    digestLabel: string;
    slot: { lines: TgLine[]; buttons: TgButton[][]; reasons: string[]; tasks: { t: string; done: boolean }[]; tasksTitle: string };
    rota: { when: string; what: string; role: string; state: "yes" | "no" | "ask" }[];
    rotaStates: { yes: string; no: string; ask: string };
    digest: { lines: TgLine[]; note: string };
  };

  outro: {
    title: string;
    text: string;
    points: string[];
  };
}

const ua: TelegramCopy = {
  navLabel: "Бот",
  seoTitle: "Telegram-бот церкви — Моя Церква",
  seoDescription:
    "Бот церкви в Telegram: малі групи й служіння, відмітка явки за хвилину, заявка в групу з одного посилання, графік служіння з «Буду / Не зможу» і меню, яке в кожного своє.",

  hero: {
    eyebrow: "Телеграм-бот",
    title: "Важливе — під рукою",
    lead:
      "Лідер відмічає зустріч із телефону за хвилину, служитель тисне «Буду» під повідомленням, гість подає заявку в групу з одного посилання. Бот не окрема програма — це та сама база, просто в месенджері.",
    facts: [
      { value: "1 дотик", label: "від заявки до рішення лідера" },
      { value: "45 розділів", label: "групи, служіння, події, форми, явка" },
      { value: "своє меню", label: "в учасника, лідера й адміністратора" },
    ],
    cta: "Замовити демо",
    ctaSecondary: "Подивитись модулі",
    phone: {
      bot: "Бот церкви «Нове Життя»",
      status: "бот · онлайн",
      greeting: [
        { s: "b", t: "Вітаю, Андрію 👋" },
        { t: "Ви лідер домашньої групи і в команді служіння «Звук»." },
        { s: "d", t: "Меню внизу. Можна просто написати, що потрібно." },
      ],
      keyboard: [
        ["📌 Мої справи · 3", "🏠 Мої групи (2)"],
        ["🔥 Мої служіння (1)"],
      ],
      hint: "Клавіатура збирається під людину: у неї стільки кнопок, скільки їй справді потрібно.",
    },
  },

  menus: {
    eyebrow: "Меню за ролями",
    title: "Одне й те саме меню виглядає по-різному",
    text:
      "Бот не показує «все, а зайве сховаємо». Клавіатура збирається з того, ким людина є в церкві: у групах, у служіннях, з правами чи без. Перемкніть роль — і побачите рівно той екран, який відкриється їй.",
    keyboardLabel: "Меню бота",
    seesLabel: "Що за цим відкривається",
    deniedLabel: "А якщо натиснути чуже",
    roles: [
      {
        id: "member",
        tab: "Учасник групи",
        who: "Ходить у групу, ні за що не відповідає",
        keyboard: [["🏠 Мої групи (1)"], ["🔥 Мої служіння (2)"]],
        sees: [
          "Найближча зустріч, час і місце — з розкладу групи",
          "«📊 Моя відвідуваність» — лише своя, чужої не існує",
          "«💬 Відгук» про зустріч — можна анонімно",
        ],
        denied: {
          button: "👥 Люди",
          text:
            "🔒 Цей розділ показує дані всієї церкви — він для адміністраторів і служителів із відповідною роллю.\n\nВаші групи й служіння — у /menu.",
        },
      },
      {
        id: "leader",
        tab: "Лідер групи",
        who: "Веде групу, відповідає за людей у ній",
        keyboard: [["📌 Мої справи · 3", "🏠 Мої групи (2)"], ["🔥 Мої служіння (1)"]],
        sees: [
          "«📌 Мої справи» — усе, що чекає рішення, по всіх його групах одним екраном",
          "Картка групи: відмітити явку, учасники, зустрічі, заявки, дні народження",
          "«⋯ Більше» — теми, аналітика, відгуки, онбординг, автоматизації",
        ],
        denied: {
          button: "📋 Форми",
          text:
            "🔒 Форми церкви бачать адміністратори й відповідальні за форми.\n\nЗаявки у ваші групи й служіння — в «📥 Очікують рішення».",
        },
      },
      {
        id: "serving",
        tab: "Служитель",
        who: "У команді служіння, інколи — в опіці",
        keyboard: [["🏠 Мої групи (1)"], ["🔥 Мої служіння (2)"], ["🛡 Капеланство"]],
        sees: [
          "«🙌 Мій графік» — коли служить найближчим часом і де ще чекають відповіді",
          "«✅ Буду / ❌ Не зможу» прямо під повідомленням, причина — кнопкою",
          "«📋 Що зробити» — задачі саме на цю зміну, з відмітками",
        ],
        denied: {
          button: "📊 Аналітика",
          text:
            "🔒 Цей розділ показує дані всієї церкви — він для адміністраторів і служителів із відповідною роллю.\n\nВаші групи й служіння — у /menu.",
        },
      },
      {
        id: "admin",
        tab: "Адміністратор",
        who: "Бачить церкву цілком",
        keyboard: [
          ["⚡ Часті запити", "🏠 Групи"],
          ["🔥 Служіння", "📅 Події"],
          ["📋 Форми", "⋯ Ще"],
          ["👤 Мій режим"],
        ],
        sees: [
          "Люди, сім'ї, аналітика, форми — пошук звичайною мовою",
          "«⋯ Ще» ховає рідше потрібне: курси, інвентаризація, QR-код",
          "«👤 Мій режим» — те саме меню, що в учасника, коли адмін ще й лідер",
        ],
      },
    ],
    note:
      "Сховати кнопку — не захист. Старе повідомлення з кнопкою живе вічно, тому бот перевіряє право ще раз на кожному натисканні — і на тексті, якщо назву розділу набрали руками.",
  },

  join: {
    eyebrow: "Прийняти в групу",
    title: "Від посилання до людини в групі — три дотики",
    text:
      "Раніше це був ланцюжок: людина написала лідеру, лідер переслав адміну, адмін вписав у таблицю. Тепер заявка приходить у бот і закривається з того самого повідомлення, в якому прийшла.",
    steps: [
      {
        id: "apply",
        badge: "1",
        who: "Марія, гостя",
        title: "Відкрила посилання групи",
        text:
          "Посилання або QR з оголошення веде прямо в бот. Картка групи, кнопка «🙋 Подати заявку» — і бот заповнює форму за неї: що знає з картки, підставляє сам, решту питає по одному, кнопками. Номер людина надсилає своєю кнопкою — так бот певен, хто саме подає заявку.",
        screen: {
          header: "Домашня група",
          sub: "четвер, 19:00 · вул. Героїв, 12",
          lines: [
            { s: "b", t: "🏠 Домашня група" },
            { t: "Молодіжна група, 12 учасників" },
            { t: "📆 Зустрічі: щочетверга о 19:00" },
            { s: "d", t: "Лідер: Андрій Мельник" },
          ],
          buttons: [[{ t: "🙋 Подати заявку", primary: true }], [{ t: "📱 Надіслати свій номер" }]],
          result: "Заявка — звичайна відповідь на форму групи: вона одразу в канбані церкви.",
        },
      },
      {
        id: "decide",
        badge: "2",
        who: "Андрій, лідер",
        title: "Рішення з того ж повідомлення",
        text:
          "Заявка падає лідеру в «📌 Мої справи» і на картку групи як «📥 Заявки · ⏳ 2». Відкрив — бачить відповіді, тисне «✅ Прийняти». Бот перепитує один раз, прямо під повідомленням, і не створює нового екрана.",
        screen: {
          header: "📥 Заявка в групу",
          sub: "Очікують рішення (2)",
          lines: [
            { s: "b", t: "Марія Ткачук" },
            { t: "📞 +380 67 •• •• 214" },
            { t: "Чому хоче в групу: «Переїхала на Виноградар, шукаю своїх»" },
            { s: "d", t: "Подано 12 хв тому · форма «Заявка в малу групу»" },
            { s: "d", t: "❓ Прийняти заявку? — бот перепитає один раз" },
          ],
          buttons: [
            [
              { t: "✅ Прийняти", tone: "green" },
              { t: "❌ Відхилити", tone: "red" },
            ],
          ],
          result: "Те саме рішення, що й на канбані: одна дія, один слід в історії.",
        },
      },
      {
        id: "done",
        badge: "3",
        who: "Обоє",
        title: "Людина в групі, автоматизації пішли",
        text:
          "Марія з'являється в «👥 Учасники (13)», картка заявки їде в колонку «Успішно», вітальне повідомлення йде автоматично. Лідеру нічого не треба переносити руками — і нічого не загубиться в переписці.",
        screen: {
          header: "Домашня група",
          sub: "13 учасників · наступна зустріч у четвер",
          lines: [
            { s: "b", t: "✅ Марію Ткачук додано в групу" },
            { t: "Надіслано вітання й адресу зустрічі" },
            { t: "🗓 Наступна: четвер, 19:00" },
            { s: "d", t: "Заявка → «Успішно» · запущено 2 автоматизації" },
          ],
          buttons: [[{ t: "👥 Учасники (13)", primary: true }, { t: "📥 Заявки · ⏳ 1" }]],
          result: "Той самий запис бачать канбан, аналітика групи й картка людини.",
        },
      },
    ],
    footnote:
      "Хто ще не підключений до бота, спершу надсилає свій номер кнопкою — інакше «Прийняти» не знало б, кого саме додавати.",
  },

  speed: {
    eyebrow: "Швидкість реакції",
    title: "Між «щось сталось» і «хтось зреагував» — хвилини",
    text:
      "Бот не чекає, доки лідер зайде в систему. Він сам приносить справу туди, де людина вже є, — і приймає рішення одним дотиком, без переходів між екранами.",
    timeline: [
      {
        at: "19:04",
        title: "У чаті групи: «мене сьогодні не буде»",
        text: "Асистент чує це в чаті й тихо кладе чернетку явки. Нікому не пише, нічого не зберігає без лідера.",
        tag: "чат групи",
      },
      {
        at: "19:05",
        title: "Третя відмова на цю зустріч",
        text: "Лідер отримує попередження в особисті: людей менше, ніж планувалось. Далі — його рішення.",
        tag: "лідеру",
      },
      {
        at: "19:20",
        title: "Питання без відповіді 15 хвилин",
        text: "Лідер мовчить — асистент відповідає сам: розклад групи, місце, хто вже буде. Живу людину він чекає першою.",
        tag: "асистент",
      },
      {
        at: "20:58",
        title: "Зустріч закінчилась — явка не відмічена",
        text: "Кнопка «✅ Відмітити відвідуваність · 12 жовт.» з'являється просто на картці групи й у «Моїх справах».",
        tag: "нагадування",
      },
      {
        at: "21:03",
        title: "Відмітка за хвилину",
        text: "«🗳 Підставити з відповідей (4)» бере тих, хто вже сказав сам, — лідеру лишається доклацати решту.",
        tag: "готово",
      },
    ],
    rules: [
      { value: "15 хв", label: "чекаємо живу людину", text: "Стільки асистент мовчить, перш ніж відповісти замість лідера." },
      { value: "3", label: "«не зможу» поспіль", text: "Стільки відмов на одну зустріч — і лідер уже знає про це." },
      { value: "за 3 дні", label: "до служіння", text: "Лідер бачить, що не закрито: дірки, мовчуни, відмови без заміни." },
    ],
  },

  groups: {
    eyebrow: "Малі групи",
    title: "Одна картка групи — два різні екрани",
    text:
      "Лідер і учасник відкривають ту саму групу й бачать різне. Не тому, що щось приховано «про всяк випадок», а тому, що щабель у групі бот бере з простору групи та перевіряє на кожній кнопці.",
    leaderLabel: "Лідер групи",
    memberLabel: "Учасник тієї ж групи",
    leader: {
      lines: [
        { s: "b", t: "🏠 Домашня група" },
        { s: "d", t: "Ви лідер групи" },
        { t: "📆 Наступна: четвер о 19:00" },
        { t: "🗓 Проведено 7 з 14" },
        { t: "📈 Середня відвідуваність: 78%" },
        { t: "🙋 Не прийдуть: Олег, Ірина" },
      ],
      buttons: [
        [{ t: "✅ Відмітити відвідуваність · 12 жовт.", primary: true }],
        [{ t: "➡️ Наступна зустріч" }],
        [{ t: "👥 Учасники (13)" }, { t: "📅 Зустрічі (7/14)" }],
        [{ t: "📥 Заявки · ⏳ 1" }, { t: "📨 Запросити" }],
        [{ t: "🎂 Дні народження" }, { t: "⋯ Більше · ⚠️ 2" }],
      ],
    },
    member: {
      lines: [
        { s: "b", t: "🏠 Домашня група" },
        { s: "d", t: "Ви учасник групи" },
        { t: "📆 Найближча: четвер о 19:00" },
        { t: "📍 вул. Героїв, 12" },
        { t: "👑 Лідер: Андрій Мельник" },
      ],
      buttons: [
        [{ t: "➡️ Найближча зустріч", primary: true }],
        [{ t: "👥 Учасники" }],
        [{ t: "📊 Моя відвідуваність" }, { t: "💬 Відгук" }],
      ],
    },
    attendance: {
      title: "Відмітка явки",
      head: [
        { s: "b", t: "📋 Відвідуваність — 12 жовтня" },
        { t: "Присутніх: 9/13" },
        { s: "d", t: "Відповіли самі: 4 з опитування й чату" },
      ],
      legend: [
        { icon: "✅", label: "Був" },
        { icon: "⏰", label: "Запізнився" },
        { icon: "❌", label: "Не був" },
        { icon: "📗", label: "Поважна причина" },
        { icon: "❓", label: "Не відмічено" },
      ],
      people: [
        { name: "Ірина Гнатюк", icon: "✅" },
        { name: "Олег Сердюк", icon: "❌" },
        { name: "Марія Ткачук", icon: "✅" },
        { name: "Павло Кравець", icon: "⏰" },
        { name: "Ніна Лисенко", icon: "📗" },
        { name: "Тарас Бойко", icon: "❓" },
      ],
      actions: [
        { t: "🗳 Підставити з відповідей (4)", primary: true },
        { t: "✅ Були всі" },
        { t: "◀️ Готово" },
      ],
      note:
        "Натискання на ім'я перемикає статус по колу — рівно ті статуси, які церква собі ввімкнула. Жодного списку в чаті й жодної таблиці після зустрічі.",
    },
  },

  serving: {
    eyebrow: "Служіння і графік",
    title: "Графік, який відповідає сам собі",
    text:
      "Замість «хто в неділю на звуці?» в чаті — повідомлення кожному, хто в зміні, і графік, що сам збирає відповіді. Лідер бачить не список імен, а те, що ще не закрито.",
    slotLabel: "Служителю — питання",
    rotaLabel: "Йому ж — «🙌 Мій графік»",
    digestLabel: "Лідеру — за три дні",
    slot: {
      lines: [
        { s: "b", t: "🙌 Служіння: неділя, 12 жовт." },
        { t: "Недільне служіння · 10:00" },
        { t: "Ваша роль: Звукорежисер" },
        { t: "📍 Велика зала" },
        { s: "d", t: "Будете?" },
      ],
      buttons: [
        [
          { t: "✅ Буду", tone: "green" },
          { t: "❌ Не зможу", tone: "red" },
        ],
        [{ t: "📋 Що зробити" }],
      ],
      reasons: ["🤒 Хвороба", "💼 Робота", "✈️ Відʼїзд", "👨‍👩‍👧 Сімейні обставини"],
      tasksTitle: "📋 Що зробити",
      tasks: [
        { t: "Прийти за 40 хвилин до початку", done: true },
        { t: "Перевірити мікрофони на сцені", done: true },
        { t: "Записати проповідь", done: false },
      ],
    },
    rota: [
      { when: "Нд, 12 жовт.", what: "Недільне служіння", role: "Звук", state: "yes" },
      { when: "Ср, 15 жовт.", what: "Молитовне", role: "Звук", state: "ask" },
      { when: "Нд, 19 жовт.", what: "Недільне служіння", role: "Звук", state: "no" },
      { when: "Нд, 26 жовт.", what: "Хрещення", role: "Відео", state: "ask" },
    ],
    rotaStates: { yes: "Ви будете", no: "Не зможете", ask: "Чекає відповіді" },
    digest: {
      lines: [
        { s: "b", t: "⚠️ Неділя, 12 жовт. — Недільне служіння" },
        { t: "Медіа-служіння · закрито 7 із 9" },
        { t: "🔴 Без людини: Камера 2" },
        { t: "🕘 Мовчать: Іван П., Оксана Д." },
        { t: "❌ Не зможуть: Петро К." },
      ],
      note:
        "Якщо все закрито — звіту немає взагалі. Лідер отримує повідомлення лише тоді, коли є що робити.",
    },
  },

  outro: {
    title: "Бот — не щось окреме",
    text:
      "Це та сама база, ті самі права й та сама історія, що й у застосунку. Відмітка з телефону лягає в аналітику групи, рішення по заявці — в канбан, відповідь про служіння — у графік.",
    points: [
      "Бот з назвою й логотипом вашої церкви",
      "Кожне натискання перевіряє права заново",
      "Кампуси можуть мати свій бот або спільний",
    ],
  },
};

const en: TelegramCopy = {
  navLabel: "Bot",
  seoTitle: "Church Telegram bot — MyChurch",
  seoDescription:
    "Your church bot in Telegram: small groups and serving teams, attendance in a minute, a group application from a single link, a serving rota with «I'm in / Can't», and a menu that differs for every person.",

  hero: {
    eyebrow: "Telegram bot",
    title: "What matters — at hand",
    lead:
      "A leader marks attendance from their phone in a minute, a volunteer taps «I'm in» under the message, a guest applies to a group from one link. The bot is not a separate app — it is the same database, in a messenger.",
    facts: [
      { value: "1 tap", label: "from application to the leader's decision" },
      { value: "45 sections", label: "groups, serving, events, forms, attendance" },
      { value: "own menu", label: "for a member, a leader and an admin" },
    ],
    cta: "Book a demo",
    ctaSecondary: "See the modules",
    phone: {
      bot: "New Life Church bot",
      status: "bot · online",
      greeting: [
        { s: "b", t: "Hi Andrii 👋" },
        { t: "You lead the Obolon group and serve on the Sound team." },
        { s: "d", t: "The menu is below. Or just write what you need." },
      ],
      keyboard: [
        ["📌 My tasks · 3", "🏠 My groups (2)"],
        ["🔥 My serving (1)"],
      ],
      hint: "The keyboard is built per person: exactly as many buttons as they actually need.",
    },
  },

  menus: {
    eyebrow: "Menus by role",
    title: "The same menu looks different to everyone",
    text:
      "The bot does not show everything and hide the extras. The keyboard is built from who a person is in the church: in groups, on teams, with permissions or without. Switch the role and you see exactly the screen that opens for them.",
    keyboardLabel: "Bot menu",
    seesLabel: "What opens behind it",
    deniedLabel: "And if they tap someone else's",
    roles: [
      {
        id: "member",
        tab: "Group member",
        who: "Attends a group, owns nothing",
        keyboard: [["🏠 My groups (1)"], ["🔥 My serving (2)"]],
        sees: [
          "The next meeting, time and place — from the group schedule",
          "«My attendance» — their own only, nobody else's exists",
          "«Feedback» about a meeting — anonymously if they wish",
        ],
        denied: {
          button: "👥 People",
          text:
            "🔒 This section shows church-wide data — it is for admins and ministers with the matching role.\n\nYour groups and serving are in /menu.",
        },
      },
      {
        id: "leader",
        tab: "Group leader",
        who: "Leads a group, owns the people in it",
        keyboard: [["📌 My tasks · 3", "🏠 My groups (2)"], ["🔥 My serving (1)"]],
        sees: [
          "«My tasks» — everything waiting for a decision across all their groups, on one screen",
          "The group card: mark attendance, members, meetings, applications, birthdays",
          "«More» — topics, analytics, feedback, onboarding, automations",
        ],
        denied: {
          button: "📋 Forms",
          text:
            "🔒 Church forms are for admins and the people responsible for forms.\n\nApplications into your groups and teams are in «Awaiting decision».",
        },
      },
      {
        id: "serving",
        tab: "Volunteer",
        who: "On a serving team, sometimes in care",
        keyboard: [["🏠 My groups (1)"], ["🔥 My serving (2)"], ["🛡 Chaplaincy"]],
        sees: [
          "«My rota» — when they serve next and where an answer is still expected",
          "«I'm in / Can't» right under the message, the reason as a button",
          "«What to do» — the tasks for this shift, with checkmarks",
        ],
        denied: {
          button: "📊 Analytics",
          text:
            "🔒 This section shows church-wide data — it is for admins and ministers with the matching role.\n\nYour groups and serving are in /menu.",
        },
      },
      {
        id: "admin",
        tab: "Administrator",
        who: "Sees the whole church",
        keyboard: [
          ["⚡ Frequent", "🏠 Groups"],
          ["🔥 Serving", "📅 Events"],
          ["📋 Forms", "⋯ More"],
          ["👤 My mode"],
        ],
        sees: [
          "People, families, analytics, forms — search in plain language",
          "«More» keeps the rarer things: courses, inventory, QR code",
          "«My mode» — the member's menu, for an admin who also leads a group",
        ],
      },
    ],
    note:
      "Hiding a button is not protection. An old message with a button lives forever, so the bot checks the right again on every tap — and on typed text, if the section name was entered by hand.",
  },

  join: {
    eyebrow: "Joining a group",
    title: "From a link to a person in the group — three taps",
    text:
      "It used to be a chain: the person wrote to the leader, the leader forwarded it to an admin, the admin typed it into a spreadsheet. Now the application arrives in the bot and is closed from the very message it arrived in.",
    steps: [
      {
        id: "apply",
        badge: "1",
        who: "Maria, a guest",
        title: "Opened the group link",
        text:
          "A link or a QR from the announcement leads straight into the bot. The group card, an «Apply» button — and the bot fills the form for her: what it knows from her profile it fills in itself, the rest it asks one question at a time, with buttons. She sends her number with her own button, so the bot knows exactly who is applying.",
        screen: {
          header: "Obolon group",
          sub: "Thursday, 19:00 · 12 Heroiv St.",
          lines: [
            { s: "b", t: "🏠 Obolon group" },
            { t: "Youth group, 12 members" },
            { t: "📆 Meets every Thursday at 19:00" },
            { s: "d", t: "Leader: Andrii Melnyk" },
          ],
          buttons: [[{ t: "🙋 Apply", primary: true }], [{ t: "📱 Send my number" }]],
          result: "The application is an ordinary form response: it is on the church kanban right away.",
        },
      },
      {
        id: "decide",
        badge: "2",
        who: "Andrii, the leader",
        title: "Decided from the same message",
        text:
          "The application lands in «My tasks» and on the group card as «Applications · 2». He opens it, reads the answers, taps «Accept». The bot asks once, right under the message, and never opens a new screen.",
        screen: {
          header: "📥 Group application",
          sub: "Awaiting decision (2)",
          lines: [
            { s: "b", t: "Maria Tkachuk" },
            { t: "📞 +380 67 •• •• 214" },
            { t: "Why she wants in: «Moved to Obolon, looking for my people»" },
            { s: "d", t: "Submitted 12 min ago · form «Small group application»" },
            { s: "d", t: "❓ Accept the application? — the bot asks once" },
          ],
          buttons: [
            [
              { t: "✅ Accept", tone: "green" },
              { t: "❌ Decline", tone: "red" },
            ],
          ],
          result: "The same decision the kanban makes: one action, one trace in the history.",
        },
      },
      {
        id: "done",
        badge: "3",
        who: "Both",
        title: "She is in, automations have started",
        text:
          "Maria appears in «Members (13)», the card moves to the «Accepted» column, the welcome message goes out on its own. Nothing to carry over by hand — and nothing lost in a chat thread.",
        screen: {
          header: "Obolon group",
          sub: "13 members · next meeting on Thursday",
          lines: [
            { s: "b", t: "✅ Maria Tkachuk added to the group" },
            { t: "Welcome message and the address sent" },
            { t: "🗓 Next: Thursday, 19:00" },
            { s: "d", t: "Application → «Accepted» · 2 automations started" },
          ],
          buttons: [[{ t: "👥 Members (13)", primary: true }, { t: "📥 Applications · 1" }]],
          result: "The kanban, the group analytics and her profile all see the same record.",
        },
      },
    ],
    footnote:
      "Someone not yet connected to the bot sends their number first — otherwise «Accept» would not know who exactly to add.",
  },

  speed: {
    eyebrow: "Speed of response",
    title: "Between «something happened» and «someone reacted» — minutes",
    text:
      "The bot does not wait for the leader to log in. It brings the task to where the person already is — and closes it in one tap, with no jumping between screens.",
    timeline: [
      {
        at: "19:04",
        title: "In the group chat: «I can't make it today»",
        text: "The assistant hears it and quietly drafts the attendance mark. It writes to nobody and saves nothing without the leader.",
        tag: "group chat",
      },
      {
        at: "19:05",
        title: "The third decline for this meeting",
        text: "The leader gets a heads-up in their DM: fewer people than planned. What to do with that is theirs.",
        tag: "to the leader",
      },
      {
        at: "19:20",
        title: "A question unanswered for 15 minutes",
        text: "The leader is silent — the assistant answers: the schedule, the place, who is already coming. A live human always gets the first go.",
        tag: "assistant",
      },
      {
        at: "20:58",
        title: "Meeting over — attendance not marked",
        text: "The «Mark attendance · 12 Oct» button appears on the group card itself and in «My tasks».",
        tag: "reminder",
      },
      {
        at: "21:03",
        title: "Marked in a minute",
        text: "«Fill from answers (4)» takes those who already said so themselves — the leader taps through the rest.",
        tag: "done",
      },
    ],
    rules: [
      { value: "15 min", label: "waiting for a human", text: "How long the assistant stays quiet before answering instead of the leader." },
      { value: "3", label: "declines in a row", text: "That many for one meeting — and the leader already knows." },
      { value: "3 days", label: "before the service", text: "The leader sees what is still open: gaps, silent people, declines without cover." },
    ],
  },

  groups: {
    eyebrow: "Small groups",
    title: "One group card, two different screens",
    text:
      "A leader and a member open the same group and see different things. Not because something is hidden just in case, but because the bot takes the tier from the group space and re-checks it on every button.",
    leaderLabel: "Group leader",
    memberLabel: "A member of the same group",
    leader: {
      lines: [
        { s: "b", t: "🏠 Obolon group" },
        { s: "d", t: "You lead this group" },
        { t: "📆 Next: Thursday at 19:00" },
        { t: "🗓 7 of 14 meetings held" },
        { t: "📈 Average attendance: 78%" },
        { t: "🙋 Not coming: Oleh, Iryna" },
      ],
      buttons: [
        [{ t: "✅ Mark attendance · 12 Oct", primary: true }],
        [{ t: "➡️ Next meeting" }],
        [{ t: "👥 Members (13)" }, { t: "📅 Meetings (7/14)" }],
        [{ t: "📥 Applications · 1" }, { t: "📨 Invite" }],
        [{ t: "🎂 Birthdays" }, { t: "⋯ More · ⚠️ 2" }],
      ],
    },
    member: {
      lines: [
        { s: "b", t: "🏠 Obolon group" },
        { s: "d", t: "You are a member" },
        { t: "📆 Next: Thursday at 19:00" },
        { t: "📍 12 Heroiv St." },
        { t: "👑 Leader: Andrii Melnyk" },
      ],
      buttons: [
        [{ t: "➡️ Next meeting", primary: true }],
        [{ t: "👥 Members" }],
        [{ t: "📊 My attendance" }, { t: "💬 Feedback" }],
      ],
    },
    attendance: {
      title: "Marking attendance",
      head: [
        { s: "b", t: "📋 Attendance — 12 October" },
        { t: "Present: 9/13" },
        { s: "d", t: "Answered themselves: 4, from the poll and the chat" },
      ],
      legend: [
        { icon: "✅", label: "Present" },
        { icon: "⏰", label: "Late" },
        { icon: "❌", label: "Absent" },
        { icon: "📗", label: "Excused" },
        { icon: "❓", label: "Not marked" },
      ],
      people: [
        { name: "Iryna Hnatiuk", icon: "✅" },
        { name: "Oleh Serdiuk", icon: "❌" },
        { name: "Maria Tkachuk", icon: "✅" },
        { name: "Pavlo Kravets", icon: "⏰" },
        { name: "Nina Lysenko", icon: "📗" },
        { name: "Taras Boiko", icon: "❓" },
      ],
      actions: [
        { t: "🗳 Fill from answers (4)", primary: true },
        { t: "✅ Everyone was here" },
        { t: "◀️ Done" },
      ],
      note:
        "Tapping a name cycles the status — exactly the statuses the church turned on. No list in the chat and no spreadsheet after the meeting.",
    },
  },

  serving: {
    eyebrow: "Serving and the rota",
    title: "A rota that answers for itself",
    text:
      "Instead of «who's on sound this Sunday?» in the chat — a message to everyone on the shift and a rota that collects the answers. The leader sees not a list of names, but what is still open.",
    slotLabel: "To the volunteer — a question",
    rotaLabel: "And their «My rota»",
    digestLabel: "To the leader — three days before",
    slot: {
      lines: [
        { s: "b", t: "🙌 Serving: Sunday, 12 Oct" },
        { t: "Sunday service · 10:00" },
        { t: "Your role: Sound engineer" },
        { t: "📍 Main hall" },
        { s: "d", t: "Will you be there?" },
      ],
      buttons: [
        [
          { t: "✅ I'm in", tone: "green" },
          { t: "❌ Can't", tone: "red" },
        ],
        [{ t: "📋 What to do" }],
      ],
      reasons: ["🤒 Illness", "💼 Work", "✈️ Away", "👨‍👩‍👧 Family"],
      tasksTitle: "📋 What to do",
      tasks: [
        { t: "Arrive 40 minutes before the start", done: true },
        { t: "Check the mics on stage", done: true },
        { t: "Record the sermon", done: false },
      ],
    },
    rota: [
      { when: "Sun, 12 Oct", what: "Sunday service", role: "Sound", state: "yes" },
      { when: "Wed, 15 Oct", what: "Prayer night", role: "Sound", state: "ask" },
      { when: "Sun, 19 Oct", what: "Sunday service", role: "Sound", state: "no" },
      { when: "Sun, 26 Oct", what: "Baptism", role: "Video", state: "ask" },
    ],
    rotaStates: { yes: "You're in", no: "You can't", ask: "Awaiting answer" },
    digest: {
      lines: [
        { s: "b", t: "⚠️ Sunday, 12 Oct — Sunday service" },
        { t: "Media team · 7 of 9 covered" },
        { t: "🔴 Nobody on: Camera 2" },
        { t: "🕘 Silent: Ivan P., Oksana D." },
        { t: "❌ Can't make it: Petro K." },
      ],
      note:
        "If everything is covered, there is no report at all. The leader hears from the bot only when there is something to do.",
    },
  },

  outro: {
    title: "The bot is not a separate product",
    text:
      "It is the same database, the same permissions and the same history as the app. A mark from a phone lands in the group analytics, a decision on an application lands on the kanban, an answer about serving lands in the rota.",
    points: [
      "A bot with your church's name and logo",
      "Every tap re-checks the permission",
      "Campuses can have their own bot or share one",
    ],
  },
};

export const TELEGRAM_COPY: Record<Lang, TelegramCopy> = { ua, en };
