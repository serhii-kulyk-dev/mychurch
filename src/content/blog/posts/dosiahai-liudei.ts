import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "dosiahai-liudei",
  category: "people",
  date: "2026-09-15",
  minutes: 9,
  featured: true,
  related: ["yak-ne-zahubyty-liudei-u-velykii-tserkvi", "yak-vesty-liudei", "analizuite"],
  copy: {
    ua: {
      seoTitle: "Досягай людей: як церкві не втрачати зв'язок з людьми",
      seoDescription:
        "Що означає «досягати людей» на практиці: як побачити, хто зник, хто новий і хто перевантажений, і встигнути відреагувати раніше, ніж людина піде.",
      title: "Досягай людей і що для цього потрібно",
      lead: "Досягати людей — це не про гучні події. Це про те, щоб щотижня знати, кому саме потрібен дзвінок, і щоб це знання не залежало від пам'яті однієї людини.",
      keywords: [
        "як не втрачати людей у церкві",
        "робота з новими людьми в церкві",
        "догляд за членами церкви",
        "система обліку людей у церкві",
        "як повернути людину в церкву",
      ],
      problem: {
        title: "Про людину дізнаються, коли вона вже пішла",
        text: "Людина перестає приходити в середині лютого. Хтось згадує про неї в травні: «А де вона?». Три місяці ніхто не написав — не тому що байдуже, а тому що ніде не було видно, що вона зникла.",
      },
      sections: [
        {
          heading: "Досягати — це звичка, а не подія",
          blocks: [
            {
              kind: "text",
              text: "Церква рідко втрачає людей одномоментно. Спочатку людина пропускає одну неділю, потім другу, потім перестає відповідати в групі. Кожен окремий крок виглядає дрібницею — і саме тому його ніхто не помічає. Помічають уже підсумок.",
            },
            {
              kind: "text",
              text: "Тому «досягати людей» — це не разова євангелізаційна кампанія, а щотижневий цикл: побачити сигнал, взяти відповідального, зробити крок, зафіксувати результат. Цикл має бути настільки простим, щоб він переживав відпустки, зміну лідерів і завантажений грудень.",
            },
            { kind: "quote", text: "Людину втрачають не за один день, а за десять непоміченим тижнів." },
          ],
        },
        {
          heading: "Три місця, де церква втрачає людей",
          blocks: [
            {
              kind: "list",
              title: "Витоки, які повторюються майже в кожній громаді",
              items: [
                "Новий гість. Заповнив анкету на служінні, аркуш поїхав у теці адміністратора, ніхто не зателефонував протягом тижня — і другого разу людина вже не прийшла.",
                "Тихий член церкви. Ходить роками, ні в якій групі не рахується, тому його відсутність не видно в жодному списку.",
                "Служитель, що вигорів. Стоїть у графіку щонеділі півтора року. Ніхто не бачить цього навантаження цілісно, бо графік ведуть у трьох різних чатах.",
              ],
            },
            {
              kind: "text",
              text: "Спільне в усіх трьох випадках одне: інформація існувала, але не була в тому місці, де ухвалюють рішення. Її не бракувало — вона просто лежала в чужому блокноті.",
            },
          ],
        },
        {
          heading: "Які сигнали варто бачити щотижня",
          blocks: [
            {
              kind: "list",
              items: [
                "Хто був уперше за останні сім днів і хто з ним уже поговорив.",
                "Хто не був три тижні поспіль, хоча раніше ходив стабільно.",
                "Хто не належить до жодної малої групи більше місяця після приходу.",
                "Хто служить без перерви більше ніж певну кількість тижнів поспіль.",
                "Хто залишив запит про молитву чи допомогу і не отримав відповіді.",
              ],
            },
            {
              kind: "callout",
              title: "Правило одного екрана",
              text: "Якщо ці п'ять відповідей не вміщаються на одному екрані, лідери їх не дивитимуться. Не тому що не хочуть — тому що збирати їх вручну довше, ніж триває пауза між служіннями.",
            },
          ],
        },
        {
          heading: "Як побудувати цикл уваги за чотири кроки",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Один список людей",
                  text: "Спочатку — єдиний перелік людей і сімей, у якому видно контакт, групу, служіння й дату останнього відвідування. Доки списків кілька, будь-яка аналітика буде суперечити сама собі.",
                },
                {
                  title: "Фіксація присутності",
                  text: "Відвідуваність відмічає лідер групи або служитель на вході — за хвилину, з телефона. Це єдине регулярне зусилля, якого вимагає весь цикл.",
                },
                {
                  title: "Автоматичний сигнал",
                  text: "Система сама складає список тих, хто зник або не має групи, і показує його відповідальному. Людина не шукає — людина реагує.",
                },
                {
                  title: "Зафіксований крок",
                  text: "Подзвонили, написали, зустрілися — запис лишається в картці людини. Наступний лідер почне не з нуля, а з того місця, де зупинився попередній.",
                },
              ],
            },
          ],
        },
        {
          heading: "Що змінюється, коли цикл працює",
          blocks: [
            {
              kind: "table",
              columns: ["Ситуація", "Як зазвичай", "Коли є система"],
              rows: [
                ["Прийшов новий гість", "Анкета в теці, дзвінок — якщо хтось згадає", "Картка людини створена, відповідальний призначений того ж дня"],
                ["Людина зникла на місяць", "Помічають випадково, через розмову", "Потрапляє в список уваги на третьому тижні"],
                ["Лідер групи змінився", "Історія стосунків залишилась у старого лідера", "Історія в картці людини й видима новому лідеру"],
                ["Пастор питає, як справи в громаді", "Готують відповідь кілька днів", "Звіт відкривають на телефоні за хвилину"],
              ],
            },
          ],
        },
        {
          heading: "З чого почати наступної неділі",
          blocks: [
            {
              kind: "list",
              items: [
                "Зведіть людей в один список — навіть якщо він поки неідеальний.",
                "Домовтесь, хто саме відмічає присутність у кожній групі й на кожному служінні.",
                "Оберіть один сигнал, на який реагуєте цього місяця: «не був три тижні». Тільки один.",
                "Назвіть відповідального за цей сигнал поіменно. Не «служіння турботи», а конкретну людину.",
              ],
            },
            {
              kind: "text",
              text: "Коли один сигнал працює три місяці поспіль, додайте другий. Церкви ламаються не на складних системах, а на спробі запустити десять звичок одночасно.",
            },
          ],
        },
      ],
      takeaways: [
        "Людей втрачають поступово, тому реагувати треба на ранні сигнали, а не на факт зникнення.",
        "Один список людей важливіший за будь-який звіт: доки списків кілька, цифри суперечать одна одній.",
        "Сигнал без імені відповідального не працює.",
        "Починайте з однієї звички, а не з десяти.",
      ],
      faq: [
        {
          q: "З чого почати, якщо дані про людей розкидані по таблицях і чатах?",
          a: "З імпорту. Зведіть наявні таблиці в один список — навіть з дублями й порожніми полями. Далі систему чистять поступово: кожен лідер виправляє свою групу, а не один адміністратор усі дві тисячі записів.",
        },
        {
          q: "Скільки часу займає відмітка відвідуваності?",
          a: "Близько хвилини на групу, якщо це робить лідер зі свого телефона під час зустрічі. Довше стає тоді, коли відмітку переносять на наступний день і доводиться згадувати, хто був.",
        },
        {
          q: "Чи не перетворює це церкву на контроль за людьми?",
          a: "Різниця в тому, що робиться з даними. Контроль — це коли цифрами звітують. Турбота — це коли за цифрою одразу йде дзвінок конкретній людині. Доступ до карток обмежується ролями, тому бачить лише той, хто справді опікується.",
        },
      ],
      cta: {
        title: "Подивіться, як це виглядає в модулі «Люди»",
        text: "Картка людини, історія відвідувань, група, служіння й останній контакт — на одному екрані.",
        label: "Модуль «Люди»",
        href: "/modules/people",
      },
    },
    en: {
      seoTitle: "Reach people: how a church keeps the connection alive",
      seoDescription:
        "What reaching people looks like in practice: seeing who disappeared, who is new and who is overloaded, in time to respond before they are gone.",
      title: "Reach people, and what it takes",
      lead: "Reaching people is not about big events. It is about knowing every week who needs a call, and not depending on one person's memory for it.",
      keywords: [
        "church member retention",
        "follow up with church visitors",
        "church people management",
        "church attendance tracking",
        "pastoral care system",
      ],
      problem: {
        title: "You hear about a person once they are already gone",
        text: "Someone stops coming in mid-February. In May a leader asks: where is she? Nobody wrote for three months — not from indifference, but because her absence was never visible anywhere.",
      },
      sections: [
        {
          heading: "Reaching is a habit, not an event",
          blocks: [
            {
              kind: "text",
              text: "Churches rarely lose people all at once. First a missed Sunday, then a second one, then silence in the group chat. Each step looks small, which is exactly why nobody notices it. What gets noticed is the sum.",
            },
            {
              kind: "text",
              text: "So reaching people is a weekly cycle rather than a campaign: see the signal, name the person responsible, take the step, record the result. The cycle has to be simple enough to survive holidays, leader changes and a busy December.",
            },
            { kind: "quote", text: "People are not lost in a day. They are lost over ten unnoticed weeks." },
          ],
        },
        {
          heading: "Three places where churches lose people",
          blocks: [
            {
              kind: "list",
              title: "Leaks that repeat in almost every congregation",
              items: [
                "The new guest. Filled in a card on Sunday, the card went into a folder, nobody called within the week — and there was no second visit.",
                "The quiet member. Attends for years, belongs to no group, so their absence shows up on no list.",
                "The burnt-out volunteer. On the rota every Sunday for eighteen months, because the rota lives in three separate chats and nobody sees the whole load.",
              ],
            },
            {
              kind: "text",
              text: "All three share one cause: the information existed, but not in the place where decisions are made. It was not missing — it was in someone else's notebook.",
            },
          ],
        },
        {
          heading: "The signals worth seeing every week",
          blocks: [
            {
              kind: "list",
              items: [
                "Who came for the first time in the last seven days, and who has spoken with them.",
                "Who has missed three weeks in a row after attending steadily.",
                "Who has been without a small group for more than a month.",
                "Who has served without a break for longer than your agreed limit.",
                "Who left a prayer or help request that nobody answered.",
              ],
            },
            {
              kind: "callout",
              title: "The one-screen rule",
              text: "If those five answers do not fit on one screen, leaders will not look at them — not out of unwillingness, but because collecting them by hand takes longer than the gap between services.",
            },
          ],
        },
        {
          heading: "Building the cycle in four steps",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "One list of people",
                  text: "Start with a single register of people and families showing contact, group, ministry and last attendance. While there are several lists, every report contradicts the others.",
                },
                {
                  title: "Record attendance",
                  text: "The group leader or volunteer marks it at the door, in a minute, from a phone. That is the only recurring effort the whole cycle needs.",
                },
                {
                  title: "Automatic signal",
                  text: "The system builds the list of people who disappeared or have no group and shows it to whoever is responsible. Nobody searches; they respond.",
                },
                {
                  title: "Recorded step",
                  text: "A call, a message, a meeting — the note stays on the person's card, so the next leader starts where the previous one stopped.",
                },
              ],
            },
          ],
        },
        {
          heading: "What changes once the cycle runs",
          blocks: [
            {
              kind: "table",
              columns: ["Situation", "Usually", "With a system"],
              rows: [
                ["A new guest arrives", "A card in a folder, a call if someone remembers", "A person record and an owner assigned the same day"],
                ["Someone is away for a month", "Noticed by accident, in conversation", "On the attention list in week three"],
                ["A group leader changes", "The relationship history leaves with the old leader", "The history stays on the card, visible to the new leader"],
                ["The pastor asks how the church is doing", "Days of preparing an answer", "The report opens on a phone in a minute"],
              ],
            },
          ],
        },
        {
          heading: "Where to start next Sunday",
          blocks: [
            {
              kind: "list",
              items: [
                "Merge people into one list, even an imperfect one.",
                "Agree who marks attendance in each group and each ministry.",
                "Pick one signal to act on this month: missed three weeks. Only one.",
                "Name the owner of that signal by name, not by committee.",
              ],
            },
            {
              kind: "text",
              text: "Once one signal has worked for three months, add the second. Churches do not fail at complex systems; they fail at launching ten habits at once.",
            },
          ],
        },
      ],
      takeaways: [
        "People leave gradually, so respond to early signals rather than to the fact of disappearance.",
        "One list of people matters more than any report.",
        "A signal without a named owner does not work.",
        "Start with one habit, not ten.",
      ],
      faq: [
        {
          q: "Where do we start if the data is spread across spreadsheets and chats?",
          a: "With an import. Merge the existing tables into one list, duplicates and gaps included. The cleanup is then shared: each leader fixes their own group instead of one admin fixing two thousand records.",
        },
        {
          q: "How long does marking attendance take?",
          a: "About a minute per group when the leader does it on their phone during the meeting. It takes longer when it is postponed to the next day and everyone has to remember who was there.",
        },
        {
          q: "Does this turn the church into surveillance?",
          a: "The difference is what happens with the data. Control is when numbers become a report. Care is when a number is followed by a call to a specific person. Access is limited by role, so only those who actually care can see it.",
        },
      ],
      cta: {
        title: "See how this looks in the People module",
        text: "A person card with attendance history, group, ministry and last contact on one screen.",
        label: "People module",
        href: "/modules/people",
      },
    },
  },
};
