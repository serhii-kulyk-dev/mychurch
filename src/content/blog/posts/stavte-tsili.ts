import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "stavte-tsili",
  category: "growth",
  date: "2026-09-04",
  minutes: 8,
  related: ["vid-vidviduvacha-do-lidera", "dani-v-riznykh-mistsiakh", "piat-pytan-pro-systemu"],
  copy: {
    ua: {
      seoTitle: "Ставте цілі: як церкві виміряти зростання",
      seoDescription:
        "Як формулювати цілі церкви на рік так, щоб їх можна було перевірити: приклади цілей по людях, групах, служіннях і що робити, коли ціль не виконана.",
      title: "Ставте цілі: як виміряти те, що справді важливе",
      lead: "«Хочемо зростати» — це не ціль, а настрій. Ціль починається там, де з'являється число, дата й людина, яка за неї відповідає.",
      keywords: [
        "цілі церкви на рік",
        "як виміряти зростання церкви",
        "метрики церкви",
        "планування розвитку громади",
        "стратегія церкви приклад",
      ],
      problem: {
        title: "Плани є, але ніхто не знає, чи вони виконані",
        text: "На початку року озвучили п'ять напрямів. У грудні ніхто не може сказати, що з них вийшло — бо жоден напрям не мав числа, за яким це можна перевірити.",
      },
      sections: [
        {
          heading: "Ціль має складатись із чотирьох частин",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Що саме змінюється", text: "Не «розвивати малі групи», а «частка людей у малих групах»." },
                { title: "З якого до якого", text: "Число зараз і число, якого хочемо. Без стартового числа ціль неможливо перевірити." },
                { title: "До якої дати", text: "Рік, півріччя, сезон. Без дати ціль перетворюється на напрям." },
                { title: "Хто відповідає", text: "Одне ім'я. Не «команда лідерів»." },
              ],
            },
            {
              kind: "quote",
              text: "Ціль без стартового числа — це побажання з датою.",
            },
          ],
        },
        {
          heading: "Приклади цілей, які реально працюють",
          blocks: [
            {
              kind: "table",
              columns: ["Напрям", "Погана форма", "Робоча форма"],
              rows: [
                ["Малі групи", "Розвивати групи", "Частка людей у групах з 38% до 55% до грудня"],
                ["Нові люди", "Більше працювати з гостями", "90% гостей отримують контакт протягом тижня"],
                ["Служіння", "Не перевантажувати команду", "Жоден служитель не стоїть у графіку більше 3 тижнів поспіль"],
                ["Лідери", "Готувати наступників", "У кожній групі є помічник — 20 з 24 груп до червня"],
              ],
            },
            {
              kind: "text",
              text: "Зверніть увагу: усі робочі формулювання спираються на дані, які церква вже й так збирає. Ціль, для перевірки якої треба щоразу проводити опитування, помирає в березні.",
            },
            {
              kind: "visual",
              caption:
                "Приклад однієї цілі з таблиці вище: стартове число, дата й лінія, до якої треба дійти. Поки стовпчик нижчий за пунктир, ціль не виконана — і це видно на травневій зустрічі лідерів, а не в грудні.",
              visual: {
                type: "chart",
                title: "Частка людей у малих групах: з 38% до 55% до грудня",
                unit: "частка людей у малих групах, відсотки",
                goal: 55,
                goalLabel: "ціль 55%",
                bars: [
                  { label: "січ", value: 38 },
                  { label: "бер", value: 41 },
                  { label: "трав", value: 43 },
                  { label: "лип", value: 47 },
                  { label: "вер", value: 49 },
                  { label: "лист", value: 53 },
                  { label: "груд", value: 56 },
                ],
              },
            },
          ],
        },
        {
          heading: "Скільки цілей ставити",
          blocks: [
            {
              kind: "list",
              items: [
                "Три-чотири на рік для всієї церкви. П'ятнадцять цілей означають нуль пріоритетів.",
                "Одна ціль на служіння — свою, а не спущену зверху.",
                "Одна метрика, за якою дивимось щомісяця. Решта — щокварталу.",
              ],
            },
            {
              kind: "callout",
              title: "Ціль ≠ звіт",
              text: "Якщо про ціль згадують лише тоді, коли треба звітувати, вона не працює. Ціль має з'являтись у щотижневій розмові лідерів: що ми зробили цього тижня, щоб зрушити її.",
            },
            {
              kind: "solution",
              title: "Три цілі на квартал — з числом і людиною",
              text:
                "Показник, стартове число, термін і відповідальний стоять поруч, а прогрес рахується з тих самих відміток, що вже є в системі.",
              spec: {
                kind: "list",
                title: "Цілі та метрики",
                subtitle: "Осінній квартал",
                items: [
                  { title: "Гості доходять до групи", sub: "Було 18% · ціль 30% · до 31 грудня", meta: "Тарас Микитюк", badge: { label: "24%", tone: "green" } },
                  { title: "Кожне служіння має заміну", sub: "Було 4 служіння · ціль 9 · до 30 листопада", meta: "Оксана Гнатюк", badge: { label: "6 з 9", tone: "amber" } },
                  { title: "Дзвінок новому за три дні", sub: "Було 9 днів · ціль 3 дні", meta: "Ніна Панчук", badge: { label: "5 днів", tone: "amber" } },
                ],
                footer: "Число тягнеться з відміток і заявок — руками його ніхто не вводить.",
              },
              link: { label: "Модуль «Цілі та метрики»", href: "/modules/goals" },
            },
          ],
        },
        {
          heading: "Що робити, коли ціль не виконана",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Перевірте дані", text: "Часто «не виконано» означає «не порахували». Спершу переконайтесь, що цифра правдива." },
                { title: "Розділіть причини", text: "Не вистачило людей, часу, ясності чи бажання — це чотири різні проблеми з різними рішеннями." },
                { title: "Не переносьте автоматично", text: "Ціль, яку переносять третій рік поспіль, зазвичай не є ціллю церкви." },
                { title: "Зафіксуйте висновок", text: "Кілька речень у документі сезону. Це і є те, що передається наступним лідерам." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Ціль = показник + стартове число + дата + одне ім'я.",
        "Робочі цілі спираються на дані, які вже збираються.",
        "Три-чотири цілі на рік, не більше.",
        "Невиконана ціль потребує висновку, а не автоматичного переносу.",
      ],
      faq: [
        {
          q: "Чи доречно ставити числові цілі в церкві?",
          a: "Числа описують не духовний стан, а нашу вірність у практичних речах: чи зателефонували гостю, чи має людина групу. Це питання відповідальності, а не комерції.",
        },
        {
          q: "З чого почати, якщо даних немає взагалі?",
          a: "Перший квартал — це вимірювання без цілей. Просто почніть фіксувати відвідуваність і склад груп, і вже за три місяці буде стартове число.",
        },
        {
          q: "Хто має формулювати цілі?",
          a: "Пастор і керівники напрямів разом. Ціль, у формулюванні якої лідер не брав участі, виконується формально або не виконується взагалі.",
        },
      ],
      cta: {
        title: "Цілі та метрики в системі",
        text: "Показник, стартове число, термін і відповідальний — і прогрес, який видно щомісяця.",
        label: "Модуль «Цілі та метрики»",
        href: "/modules/goals",
      },
    },
    en: {
      seoTitle: "Set goals: how a church can measure growth",
      seoDescription:
        "How to word church goals so they can be checked: examples for people, groups and ministries, and what to do when a goal is missed.",
      title: "Set goals: measuring what actually matters",
      lead: "We want to grow is a mood, not a goal. A goal begins where there is a number, a date and a person responsible for it.",
      keywords: [
        "church goals for the year",
        "measuring church growth",
        "church metrics",
        "church strategic planning",
        "church annual plan example",
      ],
      problem: {
        title: "There are plans, but nobody knows if they happened",
        text: "Five directions announced in January. In December nobody can say which worked, because none of them had a number to check against.",
      },
      sections: [
        {
          heading: "A goal has four parts",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "What changes", text: "Not develop small groups, but the share of people in small groups." },
                { title: "From what to what", text: "Today's number and the target. Without a starting number a goal cannot be checked." },
                { title: "By when", text: "A year, a half, a season. Without a date a goal is only a direction." },
                { title: "Who owns it", text: "One name, not the leadership team." },
              ],
            },
            { kind: "quote", text: "A goal without a starting number is a wish with a deadline." },
          ],
        },
        {
          heading: "Examples that actually work",
          blocks: [
            {
              kind: "table",
              columns: ["Area", "Weak wording", "Working wording"],
              rows: [
                ["Small groups", "Develop groups", "Share of people in groups from 38% to 55% by December"],
                ["New people", "Work better with guests", "90% of guests contacted within a week"],
                ["Ministries", "Avoid overloading the team", "No volunteer rostered more than 3 weeks running"],
                ["Leaders", "Raise successors", "An apprentice in 20 of 24 groups by June"],
              ],
            },
            {
              kind: "text",
              text: "Every working version relies on data the church already collects. A goal that needs a survey to measure dies in March.",
            },
            {
              kind: "visual",
              caption:
                "One goal from the table above, made visible: a starting number, a date and the line to reach. While the column sits below the dashes the goal is not met — and that shows up at the May leaders' meeting, not in December.",
              visual: {
                type: "chart",
                title: "People in small groups: from 38% to 55% by December",
                unit: "share of people in small groups, per cent",
                goal: 55,
                goalLabel: "goal 55%",
                bars: [
                  { label: "Jan", value: 38 },
                  { label: "Mar", value: 41 },
                  { label: "May", value: 43 },
                  { label: "Jul", value: 47 },
                  { label: "Sep", value: 49 },
                  { label: "Nov", value: 53 },
                  { label: "Dec", value: 56 },
                ],
              },
            },
          ],
        },
        {
          heading: "How many goals",
          blocks: [
            {
              kind: "list",
              items: [
                "Three or four a year for the whole church. Fifteen goals means no priorities.",
                "One goal per ministry, theirs rather than handed down.",
                "One metric reviewed monthly; the rest quarterly.",
              ],
            },
            {
              kind: "callout",
              title: "A goal is not a report",
              text: "If a goal only comes up at reporting time, it is not working. It should appear in the weekly leaders' conversation: what did we do this week to move it?",
            },
            {
              kind: "solution",
              title: "Three goals a quarter, each with a number and a name",
              text:
                "Metric, baseline, deadline and owner sit side by side, and progress is counted from the check-ins the system already holds.",
              spec: {
                kind: "list",
                title: "Goals and metrics",
                subtitle: "Autumn quarter",
                items: [
                  { title: "Guests reach a group", sub: "Was 18% · goal 30% · by 31 December", meta: "Taras Mykytiuk", badge: { label: "24%", tone: "green" } },
                  { title: "Every ministry has a stand-in", sub: "Was 4 ministries · goal 9 · by 30 November", meta: "Oksana Hnatiuk", badge: { label: "6 of 9", tone: "amber" } },
                  { title: "A call to a newcomer within three days", sub: "Was 9 days · goal 3 days", meta: "Nina Panchuk", badge: { label: "5 days", tone: "amber" } },
                ],
                footer: "The number comes from check-ins and requests — nobody types it in.",
              },
              link: { label: "The Goals and metrics module", href: "/modules/goals" },
            },
          ],
        },
        {
          heading: "When a goal is missed",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Check the data", text: "Missed often means not measured. Make sure the number is true first." },
                { title: "Separate the causes", text: "Not enough people, time, clarity or desire — four different problems with four different fixes." },
                { title: "Do not roll it over automatically", text: "A goal carried for a third year is usually not a goal of this church." },
                { title: "Write the conclusion down", text: "A few sentences in the season document. That is what the next leaders inherit." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "A goal is a metric plus a starting number, a date and one name.",
        "Working goals rely on data you already collect.",
        "Three or four goals a year, no more.",
        "A missed goal needs a conclusion, not an automatic rollover.",
      ],
      faq: [
        {
          q: "Are numeric goals appropriate for a church?",
          a: "Numbers do not describe spiritual state; they describe faithfulness in practical things — whether the guest was called, whether a person has a group. That is accountability, not commerce.",
        },
        {
          q: "Where do we start with no data at all?",
          a: "Spend the first quarter measuring without goals. Record attendance and group membership, and in three months you have a baseline.",
        },
        {
          q: "Who should word the goals?",
          a: "The pastor and area leads together. A goal a leader did not help shape gets done formally or not at all.",
        },
      ],
      cta: {
        title: "Goals and metrics in the system",
        text: "A metric, a baseline, a deadline and an owner, with progress visible every month.",
        label: "Goals and metrics module",
        href: "/modules/goals",
      },
    },
  },
};
