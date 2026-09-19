import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "oblik-vidviduvanosti",
  category: "people",
  date: "2026-08-20",
  minutes: 7,
  related: ["analizuite", "mali-hrupy", "dosiahai-liudei"],
  copy: {
    ua: {
      seoTitle: "Облік відвідуваності в церкві: як вести без паперу",
      seoDescription:
        "Як рахувати відвідуваність служінь і малих груп так, щоб цифри були правдиві: хто відмічає, коли, що робити з гостями та як користуватись результатом.",
      title: "Облік відвідуваності: як рахувати без паперу",
      lead: "Відвідуваність — найдешевший сигнал, який має церква. Він коштує одну хвилину на тиждень і показує, з ким щось відбувається, раніше за будь-яку розмову.",
      keywords: [
        "облік відвідуваності в церкві",
        "як рахувати відвідуваність служіння",
        "відмітка присутності мала група",
        "звіт про відвідуваність церкви",
        "програма для обліку відвідування",
      ],
      problem: {
        title: "Цифри є, але їм не вірять",
        text: "Один рахує по головах у залі, другий — по списку групи, третій пише в зошиті. У підсумку в трьох звітах три різні числа, і жодне не можна порівняти з минулим місяцем.",
      },
      sections: [
        {
          heading: "Що саме рахувати",
          blocks: [
            {
              kind: "text",
              text: "Церкви плутають дві різні речі: загальну кількість людей у залі й персональну присутність. Перше потрібне для приміщення й логістики, друге — для турботи. Рахувати варто обидва, але не змішувати в одному числі.",
            },
            {
              kind: "table",
              columns: ["Тип обліку", "Для чого", "Хто веде"],
              rows: [
                ["Кількість у залі", "Місткість, кількість служінь, ресурси", "Черговий або служіння зустрічі"],
                ["Персональна присутність", "Турбота: хто зник", "Лідер малої групи, керівник служіння"],
                ["Гості", "Робота з новими", "Служіння зустрічі"],
                ["Діти", "Безпека й групи за віком", "Служіння дітей"],
              ],
            },
          ],
        },
        {
          heading: "Хто відмічає і коли",
          blocks: [
            {
              kind: "text",
              text: "Правило просте: відмічає той, хто бачить людей в обличчя, і робить це під час зустрічі, а не ввечері вдома. Кожна година затримки з'їдає точність: через день лідер згадує 80% присутніх, через тиждень — половину.",
            },
            {
              kind: "steps",
              items: [
                { title: "Мала група", text: "Лідер відмічає з телефона на початку зустрічі — це швидше, ніж перекличка." },
                { title: "Служіння", text: "Керівник відмічає команду зміни: хто був, хто підмінив, кого не було." },
                { title: "Загальне служіння", text: "Черговий вносить загальну кількість і кількість гостей одразу після початку." },
                { title: "Діти", text: "Реєстрація на вході з прив'язкою до батьків — це водночас і облік, і безпека." },
              ],
            },
          ],
        },
        {
          heading: "Три помилки, через які дані стають марними",
          blocks: [
            {
              kind: "list",
              items: [
                "Відмічають «приблизно». Одна приблизна відмітка ламає всю динаміку за квартал.",
                "Фіксують тільки присутніх, не фіксуючи, кого не було. Відсутність — це і є сигнал.",
                "Дані нікому не показують. Якщо лідер ніколи не бачить результату своєї відмітки, він перестає відмічати за місяць.",
              ],
            },
            {
              kind: "callout",
              title: "Зворотний зв'язок обов'язковий",
              text: "Найнадійніший спосіб зберегти регулярність відміток — щотижня повертати лідеру короткий підсумок його групи: троє не були, одна людина не була тричі поспіль.",
            },
          ],
        },
        {
          heading: "Що робити з результатом",
          blocks: [
            {
              kind: "list",
              items: [
                "Список тих, хто не був три зустрічі поспіль, — на щотижневу розмову лідерів.",
                "Порівняння сезонів: літо й грудень завжди нижчі, тому порівнюйте з тим самим періодом торік, а не з минулим місяцем.",
                "Частка людей у малих групах від загальної кількості — головна метрика залученості.",
                "Стабільність команд служінь: хто виходить занадто часто, а хто зник із графіка.",
              ],
            },
            {
              kind: "text",
              text: "Відвідуваність не є метою. Це індикатор: він не каже, що робити, але точно каже, з ким варто поговорити цього тижня.",
            },
          ],
        },
      ],
      takeaways: [
        "Загальна кількість і персональна присутність — різні цифри з різним призначенням.",
        "Відмічає той, хто бачить людей, і робить це під час зустрічі.",
        "Відсутність — це сигнал, тому фіксувати треба обидві сторони.",
        "Лідер, який не бачить результату, перестає відмічати.",
      ],
      faq: [
        {
          q: "Чи не буде людям незручно, що їх «відмічають»?",
          a: "Незручно стає тоді, коли з цього роблять публічний рейтинг. Якщо відмітка — внутрішній інструмент турботи й доступ до неї має лише лідер групи, питань зазвичай не виникає.",
        },
        {
          q: "Як рахувати відвідуваність онлайн-служіння?",
          a: "Окремою метрикою і без спроб додати її до залу. Онлайн-перегляди й фізична присутність поводяться по-різному, тому сума нічого не означає.",
        },
        {
          q: "Що робити з людьми, які ходять нерегулярно за своєю природою?",
          a: "Для них має сенс не «пропустив тиждень», а зміна звичного ритму: людина, яка завжди була раз на місяць і зникла на три, потребує уваги так само.",
        },
      ],
      cta: {
        title: "Відвідуваність у системі",
        text: "Відмітка за хвилину з телефона, історія в картці людини й автоматичний список тих, хто зник.",
        label: "Модуль «Аналітика та звіти»",
        href: "/modules/analytics",
      },
    },
    en: {
      seoTitle: "Church attendance tracking without paper",
      seoDescription:
        "How to count attendance at services and small groups so the numbers are trustworthy: who marks it, when, what to do with guests and how to use the result.",
      title: "Attendance tracking without paper",
      lead: "Attendance is the cheapest signal a church has. It costs a minute a week and shows that something is happening with someone long before any conversation does.",
      keywords: [
        "church attendance tracking",
        "small group attendance app",
        "how to count church attendance",
        "church attendance report",
        "attendance software for churches",
      ],
      problem: {
        title: "There are numbers, but nobody trusts them",
        text: "One person counts heads in the room, another goes by the group list, a third writes in a notebook. Three reports, three different numbers, none comparable to last month.",
      },
      sections: [
        {
          heading: "What exactly to count",
          blocks: [
            {
              kind: "text",
              text: "Churches confuse two different things: how many people were in the room, and who personally was there. The first is for logistics, the second is for care. Track both, but never merge them into one number.",
            },
            {
              kind: "table",
              columns: ["Type", "Purpose", "Who records it"],
              rows: [
                ["Headcount", "Capacity, number of services, resources", "Duty volunteer or welcome team"],
                ["Personal attendance", "Care: who disappeared", "Group leader, ministry lead"],
                ["Guests", "Follow-up with new people", "Welcome team"],
                ["Children", "Safety and age groups", "Kids ministry"],
              ],
            },
          ],
        },
        {
          heading: "Who marks it, and when",
          blocks: [
            {
              kind: "text",
              text: "The rule is simple: whoever sees the faces marks it, during the meeting rather than at home in the evening. Every hour of delay costs accuracy — after a day a leader recalls about 80% of those present, after a week about half.",
            },
            {
              kind: "steps",
              items: [
                { title: "Small group", text: "The leader marks it on a phone at the start — faster than a roll call." },
                { title: "Ministry team", text: "The lead marks the shift: who served, who swapped in, who was missing." },
                { title: "Main service", text: "The duty volunteer enters the headcount and guest count right after the start." },
                { title: "Children", text: "Check-in at the door linked to a parent — record keeping and safety in one action." },
              ],
            },
          ],
        },
        {
          heading: "Three mistakes that make data useless",
          blocks: [
            {
              kind: "list",
              items: [
                "Marking approximately. One rough entry ruins a quarter of trend data.",
                "Recording only who came. Absence is the signal.",
                "Never showing the data back. A leader who never sees the result stops marking within a month.",
              ],
            },
            {
              kind: "callout",
              title: "Feedback is not optional",
              text: "The most reliable way to keep marking regular is a weekly summary back to the leader: three were away, one has missed three in a row.",
            },
          ],
        },
        {
          heading: "What to do with the result",
          blocks: [
            {
              kind: "list",
              items: [
                "The list of people absent three meetings running goes into the weekly leaders' conversation.",
                "Compare seasons: summer and December are always lower, so compare with the same period last year.",
                "Share of people in small groups — the key engagement metric.",
                "Ministry team stability: who serves too often, who dropped off the rota.",
              ],
            },
            {
              kind: "text",
              text: "Attendance is not a goal. It is an indicator: it does not tell you what to do, but it does tell you who to talk to this week.",
            },
          ],
        },
      ],
      takeaways: [
        "Headcount and personal attendance are different numbers with different uses.",
        "Whoever sees the people marks it, during the meeting.",
        "Absence is the signal, so record both sides.",
        "A leader who never sees the result stops recording.",
      ],
      faq: [
        {
          q: "Will people feel uncomfortable being marked?",
          a: "Discomfort comes from turning it into a public ranking. When it is an internal care tool visible only to the group leader, it rarely raises questions.",
        },
        {
          q: "How do we count online attendance?",
          a: "As a separate metric, never added to the room. Views and physical presence behave differently, so the sum means nothing.",
        },
        {
          q: "What about people who are naturally irregular?",
          a: "For them the signal is not a missed week but a change of rhythm: someone who always came monthly and has been gone three months needs attention just as much.",
        },
      ],
      cta: {
        title: "Attendance in the system",
        text: "A minute on a phone, history on the person card, and an automatic list of who disappeared.",
        label: "Analytics and reports",
        href: "/modules/analytics",
      },
    },
  },
};
