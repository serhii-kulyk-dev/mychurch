import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "piat-pytan-pro-systemu",
  category: "process",
  date: "2026-09-19",
  minutes: 6,
  related: ["vasha-tserkva-unikalna", "dani-v-riznykh-mistsiakh", "yak-obraty-systemu-dlia-tserkvy"],
  copy: {
    ua: {
      seoTitle: "П'ять питань, які показують, чи є в церкві система",
      seoDescription:
        "Простий тест для церкви: п'ять звичайних питань тижня. Якщо відповідь на кожне доводиться шукати в людях і таблицях — системи немає, а є пам'ять кількох людей.",
      title: "П'ять питань, які показують, чи є у вас система",
      lead: "Не про програми й не про бюджет. Спробуйте відповісти на п'ять звичайних питань тижня — і подивіться, звідки ви берете відповіді.",
      keywords: [
        "система управління церквою",
        "облік у церкві",
        "як перевірити облік церкви",
        "де зберігати дані церкви",
        "облік відвідуваності в церкві",
        "передача служіння в церкві",
      ],
      problem: {
        title: "«Зараз у Наталі спитаю»",
        text: "Це нормальна відповідь у церкві на п'ятдесят людей. У церкві на триста вона означає, що вся картина тримається на кількох людях — і зникає разом з їхньою відпусткою, втомою або переїздом.",
      },
      sections: [
        {
          heading: "Як влаштований цей тест",
          blocks: [
            {
              kind: "text",
              text: "Правила прості: відповідь має бути точною — з іменами й датами, а не «здається, хтось не ходить». Шукати треба самому, не питаючи людину, яка «в темі». І вкластися треба в хвилину на питання.",
            },
            {
              kind: "list",
              title: "Що рахується відповіддю",
              items: [
                "Точна: імена, дати, цифри — не враження.",
                "Своя: ви знайшли її самі, не через дзвінок лідеру.",
                "Швидка: до хвилини, а не «подивлюсь увечері».",
                "Стала: за тиждень її можна знайти там само.",
              ],
            },
          ],
        },
        {
          heading: "П'ять питань",
          blocks: [
            {
              kind: "text",
              text: "Все тримається на людях, а не на процесах — і видно це не з графіків, а з того, звідки ви берете відповідь на кожне з цих питань.",
            },
            {
              kind: "table",
              columns: ["Питання", "Де зазвичай шукають відповідь", "Що це означає"],
              rows: [
                [
                  "Хто не був у церкві останні три тижні?",
                  "У пам'яті лідера",
                  "Про людину згадують тоді, коли вона вже не бере слухавку",
                ],
                [
                  "Скільки людей у молодіжці і хто прийшов уперше?",
                  "У таблиці лідера",
                  "Цифру знає одна людина, і вона застаріла",
                ],
                [
                  "Хто служить цієї неділі — і чи всі підтвердили?",
                  "У чаті та дзвінках",
                  "Хто випав, з'ясовується вранці в неділю",
                ],
                [
                  "Що люди просили минулого тижня — і хто це закрив?",
                  "В особистих повідомленнях",
                  "Половина прохань не має відповідального",
                ],
                [
                  "Що залишиться церкві, коли лідер піде?",
                  "У ноутбуці лідера",
                  "Служіння йде разом з людиною",
                ],
              ],
            },
            {
              kind: "text",
              text: "Жодне з цих питань не складне. Складно те, що відповідь на кожне лежить в іншому місці — і жодне з цих місць не належить церкві.",
            },
          ],
        },
        {
          heading: "Що показує результат",
          blocks: [
            {
              kind: "visual",
              caption:
                "Так виглядає найчастіший результат: облік живе у двох служіннях із п'яти. Це не погана церква — це церква, у якій домовились не про все. Порахуйте свої: важлива не оцінка, а те, які саме питання лишились сірими.",
              visual: {
                type: "score",
                title: "На скільки питань відповідь уже є в системі",
                totalLabel: "з п'яти",
                items: [
                  { label: "Хто зник на три тижні", ok: false },
                  { label: "Скільки людей у молодіжці", ok: true },
                  { label: "Хто служить цієї неділі", ok: true },
                  { label: "Хто закрив прохання", ok: false },
                  { label: "Що лишиться, коли лідер піде", ok: false },
                ],
              },
            },
            {
              kind: "list",
              items: [
                "Чотири-п'ять відповідей за хвилину — у вас справді є система, і питання лише в тому, щоб нею користувалися всі.",
                "Дві-три — система є в окремих служіннях, але вони не бачать одне одного.",
                "Нуль-одна — процесів немає, є кілька відповідальних людей, які тримають усе на собі.",
              ],
            },
            {
              kind: "text",
              text: "Останній варіант — не про недбалість. Так виглядає церква, яка виросла швидше, ніж встигла домовитись, де що записувати.",
            },
          ],
        },
        {
          heading: "Чому «у голові в лідера» — це не система",
          blocks: [
            {
              kind: "text",
              text: "Пам'ять лідера — найшвидше сховище, поки лідер поруч. Але воно не витримує трьох речей: відпустки, зростання й передачі. Щойно людей стає більше, ніж один лідер здатен тримати в голові, церква починає втрачати не дані, а людей.",
            },
            {
              kind: "quote",
              text: "Поки система в чиїйсь голові — вона зникає разом з людиною.",
            },
            {
              kind: "solution",
              title: "Групи — не в голові, а в списку",
              text:
                "Той самий перелік, який зазвичай тримає лідер: коли була зустріч, скільки людей прийшло і де явка падає другий місяць.",
              spec: {
                kind: "table",
                title: "Малі групи",
                subtitle: "Осінній сезон",
                columns: ["Група", "Лідер", "Остання зустріч", "Було"],
                rows: [
                  { cells: ["Витоки", "Олена Ковальчук", "Чт, 19:00", "9 з 12"] },
                  { cells: ["Молодіжна", "Тарас Микитюк", "Пт, 18:30", "14 з 16"] },
                  { cells: ["Сімейна", "Ігор Дідух", "Сб, 17:00", "6 з 10"], badge: { label: "Явка падає", tone: "amber" } },
                  { cells: ["Нові люди", "Ніна Панчук", "Нд, 12:00", "5 з 5"] },
                ],
              },
              link: { label: "Модуль «Малі групи»", href: "/modules/groups" },
            },
            {
              kind: "callout",
              title: "Це не про контроль",
              text: "Облік потрібен не для того, щоб перевіряти лідерів. Він потрібен, щоб лідер не мусив пам'ятати двадцять чотири людини одночасно — і міг спокійно піти у відпустку.",
            },
          ],
        },
        {
          heading: "Що зводити першим",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Люди",
                  text: "Один реєстр людей і сімей. До нього чіпляється все інше — без нього решта модулів не має за що триматися.",
                },
                {
                  title: "Відвідуваність",
                  text: "Відмітки з груп і служінь, прив'язані до людини. Саме звідси береться відповідь на перше питання.",
                },
                {
                  title: "Служіння й розклад",
                  text: "Хто, коли й чи підтвердив. Розклад перестає бути картинкою в чаті.",
                },
                {
                  title: "Заявки",
                  text: "Усі звернення в один список зі статусом і відповідальним — замість особистих повідомлень.",
                },
                {
                  title: "Ролі й доступи",
                  text: "Коли лідер міняється, міняється роль, а не власник бази.",
                },
              ],
            },
            {
              kind: "text",
              text: "Порядок важливіший за швидкість. Церква, яка вмикає все одразу, зазвичай за місяць повертається до таблиць — бо ніхто не встиг звикнути.",
            },
          ],
        },
        {
          heading: "Як перевірити себе через квартал",
          blocks: [
            {
              kind: "list",
              items: [
                "Пройдіть ті самі п'ять питань — тим самим способом, самі й з годинником.",
                "Подивіться, чи не з'явилась нова тіньова таблиця: якщо з'явилась, у системі чогось бракує.",
                "Спитайте лідерів, що вони досі роблять вручну щотижня.",
                "Перевірте найпростіше: чи зможе новий лідер групи почати роботу без дзвінка попередньому.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Система — це не програма, а здатність церкви відповісти на свої звичайні питання без дзвінка «людині, яка в темі».",
        "Питання прості, складна лише розкиданість: кожна відповідь лежить в іншому місці.",
        "Починати варто з реєстру людей: без нього відвідуваність, служіння й заявки нема до чого чіпляти.",
        "Мета обліку — не контроль лідерів, а те, щоб вони могли не тримати все в голові.",
      ],
      faq: [
        {
          q: "У нас невелика церква. Нам справді потрібна система?",
          a: "Поки людей до п'ятдесяти, пам'яті лідерів вистачає. Система стає потрібною тоді, коли з'являється другий лідер, який має знати те саме, — або коли перший іде у відпустку.",
        },
        {
          q: "З чого почати, якщо жодної відповіді немає?",
          a: "З одного реєстру людей і сімей. Не переносьте п'ять джерел одразу: перенесіть людей, закрийте стару таблицю й тільки потім беріться за відвідуваність.",
        },
        {
          q: "Чи не буде це виглядати як недовіра до лідерів?",
          a: "Навпаки: облік знімає з лідера обов'язок пам'ятати все самому. Найчастіше саме лідери першими просять не вести список у зошиті.",
        },
      ],
      cta: {
        title: "Зберіть систему під свою церкву",
        text: "Оберіть, що хочете спростити першим, — і подивіться, які модулі це закривають.",
        label: "Конструктор модулів",
        href: "/modules",
      },
    },
    en: {
      seoTitle: "Five questions that show whether a church has a system",
      seoDescription:
        "A simple test for a church: five ordinary questions of the week. If every answer has to be hunted down in people and spreadsheets, there is no system — only a few people's memory.",
      title: "Five questions that show whether you have a system",
      lead: "Not about software and not about budget. Try answering five ordinary questions of the week — and watch where your answers come from.",
      keywords: [
        "church management system",
        "church record keeping",
        "how to check church records",
        "where to keep church data",
        "church attendance tracking",
        "ministry handover",
      ],
      problem: {
        title: "“Let me ask Natalia”",
        text: "That is a fine answer in a church of fifty. In a church of three hundred it means the whole picture rests on a few people — and leaves with their holiday, their tiredness or their move to another city.",
      },
      sections: [
        {
          heading: "How the test works",
          blocks: [
            {
              kind: "text",
              text: "The rules are simple: the answer has to be precise — names and dates, not “I think someone stopped coming”. You have to find it yourself, without calling the person who knows. And you have a minute per question.",
            },
            {
              kind: "list",
              title: "What counts as an answer",
              items: [
                "Precise: names, dates, numbers — not impressions.",
                "Yours: you found it, not a leader on the phone.",
                "Fast: under a minute, not “I'll check tonight”.",
                "Stable: next week it is still in the same place.",
              ],
            },
          ],
        },
        {
          heading: "The five questions",
          blocks: [
            {
              kind: "text",
              text: "Everything rests on people, not on processes — and you see it not in charts but in where each of these answers comes from.",
            },
            {
              kind: "table",
              columns: ["Question", "Where the answer usually lives", "What that means"],
              rows: [
                [
                  "Who hasn't been to church for three weeks?",
                  "In the leader's memory",
                  "The person comes to mind once they stop picking up",
                ],
                [
                  "How many people are in the youth group, and who came for the first time?",
                  "In the leader's spreadsheet",
                  "One person knows the number, and it is out of date",
                ],
                [
                  "Who is serving this Sunday — and has everyone confirmed?",
                  "In chats and phone calls",
                  "Who dropped out becomes clear on Sunday morning",
                ],
                [
                  "What did people ask for last week — and who closed it?",
                  "In private messages",
                  "Half of the requests have no owner",
                ],
                [
                  "What stays with the church when a leader leaves?",
                  "On the leader's laptop",
                  "The ministry walks out with the person",
                ],
              ],
            },
            {
              kind: "text",
              text: "None of these questions is hard. What is hard is that every answer sits somewhere else — and none of those places belongs to the church.",
            },
          ],
        },
        {
          heading: "What the result tells you",
          blocks: [
            {
              kind: "visual",
              caption:
                "This is the most common result: records live in two ministries out of five. That is not a bad church — it is a church that has agreed on some things and not others. Count yours: the score matters less than which questions stayed grey.",
              visual: {
                type: "score",
                title: "How many questions the system already answers",
                totalLabel: "out of five",
                items: [
                  { label: "Who has been missing three weeks", ok: false },
                  { label: "How many came to youth night", ok: true },
                  { label: "Who serves this Sunday", ok: true },
                  { label: "Who closed each request", ok: false },
                  { label: "What stays when a leader leaves", ok: false },
                ],
              },
            },
            {
              kind: "list",
              items: [
                "Four or five answers in a minute — you do have a system, and the only question is whether everyone uses it.",
                "Two or three — single ministries have a system, but they cannot see each other.",
                "None or one — there are no processes, only a few people carrying everything.",
              ],
            },
            {
              kind: "text",
              text: "The last case is not carelessness. It is what a church looks like when it grew faster than it managed to agree on where things are written down.",
            },
          ],
        },
        {
          heading: "Why “in the leader's head” is not a system",
          blocks: [
            {
              kind: "text",
              text: "A leader's memory is the fastest storage there is, as long as the leader is around. It fails at three things: holidays, growth and handover. Once there are more people than one leader can hold in mind, a church starts losing not data but people.",
            },
            {
              kind: "quote",
              text: "While the system lives in someone's head, it leaves when they do.",
            },
            {
              kind: "solution",
              title: "Groups in a list, not in a head",
              text:
                "The same overview a leader usually carries: when the group last met, how many came, and where attendance has been sliding for a second month.",
              spec: {
                kind: "table",
                title: "Small groups",
                subtitle: "Autumn season",
                columns: ["Group", "Leader", "Last meeting", "Present"],
                rows: [
                  { cells: ["Roots", "Olena Kovalchuk", "Thu, 19:00", "9 of 12"] },
                  { cells: ["Youth", "Taras Mykytiuk", "Fri, 18:30", "14 of 16"] },
                  { cells: ["Families", "Ihor Didukh", "Sat, 17:00", "6 of 10"], badge: { label: "Attendance down", tone: "amber" } },
                  { cells: ["Newcomers", "Nina Panchuk", "Sun, 12:00", "5 of 5"] },
                ],
              },
              link: { label: "The Small groups module", href: "/modules/groups" },
            },
            {
              kind: "callout",
              title: "This is not about control",
              text: "Records are not there to check up on leaders. They are there so a leader does not have to remember twenty-four people at once — and can take a holiday in peace.",
            },
          ],
        },
        {
          heading: "What to bring together first",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "People",
                  text: "One register of people and families. Everything else attaches to it; without it the other modules have nothing to hold on to.",
                },
                {
                  title: "Attendance",
                  text: "Check-ins from groups and ministries, tied to the person. This is where the answer to the first question comes from.",
                },
                {
                  title: "Ministries and the rota",
                  text: "Who, when, and whether they confirmed. The plan stops being an image in a chat.",
                },
                {
                  title: "Requests",
                  text: "Every request in one list with a status and an owner — instead of private messages.",
                },
                {
                  title: "Roles and access",
                  text: "When a leader changes, what changes is a role, not the owner of the database.",
                },
              ],
            },
            {
              kind: "text",
              text: "Order matters more than speed. A church that switches everything on at once is usually back in spreadsheets within a month, because nobody had time to get used to it.",
            },
          ],
        },
        {
          heading: "How to re-check yourself in a quarter",
          blocks: [
            {
              kind: "list",
              items: [
                "Run the same five questions the same way — on your own, with a clock.",
                "Look for a new shadow spreadsheet: if one appeared, something is missing in the system.",
                "Ask leaders what they still do by hand every week.",
                "Check the simplest thing: could a new group leader start without calling the previous one?",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "A system is not software — it is a church's ability to answer its ordinary questions without calling “the person who knows”.",
        "The questions are simple; what is hard is that every answer lives somewhere else.",
        "Start with the register of people: attendance, ministries and requests have nothing to attach to without it.",
        "The point of record keeping is not to check leaders, but to free them from holding everything in mind.",
      ],
      faq: [
        {
          q: "Our church is small. Do we really need a system?",
          a: "Up to about fifty people, the leaders' memory is enough. A system becomes necessary when a second leader has to know the same things — or when the first one goes on holiday.",
        },
        {
          q: "Where do we start if we have none of the answers?",
          a: "With one register of people and families. Do not move five sources at once: move the people, close the old spreadsheet, and only then take on attendance.",
        },
        {
          q: "Won't this look like distrust of our leaders?",
          a: "It is the opposite: records take away the duty to remember everything alone. More often than not, leaders are the first to ask to stop keeping the list in a notebook.",
        },
      ],
      cta: {
        title: "Build the system around your church",
        text: "Pick what you want to simplify first — and see which modules cover it.",
        label: "Module builder",
        href: "/modules",
      },
    },
  },
};
