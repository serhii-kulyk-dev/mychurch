import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "dani-v-riznykh-mistsiakh",
  category: "data",
  date: "2026-08-18",
  minutes: 7,
  related: ["piat-pytan-pro-systemu", "yak-obraty-systemu-dlia-tserkvy", "stavte-tsili"],
  copy: {
    ua: {
      seoTitle: "Дані церкви в п'яти місцях: чому інформація губиться",
      seoDescription:
        "Таблиці, чати, зошити й пам'ять лідерів — чому церква втрачає інформацію, навіть коли її нібито зберігають, і як звести все в один простір.",
      title: "Не втрачайте інформацію, коли вона збережена в різних місцях",
      lead: "Інформація рідко зникає повністю. Частіше вона є — але в чужому файлі, у закритому чаті й у пам'яті людини, яка сьогодні не на зв'язку.",
      keywords: [
        "дані церкви в таблицях",
        "як зберігати інформацію про членів церкви",
        "єдина база церкви",
        "облік у церкві в Excel",
        "де зберігати контакти церкви",
      ],
      problem: {
        title: "«Це у Валі в таблиці»",
        text: "Питання просте: як зв'язатися з родиною, яка минулого місяця просила про допомогу. Відповідь: у Валі. Валя у відпустці, файл у неї на комп'ютері, а копія в чаті — від березня.",
      },
      sections: [
        {
          heading: "Як виглядає типова карта даних церкви",
          blocks: [
            {
              kind: "table",
              columns: ["Де зберігається", "Що саме", "Чому це проблема"],
              rows: [
                ["Таблиця адміністратора", "Контакти, дні народження", "Одна копія, немає історії змін"],
                ["Чати лідерів", "Молитовні потреби, заміни", "Зникає під новими повідомленнями"],
                ["Зошит служіння", "Графік і присутність", "Недоступний нікому, крім власника"],
                ["Форми на сайті", "Заявки й реєстрації", "Приходять на пошту й там залишаються"],
                ["Пам'ять лідерів", "Контекст і домовленості", "Йде разом з людиною"],
              ],
            },
            {
              kind: "text",
              text: "Жодне з цих місць не є помилкою саме собою. Проблема в тому, що між ними немає зв'язку: людина з таблиці, її заявка з пошти й її присутність із зошита ніде не зустрічаються.",
            },
            {
              kind: "solution",
              title: "Одна картка людини",
              text:
                "Контакт, сім'я, група, присутність і звернення стоять в одному записі — і відкриваються тому, кому це дозволено, без прохання «скинь файл».",
              spec: {
                kind: "list",
                title: "Люди",
                subtitle: "Один список замість п'яти таблиць",
                items: [
                  { title: "Олена Гнатюк", sub: "Група «Витоки» · четвертий рік у церкві", meta: "Була минулої неділі", badge: { label: "Член церкви", tone: "brand" } },
                  { title: "Родина Ковальчуків", sub: "Четверо · звернення про допомогу", meta: "Відповідальний: Тарас", badge: { label: "В роботі", tone: "amber" } },
                  { title: "Андрій Пилипенко", sub: "Служіння звуку · неділя", meta: "Графік на місяць", badge: { label: "Служитель", tone: "violet" } },
                  { title: "Марія Дідух", sub: "Гостя, другий тиждень", meta: "Ще без групи", badge: { label: "Новенька", tone: "green" } },
                ],
                footer: "Кожна зміна лишає слід: видно, хто і коли оновив запис.",
              },
              link: { label: "Модуль «Люди»", href: "/modules/people" },
            },
          ],
        },
        {
          heading: "Три наслідки, які відчуває вся церква",
          blocks: [
            {
              kind: "list",
              items: [
                "Подвійна робота: одну й ту саму людину питають про контакти тричі за рік.",
                "Втрачені прохання: звернення живе в тому каналі, у який потрапило, і не має власника.",
                "Неможливість передати справи: новий лідер отримує доступ до інструментів, але не до знання.",
              ],
            },
            { kind: "quote", text: "Дані, які лежать у п'яти місцях, — це нуль місць у момент, коли вони потрібні." },
          ],
        },
        {
          heading: "Що зводити в першу чергу",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Люди", text: "Один реєстр людей і сімей. Це фундамент: до нього чіпляється все інше." },
                { title: "Присутність", text: "Відмітки з груп і служінь, прив'язані до людини, а не до зошита." },
                { title: "Звернення", text: "Заявки з усіх каналів в один список зі статусом і відповідальним." },
                { title: "Домовленості", text: "База знань служінь: інструкції, підрядники, рішення сезону." },
              ],
            },
            {
              kind: "visual",
              caption:
                "Джерела нікуди не діваються — вони перестають бути єдиною копією. Коли контакт, група, присутність і звернення чіпляються до однієї картки, питання «а де це?» зникає разом із відповіддю «у Валі».",
              visual: {
                type: "merge",
                title: "П'ять місць, з яких збирають одне й те саме",
                sources: ["Таблиця адміністратора", "Чати лідерів", "Зошит служіння", "Форми на сайті", "Пам'ять лідерів"],
                target: {
                  title: "Картка людини",
                  rows: [
                    { title: "Олена Гнатюк", meta: "Група «Витоки»" },
                    { title: "Родина Ковальчуків", meta: "Звернення, в роботі" },
                    { title: "Андрій Пилипенко", meta: "Служіння звуку" },
                    { title: "Марія Дідух", meta: "Гостя, другий тиждень" },
                  ],
                },
              },
            },
            {
              kind: "callout",
              title: "Не переносьте все одразу",
              text: "Спроба перенести п'ять джерел за тиждень закінчується тим, що церква працює у двох системах паралельно. Переносьте по одному й закривайте старе джерело одразу після переносу.",
            },
          ],
        },
        {
          heading: "Як не повернутись до старого за пів року",
          blocks: [
            {
              kind: "list",
              items: [
                "Одне правило: якщо чогось немає в системі, цього не існує. Без винятків для «зручніше в чаті».",
                "Закривайте старі файли, а не залишайте «про всяк випадок» — паралельна копія завжди перемагає.",
                "Дайте доступ лідерам: дані вмирають там, де їх може оновити лише одна людина.",
                "Раз на квартал перевіряйте, чи не з'явилась нова тіньова таблиця. Зазвичай з'являється — і це сигнал, що чогось у системі бракує.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Проблема не в кількості інструментів, а у відсутності зв'язку між ними.",
        "Фундамент — один реєстр людей; усе інше чіпляється до нього.",
        "Переносьте джерела по одному й одразу закривайте старе.",
        "Тіньова таблиця — сигнал, що в системі чогось бракує.",
      ],
      faq: [
        {
          q: "А якщо лідерам зручніше в чаті?",
          a: "Чат залишається для спілкування — його не треба забороняти. Але все, що має пережити тиждень, фіксується в системі: заявка, відмітка, домовленість.",
        },
        {
          q: "Що робити з архівом старих таблиць?",
          a: "Імпортувати актуальне, решту зберегти окремо як архів тільки для читання. Видаляти не варто, редагувати — теж.",
        },
        {
          q: "Скільки часу займає зведення даних?",
          a: "Найчастіше кілька тижнів: сам імпорт — це години, а домовленості про визначення та чистка списків — решта часу.",
        },
      ],
      cta: {
        title: "Зведіть дані в один простір",
        text: "Імпорт з таблиць, зіставлення полів і перевірка перед завантаженням.",
        label: "Як працює імпорт",
        href: "/import",
      },
    },
    en: {
      seoTitle: "Church data in five places: why information gets lost",
      seoDescription:
        "Spreadsheets, chats, notebooks and leaders' memory — why churches lose information even when it is stored, and how to bring it into one place.",
      title: "Do not lose information stored in five different places",
      lead: "Information rarely disappears completely. More often it exists — in someone else's file, in a closed chat, and in the memory of a person who is offline today.",
      keywords: [
        "church data in spreadsheets",
        "single church database",
        "storing church member information",
        "church records management",
        "church contact list",
      ],
      problem: {
        title: "It is in Valya's spreadsheet",
        text: "A simple question: how do we reach the family that asked for help last month? The answer: ask Valya. Valya is away, the file is on her laptop, and the copy in the chat is from March.",
      },
      sections: [
        {
          heading: "The typical map of church data",
          blocks: [
            {
              kind: "table",
              columns: ["Where", "What", "Why it hurts"],
              rows: [
                ["Administrator's spreadsheet", "Contacts, birthdays", "One copy, no change history"],
                ["Leaders' chats", "Prayer needs, swaps", "Buried under newer messages"],
                ["A ministry notebook", "Rota and attendance", "Available to nobody but the owner"],
                ["Website forms", "Requests and sign-ups", "Arrive by email and stay there"],
                ["Leaders' memory", "Context and agreements", "Leaves with the person"],
              ],
            },
            {
              kind: "text",
              text: "None of these places is wrong by itself. The problem is that nothing connects them: the person in the spreadsheet, their request in the inbox and their attendance in the notebook never meet.",
            },
            {
              kind: "solution",
              title: "One person, one record",
              text:
                "Contact, family, group, attendance and requests sit in a single record — open to whoever is allowed to see it, with no “send me the file” in between.",
              spec: {
                kind: "list",
                title: "People",
                subtitle: "One list instead of five spreadsheets",
                items: [
                  { title: "Olena Hnatiuk", sub: "Roots group · fourth year in church", meta: "In last Sunday", badge: { label: "Member", tone: "brand" } },
                  { title: "The Kovalchuk family", sub: "Four people · request for help", meta: "Owner: Taras", badge: { label: "In progress", tone: "amber" } },
                  { title: "Andrii Pylypenko", sub: "Sound ministry · Sundays", meta: "Rota for the month", badge: { label: "Serving", tone: "violet" } },
                  { title: "Mariia Didukh", sub: "Guest, second week", meta: "No group yet", badge: { label: "New", tone: "green" } },
                ],
                footer: "Every change leaves a trace: who updated the record, and when.",
              },
              link: { label: "The People module", href: "/modules/people" },
            },
          ],
        },
        {
          heading: "Three consequences the whole church feels",
          blocks: [
            {
              kind: "list",
              items: [
                "Duplicated work: the same person is asked for their contact details three times a year.",
                "Lost requests: an ask lives in whichever channel it landed in and has no owner.",
                "Handovers become impossible: a new leader inherits tools but not knowledge.",
              ],
            },
            { kind: "quote", text: "Data in five places is data in no place at the moment you need it." },
          ],
        },
        {
          heading: "What to consolidate first",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "People", text: "One register of people and families. Everything else attaches to it." },
                { title: "Attendance", text: "Marks from groups and ministries attached to a person, not a notebook." },
                { title: "Requests", text: "Every channel into one list with a status and an owner." },
                { title: "Agreements", text: "A ministry knowledge base: instructions, suppliers, decisions of the season." },
              ],
            },
            {
              kind: "visual",
              caption:
                "The sources do not disappear — they stop being the only copy. Once the contact, the group, the attendance and the request all hang off one record, where is it? stops being answered with ask Valia.",
              visual: {
                type: "merge",
                title: "Five places holding the same thing",
                sources: ["Admin spreadsheet", "Leader chats", "Ministry notebook", "Website forms", "What leaders remember"],
                target: {
                  title: "Person record",
                  rows: [
                    { title: "Olena Hnatiuk", meta: "Roots group" },
                    { title: "The Kovalchuk family", meta: "Request, in progress" },
                    { title: "Andrii Pylypenko", meta: "Sound team" },
                    { title: "Maria Didukh", meta: "Guest, second week" },
                  ],
                },
              },
            },
            {
              kind: "callout",
              title: "Do not migrate everything at once",
              text: "Moving five sources in a week ends with the church running two systems in parallel. Move one at a time and close the old source immediately.",
            },
          ],
        },
        {
          heading: "How not to slide back in six months",
          blocks: [
            {
              kind: "list",
              items: [
                "One rule: if it is not in the system, it does not exist. No exceptions for it is easier in the chat.",
                "Close old files rather than keeping them just in case — the parallel copy always wins.",
                "Give leaders access: data dies where only one person can update it.",
                "Check quarterly for a new shadow spreadsheet. If one appeared, something is missing in the system.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "The problem is not the number of tools but the lack of connection between them.",
        "One people register is the foundation.",
        "Migrate one source at a time and close the old one.",
        "A shadow spreadsheet is a signal, not a crime.",
      ],
      faq: [
        {
          q: "What if leaders prefer the chat?",
          a: "Chat stays for conversation. But anything that must outlive the week is recorded in the system: a request, a mark, an agreement.",
        },
        {
          q: "What about the archive of old spreadsheets?",
          a: "Import what is current and keep the rest as a read-only archive. Do not delete and do not edit.",
        },
        {
          q: "How long does consolidation take?",
          a: "Usually a few weeks. The import itself takes hours; agreeing definitions and cleaning lists takes the rest.",
        },
      ],
      cta: {
        title: "Bring the data into one space",
        text: "Import from spreadsheets, field mapping and a review step before anything is written.",
        label: "How import works",
        href: "/import",
      },
    },
  },
};
