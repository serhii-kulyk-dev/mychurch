import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "mali-hrupy",
  category: "people",
  date: "2026-08-12",
  minutes: 8,
  related: ["oblik-vidviduvanosti", "yak-ne-zahubyty-liudei-u-velykii-tserkvi", "komanda-bez-vyhorannia"],
  copy: {
    ua: {
      seoTitle: "Малі групи: облік, лідери і зростання громади",
      seoDescription:
        "Як вести облік малих груп: склад, відвідуваність, лідери, поділ групи. Які цифри показують здоров'я групи й коли групу пора ділити.",
      title: "Малі групи: облік, лідери і зростання",
      lead: "Мала група — це найменша одиниця, у якій людину помічають. Якщо в церкві працюють групи, більшість інших проблем з людьми стає меншими.",
      keywords: [
        "облік малих груп",
        "як вести малу групу",
        "програма для малих груп церкви",
        "лідер малої групи обов'язки",
        "коли ділити малу групу",
      ],
      problem: {
        title: "Групи є, але ніхто не знає, що в них відбувається",
        text: "У списку 24 групи. Реально збираються 17. Скільки людей у кожній — приблизно. Хто з них не був місяць — невідомо. Координатор дізнається про закриття групи через пів року.",
      },
      sections: [
        {
          heading: "Мінімум, який має бути про кожну групу",
          blocks: [
            {
              kind: "list",
              items: [
                "Лідер і помічник — з іменами й контактами, а не «команда».",
                "Склад учасників з датою приєднання.",
                "День, час і місце зустрічі.",
                "Відмітка відвідуваності за кожну зустріч.",
                "Статус: набирає, повна, закрита, на паузі.",
              ],
            },
            {
              kind: "text",
              text: "Це мінімум, з якого починається все інше. Без складу й відміток жодна аналітика по групах не має сенсу — ви порівнюватимете припущення з припущеннями.",
            },
          ],
        },
        {
          heading: "Цифри, які показують здоров'я групи",
          blocks: [
            {
              kind: "table",
              columns: ["Показник", "Що означає", "Коли тривожно"],
              rows: [
                ["Частка присутніх від складу", "Наскільки група жива", "Стабільно нижче половини протягом місяця"],
                ["Нові учасники за квартал", "Чи група відкрита", "Нуль протягом двох кварталів"],
                ["Регулярність зустрічей", "Чи група реально збирається", "Пропуски частіше ніж раз на місяць"],
                ["Наявність помічника", "Чи є кому підхопити", "Лідер один понад пів року"],
              ],
            },
            {
              kind: "text",
              text: "Жоден показник не оцінює лідера. Вони потрібні координатору, щоб знати, кому запропонувати допомогу раніше, ніж група тихо зникне.",
            },
          ],
        },
        {
          heading: "Коли групу пора ділити",
          blocks: [
            {
              kind: "text",
              text: "Найчастіша причина, чому групи не діляться, — це не розмір, а відсутність другого лідера. Тому поділ починається не з рішення про поділ, а з підготовки помічника за кілька місяців до того.",
            },
            {
              kind: "steps",
              items: [
                { title: "З'явився помічник", text: "У групі є людина, яка вже веде частину зустрічей." },
                { title: "Стабільно понад 12–15 учасників", text: "Розмова перестає бути спільною: говорять двоє-троє, решта слухає." },
                { title: "Домовтесь про склад заздалегідь", text: "Хто з ким іде — вирішується разом, а не оголошується фактом." },
                { title: "Залиште зв'язок", text: "Спільна зустріч раз на квартал знімає відчуття, що групу розірвали." },
              ],
            },
          ],
        },
        {
          heading: "Що потрібно лідеру групи щотижня",
          blocks: [
            {
              kind: "list",
              items: [
                "Список своїх людей з контактами — у телефоні, а не в теці.",
                "Відмітка присутності за хвилину.",
                "Видимість: хто з групи не був три зустрічі поспіль.",
                "Місце, куди записати молитовну потребу так, щоб вона не загубилась.",
              ],
            },
            {
              kind: "callout",
              title: "Правило для координатора",
              text: "Якщо лідеру, щоб виконати вашу вимогу, потрібно відкрити комп'ютер, вимога не виконуватиметься. Усе, що просите від лідерів щотижня, має робитись з телефона за дві хвилини.",
            },
          ],
        },
      ],
      takeaways: [
        "Мінімум по групі: лідер, склад, розклад, відмітки, статус.",
        "Показники груп потрібні координатору для допомоги, а не для оцінки лідерів.",
        "Групу ділять тоді, коли є другий лідер, а не коли стало тісно.",
        "Усе щотижневе має робитись з телефона за дві хвилини.",
      ],
      faq: [
        {
          q: "Скільки людей має бути в групі?",
          a: "8–15. Менше — група розпадається від двох відсутностей, більше — розмова перестає бути спільною і тихі учасники зникають з поля зору.",
        },
        {
          q: "Що робити з групами, які не хочуть вести облік?",
          a: "Почніть з одного поля — присутності. Коли лідери побачать, що система сама показує їм зниклих, решта полів заповнюється без тиску.",
        },
        {
          q: "Чи потрібно фіксувати теми зустрічей?",
          a: "Необов'язково для обліку, але корисно для наступного лідера. Достатньо одного рядка про те, що проходили, — це не конспект.",
        },
      ],
      cta: {
        title: "Малі групи в системі",
        text: "Склад, лідери, відвідуваність і статус кожної групи — разом зі списком тих, хто зник.",
        label: "Модуль «Малі групи»",
        href: "/modules/groups",
      },
    },
    en: {
      seoTitle: "Small groups: records, leaders and growth",
      seoDescription:
        "How to keep small group records: membership, attendance, leaders, multiplication. Which numbers show group health and when a group should split.",
      title: "Small groups: records, leaders and growth",
      lead: "A small group is the smallest unit where a person gets noticed. When groups work, most other people problems in a church shrink.",
      keywords: [
        "small group management",
        "small group attendance tracking",
        "church small group software",
        "small group leader responsibilities",
        "when to multiply a small group",
      ],
      problem: {
        title: "Groups exist, but nobody knows what happens in them",
        text: "The list shows 24 groups. Seventeen actually meet. Sizes are approximate. Who has been away for a month is unknown. The coordinator learns a group closed six months later.",
      },
      sections: [
        {
          heading: "The minimum record for every group",
          blocks: [
            {
              kind: "list",
              items: [
                "Leader and apprentice, by name and contact — not a team.",
                "Members with the date they joined.",
                "Day, time and place of the meeting.",
                "Attendance for each meeting.",
                "Status: open, full, closed, paused.",
              ],
            },
            {
              kind: "text",
              text: "Everything else builds on this. Without membership and attendance, group analytics compares one assumption with another.",
            },
          ],
        },
        {
          heading: "Numbers that show group health",
          blocks: [
            {
              kind: "table",
              columns: ["Metric", "Meaning", "Warning level"],
              rows: [
                ["Attendance vs membership", "How alive the group is", "Below half for a month"],
                ["New members per quarter", "Whether it stays open", "Zero for two quarters"],
                ["Meeting regularity", "Whether it really gathers", "Skipping more than monthly"],
                ["Has an apprentice", "Whether anyone can take over", "Leader alone for over six months"],
              ],
            },
            {
              kind: "text",
              text: "None of these grade the leader. They exist so the coordinator can offer help before a group quietly disappears.",
            },
          ],
        },
        {
          heading: "When to multiply a group",
          blocks: [
            {
              kind: "text",
              text: "Groups usually fail to multiply not because of size but because there is no second leader. Multiplication therefore starts months earlier, with an apprentice.",
            },
            {
              kind: "steps",
              items: [
                { title: "An apprentice exists", text: "Someone already leads part of the meetings." },
                { title: "Consistently over 12–15 people", text: "The conversation stops being shared: two or three talk, the rest listen." },
                { title: "Agree the split together", text: "Who goes where is decided with the group, not announced to it." },
                { title: "Keep the link", text: "A joint meeting each quarter removes the feeling of being torn apart." },
              ],
            },
          ],
        },
        {
          heading: "What a leader needs every week",
          blocks: [
            {
              kind: "list",
              items: [
                "Their people and contacts on a phone, not in a folder.",
                "Attendance marking in under a minute.",
                "Visibility of who missed three meetings in a row.",
                "Somewhere to record a prayer need so it does not get lost.",
              ],
            },
            {
              kind: "callout",
              title: "A rule for coordinators",
              text: "If a leader has to open a laptop to do what you ask weekly, it will not happen. Weekly asks must fit into two phone minutes.",
            },
          ],
        },
      ],
      takeaways: [
        "Minimum per group: leader, members, schedule, attendance, status.",
        "Group metrics are for support, not for grading leaders.",
        "Multiply when there is a second leader, not when the room is full.",
        "Anything weekly must be doable on a phone in two minutes.",
      ],
      faq: [
        {
          q: "How many people should a group have?",
          a: "Eight to fifteen. Fewer and two absences collapse the meeting; more and quiet members disappear from view.",
        },
        {
          q: "What about leaders who resist record keeping?",
          a: "Start with one field: attendance. Once leaders see the system handing them their absentees, the rest fills in without pressure.",
        },
        {
          q: "Should we record meeting topics?",
          a: "Not required, but useful for the next leader. One line about what you covered is enough — it is not a transcript.",
        },
      ],
      cta: {
        title: "Small groups in the system",
        text: "Membership, leaders, attendance and status for every group, plus the list of who disappeared.",
        label: "Small groups module",
        href: "/modules/groups",
      },
    },
  },
};
