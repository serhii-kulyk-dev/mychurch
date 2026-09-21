import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "yak-obraty-systemu-dlia-tserkvy",
  category: "choice",
  date: "2026-09-16",
  minutes: 9,
  related: ["vasha-tserkva-unikalna", "piat-pytan-pro-systemu", "dani-v-riznykh-mistsiakh"],
  copy: {
    ua: {
      seoTitle: "Як обрати систему для церкви: 12 запитань перед вибором",
      seoDescription:
        "Критерії вибору програми для церкви: мова, гнучкість, ролі, імпорт, мобільність, ціна й підтримка. Що перевірити на демо й де зазвичай ховаються проблеми.",
      title: "Як обрати систему управління церквою",
      lead: "Систему обирають раз на кілька років, а живуть з нею щодня. Тому важливіші не списки можливостей, а відповіді на дванадцять незручних запитань.",
      keywords: [
        "система управління церквою",
        "як обрати програму для церкви",
        "церковна CRM",
        "порівняння систем для церкви",
        "впровадження програми в церкві",
      ],
      problem: {
        title: "Обрали за списком можливостей — і не користуються",
        text: "Система вміє все: від обліку до розсилок. Через три місяці в ній працює один адміністратор, лідери повернулись у чат, а дані знову в таблиці. Можливості були, а щоденного використання — ні.",
      },
      sections: [
        {
          heading: "Почніть не з системи, а зі своїх процесів",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Випишіть п'ять щотижневих дій", text: "Те, що повторюється кожного тижня: відмітка явки, графік служіння, робота з гостями, заявки, зведення для пастора." },
                { title: "Позначте, хто їх робить", text: "Лідер групи, керівник служіння, адміністратор, пастор. Це і є ваші майбутні ролі в системі." },
                { title: "Порахуйте, скільки часу вони займають зараз", text: "Це ваша точка відліку — без неї ви не зрозумієте, чи стало краще." },
                { title: "І тільки тоді дивіться системи", text: "Перевіряйте не наявність функцій, а те, як у них виконуються саме ці п'ять дій." },
              ],
            },
          ],
        },
        {
          heading: "Дванадцять запитань, які варто поставити",
          blocks: [
            {
              kind: "list",
              title: "Про щоденну роботу",
              items: [
                "Скільки дотиків потрібно лідеру, щоб відмітити явку?",
                "Чи можна працювати з телефона без встановлення окремого застосунку?",
                "Чи бачить лідер лише свою групу?",
                "Що бачить пастор і чи готується цей екран автоматично?",
              ],
            },
            {
              kind: "list",
              title: "Про дані й гнучкість",
              items: [
                "Чи можна перейменувати сутності під наш словник?",
                "Чи можна додати власні поля й етапи?",
                "Як імпортуються наші таблиці й чи можна скасувати імпорт?",
                "Чи можемо ми вивантажити свої дані, якщо підемо?",
              ],
            },
            {
              kind: "list",
              title: "Про роботу з нами",
              items: [
                "Чи є інтерфейс і підтримка українською?",
                "Хто допомагає на старті й скільки це коштує?",
                "Як швидко відповідає підтримка й у якому каналі?",
                "Що входить у ціну, а що рахується окремо?",
              ],
            },
          ],
        },
        {
          heading: "Що перевірити саме на демо",
          blocks: [
            {
              kind: "table",
              columns: ["Перевірка", "Як робити", "На що дивитись"],
              rows: [
                ["Ваші дані", "Попросіть завантажити фрагмент вашої таблиці", "Скільки часу і скільки ручної роботи"],
                ["Роль лідера", "Попросіть показати екран лідера, а не адміністратора", "Чи не бачить він зайвого"],
                ["Щотижнева дія", "Відмітьте явку самі, а не дивіться, як це роблять", "Кількість кроків"],
                ["Зміна назви", "Попросіть перейменувати «малу групу» при вас", "Чи це налаштування, чи розробка"],
              ],
            },
            {
              kind: "callout",
              title: "Демо на ваших даних варте десяти презентацій",
              text: "Презентація показує найкращий сценарій. Ваша таблиця з дублями й порожніми полями показує реальність.",
            },
          ],
        },
        {
          heading: "Червоні прапорці",
          blocks: [
            {
              kind: "list",
              items: [
                "«Ми налаштуємо все під вас за окрему плату» — і кожна дрібниця потім стає окремою платою.",
                "Немає ролей: усі бачать усе.",
                "Немає експорту даних.",
                "Впровадження триває пів року до першого реального використання.",
                "Підтримка лише поштою й лише іноземною мовою.",
              ],
            },
          ],
        },
        {
          heading: "Скільки це має коштувати за часом",
          blocks: [
            {
              kind: "list",
              items: [
                "Перший запуск: тиждень-два до першої реальної відмітки явки.",
                "Перенос даних: дні, не місяці.",
                "Навчання лідера: 15 хвилин на щотижневі дії.",
                "Повне впровадження всіх модулів: місяць. Модулі вмикаються один за одним, а не всі разом.",
              ],
            },
            {
              kind: "solution",
              title: "Розклад перших двох тижнів",
              text:
                "Так виглядає розклад, який ще тримає ентузіазм команди: реальна відмітка явки на другому тижні, а не «повне впровадження» через квартал. Якщо система не вміщається в цей розклад — питання не до вас.",
              spec: {
                kind: "timeline",
                title: "Від демо до першої відмітки",
                subtitle: "Дні від першої розмови",
                items: [
                  { time: "1-й", title: "Демо на своїх даних", who: "Пастор і адміністратор", done: true },
                  { time: "3-й", title: "Перенесли список людей", who: "Адміністратор", done: true },
                  { time: "5-й", title: "Лідери отримали доступ", who: "12 лідерів", done: true },
                  { time: "9-й", title: "Перша відмітка явки в групі", who: "Одна мала група" },
                  { time: "14-й", title: "Тиждень без паралельної таблиці" },
                ],
              },
              link: { label: "Як ми впроваджуємо", href: "/consulting" },
            },
            {
              kind: "text",
              text: "Якщо до першого реального використання минає більше місяця, впровадження зупиниться. Не тому що система погана, а тому що ентузіазм команди має свій термін.",
            },
          ],
        },
      ],
      takeaways: [
        "Спершу опишіть свої п'ять щотижневих дій, потім дивіться системи.",
        "На демо перевіряйте свої дані й екран лідера, а не презентацію.",
        "Відсутність ролей і експорту — привід не продовжувати розмову.",
        "Перше реальне використання має настати за тиждень-два.",
      ],
      faq: [
        {
          q: "Скільки систем варто порівняти?",
          a: "Дві-три. Більше — і порівняння перетворюється на дослідження, яке ніколи не закінчується рішенням.",
        },
        {
          q: "Чи важлива українська мова інтерфейсу?",
          a: "Так, якщо ви хочете, щоб системою користувались лідери, а не лише адміністратор. Кожне незрозуміле слово — це мінус кілька людей.",
        },
        {
          q: "Що робити, якщо частина команди проти змін?",
          a: "Почніть з тих, кому система дає негайну користь, — зазвичай це лідери груп. Успіх однієї команди переконує краще за будь-яку презентацію.",
        },
      ],
      cta: {
        title: "Подивіться, як це влаштовано",
        text: "Модулі, ролі й налаштування — і демо на ваших даних, а не на вигаданих.",
        label: "Замовити демо",
        href: "/modules",
      },
    },
    en: {
      seoTitle: "Choosing church management software: 12 questions",
      seoDescription:
        "Criteria for choosing church software: language, flexibility, roles, import, mobile use, price and support. What to test in a demo and where problems hide.",
      title: "How to choose a church management system",
      lead: "You choose a system once every few years and live with it daily. Feature lists matter less than the answers to twelve awkward questions.",
      keywords: [
        "church management software",
        "choosing church software",
        "church CRM comparison",
        "ChMS selection",
        "church software implementation",
      ],
      problem: {
        title: "Chosen on features, then unused",
        text: "The system can do everything. Three months later one administrator uses it, leaders are back in the chat and the data is in a spreadsheet again. The features existed; the daily use did not.",
      },
      sections: [
        {
          heading: "Start with your processes, not the software",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "List five weekly actions", text: "Attendance, rota, guest follow-up, requests, the pastor's summary." },
                { title: "Note who does them", text: "Group leader, ministry lead, administrator, pastor. Those are your future roles." },
                { title: "Measure how long they take now", text: "That is your baseline; without it you cannot tell whether anything improved." },
                { title: "Only then look at systems", text: "Test how those five actions work, not whether a feature exists." },
              ],
            },
          ],
        },
        {
          heading: "Twelve questions to ask",
          blocks: [
            {
              kind: "list",
              title: "About daily work",
              items: [
                "How many taps does a leader need to mark attendance?",
                "Can it be used from a phone without installing a separate app?",
                "Does a leader see only their own group?",
                "What does the pastor see, and is that screen built automatically?",
              ],
            },
            {
              kind: "list",
              title: "About data and flexibility",
              items: [
                "Can entities be renamed to match our vocabulary?",
                "Can we add our own fields and stages?",
                "How are our spreadsheets imported, and can an import be undone?",
                "Can we export our data if we leave?",
              ],
            },
            {
              kind: "list",
              title: "About working with us",
              items: [
                "Is the interface and support available in our language?",
                "Who helps at launch, and what does it cost?",
                "How fast does support reply, and through which channel?",
                "What is included in the price and what is billed separately?",
              ],
            },
          ],
        },
        {
          heading: "What to test in the demo",
          blocks: [
            {
              kind: "table",
              columns: ["Test", "How", "What to watch"],
              rows: [
                ["Your data", "Ask them to load a slice of your spreadsheet", "Time and manual work involved"],
                ["The leader role", "Ask for the leader screen, not the admin one", "Whether they see too much"],
                ["A weekly action", "Mark attendance yourself", "Number of steps"],
                ["Renaming", "Ask them to rename small group live", "Configuration or development?"],
              ],
            },
            {
              kind: "callout",
              title: "A demo on your data beats ten presentations",
              text: "A presentation shows the best case. Your spreadsheet with duplicates and gaps shows reality.",
            },
          ],
        },
        {
          heading: "Red flags",
          blocks: [
            {
              kind: "list",
              items: [
                "We will configure it for you for an extra fee — and every detail becomes an extra fee.",
                "No roles: everyone sees everything.",
                "No data export.",
                "Six months of implementation before the first real use.",
                "Support by email only, in one foreign language.",
              ],
            },
          ],
        },
        {
          heading: "What it should cost in time",
          blocks: [
            {
              kind: "list",
              items: [
                "Launch: a week or two until the first real attendance mark.",
                "Data migration: days, not months.",
                "Training a leader: fifteen minutes for the weekly actions.",
                "Full rollout of every module: a month. Modules switch on one after another, not all at once.",
              ],
            },
            {
              kind: "solution",
              title: "The first two weeks",
              text:
                "This is the schedule that still holds the team's enthusiasm: a real attendance mark in week two, not a full rollout a quarter from now. If a system cannot fit this schedule, the problem is not on your side.",
              spec: {
                kind: "timeline",
                title: "From demo to the first mark",
                subtitle: "Days from the first conversation",
                items: [
                  { time: "Day 1", title: "Demo on your own data", who: "Pastor and administrator", done: true },
                  { time: "Day 3", title: "People list migrated", who: "Administrator", done: true },
                  { time: "Day 5", title: "Leaders have access", who: "12 leaders", done: true },
                  { time: "Day 9", title: "First attendance mark in a group", who: "One small group" },
                  { time: "Day 14", title: "A week with no parallel spreadsheet" },
                ],
              },
              link: { label: "How we roll out", href: "/consulting" },
            },
            {
              kind: "text",
              text: "If the first real use is more than a month away, the rollout will stall — not because the system is bad, but because team enthusiasm has a shelf life.",
            },
          ],
        },
      ],
      takeaways: [
        "Describe your five weekly actions first.",
        "In a demo, test your own data and the leader's screen.",
        "No roles and no export are reasons to stop the conversation.",
        "First real use should arrive within a week or two.",
      ],
      faq: [
        {
          q: "How many systems should we compare?",
          a: "Two or three. More turns the comparison into research that never ends in a decision.",
        },
        {
          q: "Does interface language matter?",
          a: "It does if you want leaders to use it, not only the administrator. Every unclear word costs you a few people.",
        },
        {
          q: "What if part of the team resists?",
          a: "Start with those who gain immediately, usually group leaders. One team's success convinces better than any presentation.",
        },
      ],
      cta: {
        title: "See how it is built",
        text: "Modules, roles and configuration — and a demo on your data rather than invented data.",
        label: "Explore modules",
        href: "/modules",
      },
    },
  },
};
