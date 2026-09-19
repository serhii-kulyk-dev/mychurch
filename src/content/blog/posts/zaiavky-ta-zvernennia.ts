import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "zaiavky-ta-zvernennia",
  category: "people",
  date: "2026-09-01",
  minutes: 7,
  related: ["dani-v-riznykh-mistsiakh", "yak-nalashtuvaty-ai-ahenta", "yak-vesty-liudei"],
  copy: {
    ua: {
      seoTitle: "Заявки в церкві: як не втратити жодне звернення",
      seoDescription:
        "Молитовні потреби, запис на курс, прохання про допомогу, заявки на приміщення — як зібрати їх в одне місце й довести кожну до відповіді.",
      title: "Заявки: як не втратити жодне звернення",
      lead: "Звернення приходять з п'яти сторін: записка після служіння, повідомлення в телеграмі, дзвінок, форма на сайті, «передай пастору». Втрачається те, що ніде не зафіксоване.",
      keywords: [
        "облік звернень у церкві",
        "молитовні потреби облік",
        "заявки на приміщення церкви",
        "форма запису на курс церква",
        "як організувати роботу зі зверненнями",
      ],
      problem: {
        title: "«Я писав, але мені ніхто не відповів»",
        text: "Найболючіша фраза для церкви. Майже завжди за нею стоїть не байдужість, а те, що звернення прийшло в особисті повідомлення людині, яка була у відпустці.",
      },
      sections: [
        {
          heading: "Чому звернення губляться",
          blocks: [
            {
              kind: "list",
              items: [
                "Канали різні, місце зберігання одне — чиясь голова.",
                "Немає статусу: неможливо сказати, звернення вже опрацьоване чи ще ні.",
                "Немає відповідального: «хтось же відповість» означає «ніхто».",
                "Немає терміну: звернення не протухає само, воно просто перестає бути актуальним для людини.",
              ],
            },
            {
              kind: "quote",
              text: "Звернення, у якого немає статусу й відповідального, технічно вже втрачене.",
            },
          ],
        },
        {
          heading: "Один вхід замість п'яти",
          blocks: [
            {
              kind: "text",
              text: "Не потрібно змушувати людей писати «правильним каналом» — це не спрацює. Потрібно, щоб усі канали приводили в один список. Форма на сайті, повідомлення боту, записка, яку адміністратор заводить руками, — усе це має ставати заявкою з номером, темою й відповідальним.",
            },
            {
              kind: "steps",
              items: [
                { title: "Заведіть типи заявок", text: "Молитва, допомога, запис на курс, бронювання залу, технічне питання. П'ять-сім типів, не більше." },
                { title: "Кожному типу — відповідального", text: "Не служіння, а людину. І замісника на час відпустки." },
                { title: "Домовтесь про терміни", text: "Наприклад: молитовна потреба — того ж дня, побутове питання — три робочі дні." },
                { title: "Закривайте заявку відповіддю", text: "Заявка закрита не тоді, коли про неї забули, а коли людина отримала відповідь." },
              ],
            },
          ],
        },
        {
          heading: "Дошка, на якій видно все",
          blocks: [
            {
              kind: "text",
              text: "Найзручніший вигляд для заявок — колонки за станом: нова, в роботі, чекає відповіді, закрита. Кожна картка — людина й суть. Тоді одразу видно затори: якщо в колонці «нова» тиждень висить шість карток, проблема не в людях, а в тому, що тип заявки нічий.",
            },
            {
              kind: "table",
              columns: ["Стан", "Що означає", "Що небезпечно"],
              rows: [
                ["Нова", "Звернення зафіксоване, відповідальний ще не взяв", "Висить понад добу"],
                ["В роботі", "Хтось займається", "Немає жодного запису кілька днів"],
                ["Чекає відповіді", "М'яч на боці людини", "Забули нагадати"],
                ["Закрита", "Людина отримала відповідь", "Закрили без відповіді, «щоб не висіло»"],
              ],
            },
          ],
        },
        {
          heading: "Що автоматизувати першим",
          blocks: [
            {
              kind: "list",
              items: [
                "Підтвердження: людина одразу бачить, що звернення прийняте, і знає термін.",
                "Нагадування відповідальному про заявку без руху.",
                "Автоматичне створення заявки з форми на сайті та з повідомлення боту.",
                "Щотижневе зведення для пастора: скільки прийшло, скільки закрито, що застрягло.",
              ],
            },
            {
              kind: "callout",
              title: "Не автоматизуйте відповідь",
              text: "Автоматичне підтвердження — це нормально. Автоматична відповідь на молитовну потребу — ні. Автоматизуйте маршрутизацію й нагадування, але не саму турботу.",
            },
          ],
        },
        {
          heading: "Як зрозуміти, що система працює",
          blocks: [
            {
              kind: "list",
              items: [
                "Ви можете назвати кількість відкритих звернень прямо зараз.",
                "Жодна заявка не висить у стані «нова» більше доби.",
                "Людина, яка звернулась, отримує відповідь навіть тоді, коли відповідальний захворів.",
                "Ніхто не шукає «те повідомлення» в переписці двомісячної давнини.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Канали можуть бути різні, список має бути один.",
        "Заявка без статусу й відповідального вважається втраченою.",
        "Закриття заявки — це відповідь людині, а не зникнення картки.",
        "Автоматизуйте маршрут і нагадування, а не саму турботу.",
      ],
      faq: [
        {
          q: "Чи не забюрократизує це прості прохання?",
          a: "Заявка займає стільки ж часу, скільки повідомлення в чаті, — різниця в тому, що її видно всім, хто має бачити, і вона не зникає разом з історією чату.",
        },
        {
          q: "Хто має заводити заявки з паперових записок?",
          a: "Зазвичай адміністратор або черговий після служіння. Це 10–15 хвилин, і саме вони рятують більшість молитовних потреб від забуття.",
        },
        {
          q: "Чи бачать усі зміст звернення?",
          a: "Ні. Чутливі типи заявок — молитва, особиста допомога — мають обмежений доступ: їх бачить лише відповідальний і пастор.",
        },
      ],
      cta: {
        title: "Заявки в одному місці",
        text: "Форми, бот і ручні записи зводяться в одну дошку зі статусами й відповідальними.",
        label: "Модуль «Заявки»",
        href: "/modules/applications",
      },
    },
    en: {
      seoTitle: "Church requests: how to lose none of them",
      seoDescription:
        "Prayer needs, course sign-ups, help requests, room bookings — how to collect them in one place and carry every one through to an answer.",
      title: "Requests: how to lose none of them",
      lead: "Requests arrive from five directions: a note after the service, a message in a chat, a phone call, a web form, a word passed to the pastor. What gets lost is whatever was never recorded.",
      keywords: [
        "church request tracking",
        "prayer request management",
        "church room booking requests",
        "church sign up form",
        "handling church enquiries",
      ],
      problem: {
        title: "I wrote, and nobody ever replied",
        text: "The most painful sentence a church can hear. Almost always it means the request landed in the private messages of someone who was on holiday.",
      },
      sections: [
        {
          heading: "Why requests get lost",
          blocks: [
            {
              kind: "list",
              items: [
                "Many channels, one storage place: somebody's head.",
                "No status, so nobody can say whether it has been handled.",
                "No owner: someone will answer means nobody will.",
                "No deadline: a request does not expire, it just stops mattering to the person.",
              ],
            },
            { kind: "quote", text: "A request with no status and no owner is already lost." },
          ],
        },
        {
          heading: "One inbox instead of five",
          blocks: [
            {
              kind: "text",
              text: "Do not force people into the correct channel — it never works. Make every channel lead into one list. A web form, a bot message, a paper note typed in by an administrator: each becomes a request with a subject and an owner.",
            },
            {
              kind: "steps",
              items: [
                { title: "Define request types", text: "Prayer, help, course sign-up, room booking, technical question. Five to seven types, no more." },
                { title: "Give each type an owner", text: "A person, not a team. Plus a deputy for holidays." },
                { title: "Agree response times", text: "For example: prayer the same day, practical matters within three working days." },
                { title: "Close with an answer", text: "A request is closed when the person has heard back, not when everyone forgot about it." },
              ],
            },
          ],
        },
        {
          heading: "A board where everything is visible",
          blocks: [
            {
              kind: "text",
              text: "Requests read best as columns by state: new, in progress, waiting, closed. Each card is a person and a need. Bottlenecks become obvious: six cards sitting in new for a week means the type has no real owner.",
            },
            {
              kind: "table",
              columns: ["State", "Meaning", "Warning sign"],
              rows: [
                ["New", "Recorded, not yet picked up", "Sitting for more than a day"],
                ["In progress", "Someone is on it", "No notes for several days"],
                ["Waiting", "The ball is with the person", "Nobody follows up"],
                ["Closed", "The person got an answer", "Closed with no answer, just to clear the board"],
              ],
            },
          ],
        },
        {
          heading: "What to automate first",
          blocks: [
            {
              kind: "list",
              items: [
                "Acknowledgement, so the person knows it arrived and by when to expect a reply.",
                "Reminders to the owner about requests with no movement.",
                "Automatic creation from the web form and the bot.",
                "A weekly summary for the pastor: received, closed, stuck.",
              ],
            },
            {
              kind: "callout",
              title: "Do not automate the answer",
              text: "An automatic acknowledgement is fine. An automatic reply to a prayer need is not. Automate routing and reminders, never the care itself.",
            },
          ],
        },
        {
          heading: "How to know it works",
          blocks: [
            {
              kind: "list",
              items: [
                "You can say how many requests are open right now.",
                "Nothing sits in new for more than a day.",
                "People get an answer even when the owner falls ill.",
                "Nobody hunts for that message in a two-month-old chat.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Channels can differ; the list must be single.",
        "A request without status and owner counts as lost.",
        "Closing means answering, not deleting.",
        "Automate routing and reminders, not the care.",
      ],
      faq: [
        {
          q: "Will this bureaucratise simple asks?",
          a: "A request takes as long to log as a chat message. The difference is that it is visible to those who should see it and does not vanish with the chat history.",
        },
        {
          q: "Who logs paper notes?",
          a: "Usually the administrator or duty volunteer after the service. Fifteen minutes that save most prayer needs from being forgotten.",
        },
        {
          q: "Can everyone read the content?",
          a: "No. Sensitive types — prayer, personal help — are restricted to the owner and the pastor.",
        },
      ],
      cta: {
        title: "Requests in one place",
        text: "Forms, bot and manual notes flow into one board with states and owners.",
        label: "Requests module",
        href: "/modules/applications",
      },
    },
  },
};
