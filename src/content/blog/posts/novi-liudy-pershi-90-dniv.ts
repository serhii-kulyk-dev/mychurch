import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "novi-liudy-pershi-90-dniv",
  category: "people",
  date: "2026-07-30",
  minutes: 7,
  related: ["yak-vesty-liudei", "zaiavky-ta-zvernennia", "mali-hrupy"],
  copy: {
    ua: {
      seoTitle: "Нова людина в церкві: перші 90 днів",
      seoDescription:
        "Що має статися в перший тиждень, перший місяць і перші три місяці після приходу нової людини — і хто саме за це відповідає.",
      title: "Нова людина в церкві: перші 90 днів",
      lead: "Рішення, чи залишиться людина, ухвалюється не на служінні, а між служіннями. Перші три місяці визначають майже все.",
      keywords: [
        "робота з новими людьми в церкві",
        "адаптація нових членів церкви",
        "що робити з гостями церкви",
        "анкета гостя церква",
        "перший візит у церкву",
      ],
      problem: {
        title: "Приходить багато, залишається мало",
        text: "За рік церква бачить сотню нових облич, а громада не росте. Проблема не в тому, що люди не приходять. Проблема в тому, що ніхто не веде їх у перші дев'яносто днів.",
      },
      sections: [
        {
          heading: "Перший тиждень: щоб людина мала ім'я",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "День 0", text: "Знайомство і контакт. Анкета, бот або просто розмова — важливо, щоб контакт потрапив у систему того ж дня, а не в кишеню." },
                { title: "День 1–3", text: "Особисте повідомлення від конкретної людини, а не розсилка. Одне питання, а не запрошення на п'ять подій." },
                { title: "День 4–7", text: "Запрошення на щось конкретне: групу, каву після служіння, зустріч для нових. Конкретна дата й місце." },
              ],
            },
            {
              kind: "callout",
              title: "Одне запрошення за раз",
              text: "Список із семи можливостей читається як «розберись сам». Одне конкретне запрошення дає в рази більше відгуку.",
            },
          ],
        },
        {
          heading: "Перший місяць: щоб було своє коло",
          blocks: [
            {
              kind: "text",
              text: "Головна мета першого місяця — не членство й не служіння, а два-три знайомих обличчя. Людина залишається там, де її чекають конкретні люди, а не там, де сподобалась проповідь.",
            },
            {
              kind: "list",
              items: [
                "Знайомство з лідером малої групи особисто, а не посилання на список.",
                "Розмова про історію людини: звідки прийшла, що шукає, чи є діти.",
                "Відповідь на побутові питання: де паркуватись, куди вести дитину, коли служіння.",
                "Запис у картці: з ким уже познайомилась, щоб наступний не починав спочатку.",
              ],
            },
          ],
        },
        {
          heading: "Дев'яносто днів: щоб з'явилось місце",
          blocks: [
            {
              kind: "text",
              text: "До кінця третього місяця має бути зрозуміло, де людина: у групі, у служінні, на курсі — або ніде. Останнє теж відповідь, і саме вона потребує реакції.",
            },
            {
              kind: "table",
              columns: ["Термін", "Що має бути", "Хто відповідає"],
              rows: [
                ["7 днів", "Контакт у системі, перше повідомлення", "Служіння зустрічі"],
                ["30 днів", "Знайомство з групою, два-три знайомих", "Координатор груп"],
                ["60 днів", "Участь у групі або курсі", "Лідер групи"],
                ["90 днів", "Місце в громаді визначене", "Пастор або координатор"],
              ],
            },
          ],
        },
        {
          heading: "Як не втратити на межах",
          blocks: [
            {
              kind: "list",
              items: [
                "Літо й свята: люди приходять, а групи на паузі. Заплануйте, хто підхоплює новачків у ці періоди.",
                "Відпустка відповідального: у кожного відповідального має бути замісник, інакше тижнева пауза стає місячною.",
                "Друге коло: людина, яка була двічі й зникла, часто не потребує нічого, крім одного повідомлення.",
              ],
            },
            {
              kind: "text",
              text: "Найдешевший спосіб зростати — не втрачати тих, хто вже прийшов. Це дешевше за будь-яку кампанію.",
            },
          ],
        },
      ],
      takeaways: [
        "Перший контакт — протягом тижня, одне конкретне запрошення, не список.",
        "Мета першого місяця — два-три знайомих обличчя, а не членство.",
        "На 90-й день має бути відповідь, де людина, навіть якщо ця відповідь «ніде».",
        "Кожен відповідальний потребує замісника, інакше літо з'їдає новачків.",
      ],
      faq: [
        {
          q: "Чи потрібна анкета гостя?",
          a: "Потрібен контакт, а не анкета. Ім'я й спосіб зв'язку — мінімум. Довга анкета на першому візиті частіше відлякує, ніж допомагає.",
        },
        {
          q: "Хто має писати першим — пастор чи лідер?",
          a: "Той, хто реально зможе підтримати розмову далі. Повідомлення від пастора приємне, але якщо продовження немає, воно нічого не змінює.",
        },
        {
          q: "Що робити, якщо людина не відповідає?",
          a: "Одне повторне повідомлення через тиждень і запис у картці. Далі — не тиснути; людина може повернутись через рік, і історія має бути на місці.",
        },
      ],
      cta: {
        title: "Онбординг нових людей",
        text: "Терміни, відповідальні й нагадування на кожному кроці перших дев'яноста днів.",
        label: "Модуль «Онбординг»",
        href: "/modules/onboarding",
      },
    },
    en: {
      seoTitle: "A new person in church: the first 90 days",
      seoDescription:
        "What has to happen in the first week, the first month and the first three months after someone arrives — and who is responsible for each part.",
      title: "A new person in church: the first 90 days",
      lead: "Whether someone stays is decided between services, not during them. The first three months settle almost everything.",
      keywords: [
        "church guest follow up",
        "assimilating new church members",
        "first time visitor church",
        "connection card church",
        "newcomer onboarding church",
      ],
      problem: {
        title: "Many arrive, few stay",
        text: "A hundred new faces a year and a congregation that does not grow. The problem is not that people do not come; it is that nobody walks with them through the first ninety days.",
      },
      sections: [
        {
          heading: "Week one: give the person a name",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Day 0", text: "A greeting and a contact. A card, a bot or a conversation — what matters is that the contact reaches the system that day, not a pocket." },
                { title: "Day 1–3", text: "A personal message from a specific person, not a broadcast. One question, not five invitations." },
                { title: "Day 4–7", text: "An invitation to something concrete: a group, coffee after the service, a newcomers' meeting, with a date and a place." },
              ],
            },
            {
              kind: "callout",
              title: "One invitation at a time",
              text: "A list of seven options reads as figure it out yourself. One concrete invitation gets far more response.",
            },
          ],
        },
        {
          heading: "Month one: a circle of their own",
          blocks: [
            {
              kind: "text",
              text: "The goal of the first month is not membership or serving but two or three familiar faces. People stay where specific people expect them, not where the sermon was good.",
            },
            {
              kind: "list",
              items: [
                "A personal introduction to a group leader, not a link to a list.",
                "A conversation about their story: where they came from, what they are looking for, whether they have children.",
                "Answers to practical questions: parking, children, service times.",
                "A note on the card of who they already met, so the next person does not start over.",
              ],
            },
          ],
        },
        {
          heading: "Ninety days: a place in the church",
          blocks: [
            {
              kind: "text",
              text: "By the end of month three it should be clear where the person belongs: a group, a ministry, a course — or nowhere. Nowhere is also an answer, and the one that needs a response.",
            },
            {
              kind: "table",
              columns: ["By", "What should exist", "Owner"],
              rows: [
                ["7 days", "Contact in the system, first message", "Welcome team"],
                ["30 days", "Introduced to a group, two or three acquaintances", "Group coordinator"],
                ["60 days", "Taking part in a group or course", "Group leader"],
                ["90 days", "A defined place in the church", "Pastor or coordinator"],
              ],
            },
          ],
        },
        {
          heading: "Where people slip through",
          blocks: [
            {
              kind: "list",
              items: [
                "Summer and holidays: people arrive while groups pause. Decide in advance who carries newcomers then.",
                "Holidays of the owner: every owner needs a deputy, or a week's gap becomes a month.",
                "The second visit: someone who came twice and vanished often needs nothing more than one message.",
              ],
            },
            {
              kind: "text",
              text: "The cheapest way to grow is not losing those who already came.",
            },
          ],
        },
      ],
      takeaways: [
        "First contact within a week, with one concrete invitation.",
        "The first month aims at two or three familiar faces, not membership.",
        "By day 90 there must be an answer about where the person belongs.",
        "Every owner needs a deputy, or summer eats your newcomers.",
      ],
      faq: [
        {
          q: "Do we need a guest card?",
          a: "You need a contact, not a form. A name and a way to reach them is the minimum; a long form on a first visit puts people off more often than it helps.",
        },
        {
          q: "Who should write first, the pastor or a leader?",
          a: "Whoever can actually continue the conversation. A message from the pastor is nice, but without a follow-up it changes nothing.",
        },
        {
          q: "What if they do not reply?",
          a: "One follow-up a week later and a note on the card. Then stop pushing — people come back a year later, and the history should be there when they do.",
        },
      ],
      cta: {
        title: "Onboarding new people",
        text: "Deadlines, owners and reminders at every step of the first ninety days.",
        label: "Onboarding module",
        href: "/modules/onboarding",
      },
    },
  },
};
