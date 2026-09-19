import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "analizuite",
  category: "growth",
  date: "2026-08-25",
  minutes: 8,
  related: ["stavte-tsili", "oblik-vidviduvanosti", "skilky-liudei-u-tserkvi"],
  copy: {
    ua: {
      seoTitle: "Аналітика церкви: 7 цифр, які варто дивитись щотижня",
      seoDescription:
        "Які показники справді допомагають пастору й лідерам: відвідуваність, залученість у групи, нові люди, зниклі, навантаження служителів. І як не потонути у звітах.",
      title: "Аналізуйте: сім цифр, які варто дивитись регулярно",
      lead: "Аналітика в церкві потрібна не для звіту. Вона потрібна, щоб у понеділок знати, кому зателефонувати й де саме процес зупинився.",
      keywords: [
        "аналітика церкви",
        "звіти для пастора",
        "показники церкви",
        "статистика відвідуваності церкви",
        "дашборд церкви",
      ],
      problem: {
        title: "Даних багато, рішень з них — нуль",
        text: "Наприкінці місяця збирають звіт на дві сторінки. Його читають, кивають і кладуть у папку. Наступного місяця — те саме, бо жодна цифра не веде до конкретної дії.",
      },
      sections: [
        {
          heading: "Правило: цифра має закінчуватись ім'ям",
          blocks: [
            {
              kind: "text",
              text: "Корисний показник — це той, з якого можна перейти до списку конкретних людей. «Відвідуваність впала на 12%» не породжує дії. «Вісімнадцять людей не були три тижні, ось вони» — породжує.",
            },
            {
              kind: "quote",
              text: "Якщо з цифри не можна відкрити список людей, це не аналітика, а декорація.",
            },
          ],
        },
        {
          heading: "Сім показників, яких достатньо",
          blocks: [
            {
              kind: "table",
              columns: ["Показник", "Що показує", "Дія"],
              rows: [
                ["Присутні на служінні", "Загальна динаміка", "Порівняти з тим самим тижнем торік"],
                ["Зниклі за 3 тижні", "Хто на межі", "Розподілити список між лідерами"],
                ["Нові гості за тиждень", "Приплив людей", "Перевірити, з ким уже зв'язались"],
                ["Частка людей у групах", "Залученість", "Знайти тих, хто досі поза групами"],
                ["Групи без зустрічей 2 тижні", "Здоров'я груп", "Зателефонувати лідеру, а не групі"],
                ["Навантаження служителів", "Ризик вигорання", "Перебудувати графік"],
                ["Відкриті заявки", "Чи відповідаємо людям", "Закрити прострочені"],
              ],
            },
            {
              kind: "text",
              text: "Сім — це межа, після якої зведення перестає читатись. Якщо хочеться додати восьмий, спершу приберіть один із наявних.",
            },
          ],
        },
        {
          heading: "Як часто дивитись",
          blocks: [
            {
              kind: "list",
              items: [
                "Щотижня: зниклі, нові гості, відкриті заявки. Це оперативні сигнали.",
                "Щомісяця: частка людей у групах, навантаження служителів, стан груп.",
                "Щокварталу: динаміка відвідуваності, рух по етапах, прогрес цілей.",
                "Щороку: порівняння з тим самим періодом торік, а не з попереднім місяцем.",
              ],
            },
            {
              kind: "callout",
              title: "Сезонність ламає висновки",
              text: "Липень завжди нижчий за травень, а перший тиждень січня — за грудень. Порівнюйте рік до року, інакше кожне літо виглядатиме як криза.",
            },
          ],
        },
        {
          heading: "Хто дивиться на що",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Лідер групи", text: "Своя група: хто був, хто зник, хто просив про молитву. Одна сторінка." },
                { title: "Керівник служіння", text: "Своя команда: навантаження, заміни, хто давно не служив." },
                { title: "Координатор напряму", text: "Стан груп і рух нових людей по етапах." },
                { title: "Пастор", text: "Зведення по громаді й прогрес цілей. Без деталей — деталі є в тих, хто нижче." },
              ],
            },
          ],
        },
        {
          heading: "З чого почати, якщо аналітики зараз немає",
          blocks: [
            {
              kind: "list",
              items: [
                "Виберіть один показник — зниклих за три тижні.",
                "Дивіться його щопонеділка протягом місяця.",
                "Після кожного перегляду фіксуйте, скільки людей з нього отримали дзвінок.",
                "Коли звичка закріпилась — додайте другий показник.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Показник корисний тоді, коли з нього можна відкрити список людей.",
        "Сім цифр — достатньо; восьма витісняє одну з попередніх.",
        "Порівнювати треба рік до року, бо сезонність спотворює все.",
        "У кожної ролі своє зведення: пастор не читає деталі лідера.",
      ],
      faq: [
        {
          q: "Чи не перетворює аналітика церкву на компанію?",
          a: "Компанію робить не наявність цифр, а те, що ними вимірюють людей. Тут цифри вимірюють нашу увагу до людей — це протилежні речі.",
        },
        {
          q: "Скільки часу потрібно, щоб з'явилась достовірна динаміка?",
          a: "Приблизно квартал регулярних відміток. До того часу цифри показують не церкву, а якість заповнення.",
        },
        {
          q: "Що робити, якщо дані суперечать відчуттям?",
          a: "Перевірити спосіб збору. Найчастіше суперечність означає, що частина людей не відмічається, а не те, що відчуття помилкові.",
        },
      ],
      cta: {
        title: "Зведення, яке відкриває список людей",
        text: "Показники громади, груп і служінь — з переходом до конкретних імен.",
        label: "Модуль «Аналітика та звіти»",
        href: "/modules/analytics",
      },
    },
    en: {
      seoTitle: "Church analytics: seven numbers worth watching",
      seoDescription:
        "Which metrics actually help a pastor and leaders: attendance, group engagement, new people, absentees, volunteer load — and how not to drown in reports.",
      title: "Analyse: seven numbers worth watching regularly",
      lead: "Church analytics is not for reporting. It exists so that on Monday you know who to call and where the process stopped.",
      keywords: [
        "church analytics",
        "church reports for pastors",
        "church attendance statistics",
        "church dashboard",
        "church health metrics",
      ],
      problem: {
        title: "Plenty of data, no decisions",
        text: "A two-page report at the end of the month. People read it, nod, file it. Next month the same, because no number leads to an action.",
      },
      sections: [
        {
          heading: "A number must end in a name",
          blocks: [
            {
              kind: "text",
              text: "A useful metric is one you can open into a list of people. Attendance fell 12% produces nothing. Eighteen people have missed three weeks, here they are, produces phone calls.",
            },
            { kind: "quote", text: "If a number does not open a list of people, it is decoration." },
          ],
        },
        {
          heading: "Seven metrics are enough",
          blocks: [
            {
              kind: "table",
              columns: ["Metric", "What it shows", "Action"],
              rows: [
                ["Service attendance", "Overall trend", "Compare with the same week last year"],
                ["Absent 3 weeks", "Who is at risk", "Split the list between leaders"],
                ["New guests this week", "Inflow", "Check who has been contacted"],
                ["Share in small groups", "Engagement", "Find those still outside a group"],
                ["Groups not meeting 2 weeks", "Group health", "Call the leader, not the group"],
                ["Volunteer load", "Burnout risk", "Rebuild the rota"],
                ["Open requests", "Are we answering people", "Close the overdue ones"],
              ],
            },
            {
              kind: "text",
              text: "Seven is the limit at which a summary is still read. If you want an eighth, remove one first.",
            },
          ],
        },
        {
          heading: "How often to look",
          blocks: [
            {
              kind: "list",
              items: [
                "Weekly: absentees, new guests, open requests.",
                "Monthly: group engagement, volunteer load, group health.",
                "Quarterly: attendance trend, movement through stages, goal progress.",
                "Yearly: the same period last year, not last month.",
              ],
            },
            {
              kind: "callout",
              title: "Seasonality breaks conclusions",
              text: "July is always below May, and the first week of January below December. Compare year on year or every summer looks like a crisis.",
            },
          ],
        },
        {
          heading: "Who looks at what",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Group leader", text: "Their group: who came, who vanished, who asked for prayer. One page." },
                { title: "Ministry lead", text: "Their team: load, swaps, who has not served for a while." },
                { title: "Area coordinator", text: "Group health and movement of new people through stages." },
                { title: "Pastor", text: "The church-wide summary and goal progress, without the details." },
              ],
            },
          ],
        },
        {
          heading: "Starting from zero",
          blocks: [
            {
              kind: "list",
              items: [
                "Pick one metric: absent three weeks.",
                "Look at it every Monday for a month.",
                "Record how many of those people got a call.",
                "Once the habit holds, add the second metric.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "A metric is useful when it opens a list of people.",
        "Seven numbers are enough; the eighth pushes one out.",
        "Compare year on year, because seasonality distorts everything.",
        "Each role gets its own summary.",
      ],
      faq: [
        {
          q: "Does analytics turn a church into a company?",
          a: "What makes a company is measuring people by numbers. Here the numbers measure our attention to people — the opposite thing.",
        },
        {
          q: "How long before the trend is trustworthy?",
          a: "About a quarter of consistent marking. Before that the numbers describe data quality rather than the church.",
        },
        {
          q: "What if the data contradicts what we feel?",
          a: "Check how it is collected. Usually it means part of the congregation is not being recorded, not that the feeling is wrong.",
        },
      ],
      cta: {
        title: "A summary that opens a list of people",
        text: "Metrics for the church, groups and ministries, each leading to real names.",
        label: "Analytics and reports",
        href: "/modules/analytics",
      },
    },
  },
};
