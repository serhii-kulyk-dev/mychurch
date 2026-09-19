import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "komanda-bez-vyhorannia",
  category: "process",
  date: "2026-07-22",
  minutes: 7,
  related: ["planuvannia-nedilnoho-sluzhinnia", "peredacha-sluzhinnia", "stavte-tsili"],
  copy: {
    ua: {
      seoTitle: "Команда служителів без вигорання: що бачити вчасно",
      seoDescription:
        "Як помітити перевантаження служителя до того, як він піде: навантаження в графіку, перерви, ротація ролей і розмови, які треба провести вчасно.",
      title: "Команда служителів без вигорання",
      lead: "Служителі рідко йдуть через конфлікт. Найчастіше вони просто вичерпуються — тихо, після двох років без жодної вільної неділі.",
      keywords: [
        "вигорання служителів",
        "навантаження волонтерів церкви",
        "ротація в служінні",
        "як утримати волонтерів",
        "відпочинок служителя",
      ],
      problem: {
        title: "«Я більше не можу» приходить без попередження",
        text: "Насправді попередження були: три місяці поспіль у графіку, пропущені сімейні неділі, коротші відповіді в чаті. Просто ніхто не дивився на це як на сигнал.",
      },
      sections: [
        {
          heading: "Вигорання видно в цифрах раніше, ніж у розмові",
          blocks: [
            {
              kind: "list",
              title: "Сигнали, які можна побачити в графіку",
              items: [
                "Людина в графіку понад три тижні поспіль.",
                "Немає жодної вільної неділі за останні два місяці.",
                "Одна людина закриває дві ролі в одну неділю.",
                "Кількість підтверджень падає: раніше відповідав одразу, тепер мовчить.",
              ],
            },
            {
              kind: "text",
              text: "Жоден із цих сигналів сам собою не означає вигорання. Але разом вони дають привід поговорити — не з докором, а з питанням: «Тобі зараз норм?»",
            },
          ],
        },
        {
          heading: "Три правила навантаження",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Максимум поспіль", text: "Домовтесь, скільки тижнів поспіль людина може служити. Правило має бути записане й видиме, інакше його не існує." },
                { title: "Вільний сезон", text: "Раз на рік кожен служитель має право на місяць-два без графіка — без пояснень і без почуття провини." },
                { title: "Двоє на роль", text: "Кожна роль має мати щонайменше двох людей. Одна людина на ролі — це не команда, а точка відмови." },
              ],
            },
            {
              kind: "callout",
              title: "Пауза — не зрада",
              text: "Найсильніше вигорання формується там, де перерву сприймають як духовну слабкість. Якщо в церкві не можна взяти паузу, люди беруть її назавжди.",
            },
          ],
        },
        {
          heading: "Розмова, яку варто провести двічі на рік",
          blocks: [
            {
              kind: "table",
              columns: ["Питання", "Що почуєте", "Що з цим робити"],
              rows: [
                ["Що зараз найважче?", "Реальні причини втоми", "Прибрати одну задачу, а не додати підтримки словами"],
                ["Чи є щось, що ти робиш за звичкою?", "Ролі, які давно не приносять радості", "Ротація ролі всередині команди"],
                ["Скільки неділь на місяць комфортно?", "Чесне число, часто менше поточного", "Перебудувати графік під нього"],
                ["Хто міг би тебе підмінити?", "Ім'я майбутнього помічника", "Почати готувати наступника"],
              ],
            },
          ],
        },
        {
          heading: "Що має робити система, щоб допомогти",
          blocks: [
            {
              kind: "list",
              items: [
                "Показувати навантаження кожного служителя за квартал, а не за тиждень.",
                "Попереджати керівника, коли людина виходить за домовлену межу.",
                "Дозволяти позначити паузу так, щоб вона не виглядала як зникнення.",
                "Зберігати історію: хто чим служив раніше — це підказка для ротації.",
              ],
            },
            {
              kind: "text",
              text: "Мета не в тому, щоб рахувати людей. Мета в тому, щоб керівник помітив утому тоді, коли її ще можна зняти перестановкою, а не проханням «протримайся до літа».",
            },
          ],
        },
      ],
      takeaways: [
        "Вигорання видно в графіку раніше, ніж у розмові.",
        "Правило навантаження існує лише тоді, коли воно записане й видиме.",
        "Кожна роль потребує щонайменше двох людей.",
        "Церква, у якій не можна взяти паузу, втрачає людей назавжди.",
      ],
      faq: [
        {
          q: "Чи не призведе облік навантаження до формалізму?",
          a: "Формалізм починається тоді, коли цифра стає вимогою. Тут вона лише привід для розмови: система показує, кому варто зателефонувати, а не ставить оцінку.",
        },
        {
          q: "Що робити, якщо людей мало й ротація неможлива?",
          a: "Тоді чесніше зменшити обсяг служіння, ніж вичерпати команду. Одна якісна неділя на місяць краща за чотири, після яких ніхто не залишається.",
        },
        {
          q: "Як повернути людину після вигорання?",
          a: "Через маленьку роль з чіткими межами й датою закінчення. Повернення «як раніше» майже завжди закінчується повторним відходом.",
        },
      ],
      cta: {
        title: "Навантаження команди — видно одразу",
        text: "Історія змін, попередження про перевантаження й ролі з резервом.",
        label: "Модуль «Служіння»",
        href: "/modules/ministries",
      },
    },
    en: {
      seoTitle: "Volunteer teams without burnout: what to watch",
      seoDescription:
        "How to notice an overloaded volunteer before they quit: rota load, breaks, role rotation and the conversations worth having twice a year.",
      title: "Volunteer teams without burnout",
      lead: "Volunteers rarely leave over conflict. Most simply run out — quietly, after two years without a single free Sunday.",
      keywords: [
        "church volunteer burnout",
        "volunteer workload church",
        "rotating ministry roles",
        "volunteer retention church",
        "serving breaks church",
      ],
      problem: {
        title: "I cannot do this any more arrives without warning",
        text: "There were warnings: three months straight on the rota, missed family Sundays, shorter replies in the chat. Nobody read them as signals.",
      },
      sections: [
        {
          heading: "Burnout shows in the numbers first",
          blocks: [
            {
              kind: "list",
              title: "Signals visible in a rota",
              items: [
                "Rostered more than three weeks in a row.",
                "No free Sunday in the last two months.",
                "One person covering two roles on the same Sunday.",
                "Confirmations slowing down: instant replies become silence.",
              ],
            },
            {
              kind: "text",
              text: "No single signal means burnout. Together they are a reason to ask, without reproach: how are you doing right now?",
            },
          ],
        },
        {
          heading: "Three load rules",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "A maximum in a row", text: "Agree how many consecutive weeks anyone may serve. Unless the rule is written and visible, it does not exist." },
                { title: "A free season", text: "Once a year everyone may take a month or two off the rota, with no explanation and no guilt." },
                { title: "Two people per role", text: "Every role needs at least two names. One person per role is a single point of failure, not a team." },
              ],
            },
            {
              kind: "callout",
              title: "A pause is not betrayal",
              text: "The worst burnout grows where taking a break is read as spiritual weakness. If a church makes pausing impossible, people pause permanently.",
            },
          ],
        },
        {
          heading: "The conversation worth having twice a year",
          blocks: [
            {
              kind: "table",
              columns: ["Question", "What you hear", "What to do"],
              rows: [
                ["What is hardest right now?", "The real source of tiredness", "Remove one task rather than offer encouragement"],
                ["What do you do out of habit?", "Roles that stopped giving joy", "Rotate the role inside the team"],
                ["How many Sundays a month feel right?", "An honest number, often lower", "Rebuild the rota around it"],
                ["Who could cover for you?", "The name of a future apprentice", "Start preparing them"],
              ],
            },
          ],
        },
        {
          heading: "What the system should do",
          blocks: [
            {
              kind: "list",
              items: [
                "Show each volunteer's load by quarter, not by week.",
                "Warn the lead when someone passes the agreed limit.",
                "Let a pause be recorded so it does not look like disappearing.",
                "Keep history of past roles as a hint for rotation.",
              ],
            },
            {
              kind: "text",
              text: "The aim is not to count people. It is for the lead to notice tiredness while it can still be solved by a change of rota rather than a plea to hold on until summer.",
            },
          ],
        },
      ],
      takeaways: [
        "Burnout appears in the rota before it appears in conversation.",
        "A load rule exists only when written and visible.",
        "Every role needs at least two people.",
        "A church where you cannot pause loses people permanently.",
      ],
      faq: [
        {
          q: "Will tracking load make things formal?",
          a: "Formality starts when a number becomes a demand. Here it is only a prompt: the system suggests who to call, it does not grade anyone.",
        },
        {
          q: "What if we are too few to rotate?",
          a: "Then reduce the scope honestly rather than exhaust the team. One good Sunday a month beats four that leave nobody standing.",
        },
        {
          q: "How do we bring someone back after burnout?",
          a: "With a small role, clear limits and an end date. Returning to exactly how it was almost always ends in leaving again.",
        },
      ],
      cta: {
        title: "Team load, visible at a glance",
        text: "Shift history, overload warnings and roles with cover.",
        label: "Ministries module",
        href: "/modules/ministries",
      },
    },
  },
};
