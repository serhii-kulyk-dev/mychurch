import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "prohrama-dlia-obliku-chleniv-tserkvy",
  category: "choice",
  date: "2026-09-06",
  minutes: 8,
  related: ["yak-obraty-systemu-dlia-tserkvy", "skilky-liudei-u-tserkvi", "dani-v-riznykh-mistsiakh"],
  copy: {
    ua: {
      seoTitle: "Програма для обліку членів церкви: що вона має вміти",
      seoDescription:
        "Мінімальний набір можливостей програми для обліку членів церкви: картка людини, сім'ї, групи, відвідуваність, ролі, імпорт і звіти. Без зайвого.",
      title: "Програма для обліку членів церкви: що має вміти",
      lead: "Більшість церков починає пошук зі слова «база». Насправді потрібна не база, а щоденні дії: відмітити, знайти, нагадати, передати.",
      keywords: [
        "програма для обліку членів церкви",
        "база даних церкви",
        "облік прихожан",
        "картка члена церкви",
        "програма для церковного адміністратора",
      ],
      problem: {
        title: "Купили базу, а працювати в ній нема кому",
        text: "Система є, дані завантажили, але щотижня її відкриває тільки адміністратор. Причина майже завжди одна: у ній немає щоденних дій лідера, лише сховище записів.",
      },
      sections: [
        {
          heading: "Мінімум, без якого не варто починати",
          blocks: [
            {
              kind: "list",
              items: [
                "Картка людини: контакти, статус, сім'я, група, служіння, історія відвідувань.",
                "Сім'ї: зв'язки між людьми, а не просто прізвище в дужках.",
                "Групи й служіння зі складом і лідерами.",
                "Відмітка відвідуваності з телефона.",
                "Ролі й доступи: лідер бачить своє, адміністратор — більше.",
                "Імпорт з таблиць і експорт власних даних.",
              ],
            },
            {
              kind: "text",
              text: "Це не «базовий тариф», а мінімум, за якого система взагалі має сенс. Якщо чогось із цього немає, ви отримаєте гарну таблицю з іншим інтерфейсом.",
            },
          ],
        },
        {
          heading: "Що відрізняє робочу програму від просто бази",
          blocks: [
            {
              kind: "table",
              columns: ["Ознака", "Просто база", "Робоча система"],
              rows: [
                ["Хто вносить дані", "Один адміністратор", "Лідери зі своїх телефонів"],
                ["Що дає натомість", "Зберігає записи", "Показує, хто зник і кому потрібна увага"],
                ["Як шукають людину", "Прокруткою списку", "Пошуком і фільтрами за групою, статусом, датою"],
                ["Що буває при зміні лідера", "Доступ передають разом з паролем", "Роль перепризначають, історія залишається"],
                ["Як з'являється звіт", "Складають руками", "Відкривають готовий екран"],
              ],
            },
          ],
        },
        {
          heading: "Що зазвичай потрібне вже на другий місяць",
          blocks: [
            {
              kind: "list",
              items: [
                "Заявки й форми: запис на курс, бронювання, молитовні потреби.",
                "Події з реєстрацією та списком присутніх.",
                "Графіки служінь із підтвердженнями й замінами.",
                "Автоматичні нагадування: зустріч, зміна, день народження.",
                "Зведення для пастора без ручного складання.",
              ],
            },
            {
              kind: "callout",
              title: "Не купуйте все одразу",
              text: "Вмикайте модулі по одному, коли з'являється реальна потреба. Система, у якій одразу тридцять розділів, лякає лідерів сильніше, ніж будь-яка таблиця.",
            },
          ],
        },
        {
          heading: "Чого не варто вимагати від системи обліку",
          blocks: [
            {
              kind: "list",
              items: [
                "Бухгалтерія повного циклу: це окрема задача, і часто окремий інструмент.",
                "Сайт церкви й трансляції — інша природа продукту.",
                "Заміна спілкування: система показує, з ким поговорити, але не говорить замість вас.",
                "Ідеальні дані з першого дня: чистота приходить у процесі, а не до старту.",
              ],
            },
          ],
        },
        {
          heading: "Як перевірити перед рішенням",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Відмітьте явку самі", text: "Не дивіться, як це роблять, — зробіть з телефона й порахуйте кроки." },
                { title: "Заведіть одну людину руками", text: "Стільки полів, скільки реально знаєте про нову людину: ім'я й телефон." },
                { title: "Завантажте фрагмент своєї таблиці", text: "Двадцять рядків із вашими реальними дублями й порожніми клітинками." },
                { title: "Відкрийте екран лідера", text: "Саме він визначить, користуватимуться системою чи ні." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Мінімум — картка людини, сім'ї, групи, явка, ролі, імпорт і експорт.",
        "Робоча система дає лідеру щось натомість, а не лише вимагає даних.",
        "Модулі вмикають поступово, а не всі одразу.",
        "Перевіряйте на своїх даних і на екрані лідера.",
      ],
      faq: [
        {
          q: "Чи підійде для маленької церкви на 50 людей?",
          a: "Так, але користь буде іншою: не в аналітиці, а в тому, що дані не зникають разом з людиною й передаються при зміні служителів.",
        },
        {
          q: "Скільки полів має бути в картці людини?",
          a: "Стільки, скільки ви реально заповнюєте. Двадцять обов'язкових полів гарантують, що більшість карток залишиться порожньою.",
        },
        {
          q: "Чи потрібен окремий адміністратор системи?",
          a: "Потрібна одна відповідальна людина, але не обов'язково окрема посада. Зазвичай це нинішній адміністратор церкви.",
        },
      ],
      cta: {
        title: "Картка людини й реєстр громади",
        text: "Контакти, сім'ї, групи, служіння й історія відвідувань на одному екрані.",
        label: "Модуль «Люди»",
        href: "/modules/people",
      },
    },
    en: {
      seoTitle: "Church membership software: what it must do",
      seoDescription:
        "The minimum a church membership system needs: person records, families, groups, attendance, roles, import and reports. Nothing superfluous.",
      title: "Church membership software: what it must do",
      lead: "Most churches start by looking for a database. What they actually need is daily actions: mark, find, remind, hand over.",
      keywords: [
        "church membership software",
        "church database",
        "member records church",
        "church administration software",
        "people management for churches",
      ],
      problem: {
        title: "A database nobody works in",
        text: "The system exists, the data is loaded, and only the administrator opens it weekly. The reason is almost always the same: it holds records but contains no daily action for a leader.",
      },
      sections: [
        {
          heading: "The minimum worth starting with",
          blocks: [
            {
              kind: "list",
              items: [
                "A person record: contacts, status, family, group, ministry, attendance history.",
                "Families as real links between people.",
                "Groups and ministries with members and leaders.",
                "Attendance marking from a phone.",
                "Roles and access: leaders see their own, administrators see more.",
                "Import from spreadsheets and export of your own data.",
              ],
            },
            {
              kind: "text",
              text: "This is not a starter tier; it is the point at which a system makes sense at all. Without it you get a pretty spreadsheet with a different interface.",
            },
          ],
        },
        {
          heading: "What separates a working system from a database",
          blocks: [
            {
              kind: "table",
              columns: ["Aspect", "Just a database", "A working system"],
              rows: [
                ["Who enters data", "One administrator", "Leaders from their phones"],
                ["What it gives back", "Stores records", "Shows who disappeared and who needs attention"],
                ["Finding a person", "Scrolling a list", "Search and filters by group, status, date"],
                ["When a leader changes", "The password is handed over", "The role is reassigned, history stays"],
                ["How a report appears", "Assembled by hand", "Opened as a ready screen"],
              ],
            },
          ],
        },
        {
          heading: "What you will want by month two",
          blocks: [
            {
              kind: "list",
              items: [
                "Requests and forms: course sign-ups, bookings, prayer needs.",
                "Events with registration and an attendance list.",
                "Rotas with confirmations and swaps.",
                "Automatic reminders: meetings, shifts, birthdays.",
                "A pastor's summary that builds itself.",
              ],
            },
            {
              kind: "callout",
              title: "Do not buy everything at once",
              text: "Switch modules on as real needs appear. Thirty sections on day one frighten leaders more than any spreadsheet.",
            },
          ],
        },
        {
          heading: "What not to demand from it",
          blocks: [
            {
              kind: "list",
              items: [
                "Full accounting: a separate job, often a separate tool.",
                "A church website and streaming: a different kind of product.",
                "A replacement for conversation: it shows who to talk to, it does not talk for you.",
                "Perfect data from day one: cleanliness comes during use.",
              ],
            },
          ],
        },
        {
          heading: "How to test before deciding",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Mark attendance yourself", text: "Do it on a phone and count the steps." },
                { title: "Add one person by hand", text: "With as much as you really know about a newcomer: a name and a phone." },
                { title: "Load a slice of your spreadsheet", text: "Twenty rows with your real duplicates and gaps." },
                { title: "Open the leader screen", text: "That screen decides whether the system gets used." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "The minimum: person records, families, groups, attendance, roles, import and export.",
        "A working system gives leaders something back.",
        "Enable modules gradually.",
        "Test on your own data and on the leader's screen.",
      ],
      faq: [
        {
          q: "Is it worth it for a church of 50?",
          a: "Yes, though the benefit differs: not analytics, but data that does not leave with a person and transfers when volunteers change.",
        },
        {
          q: "How many fields should a person record have?",
          a: "As many as you genuinely fill in. Twenty required fields guarantee mostly empty records.",
        },
        {
          q: "Do we need a dedicated system administrator?",
          a: "You need one responsible person, not necessarily a new role. Usually the existing church administrator.",
        },
      ],
      cta: {
        title: "Person records and the church register",
        text: "Contacts, families, groups, ministries and attendance history on one screen.",
        label: "People module",
        href: "/modules/people",
      },
    },
  },
};
