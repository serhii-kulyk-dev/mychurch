import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "planuvannia-nedilnoho-sluzhinnia",
  category: "process",
  date: "2026-08-05",
  minutes: 8,
  related: ["komanda-bez-vyhorannia", "peredacha-sluzhinnia", "yak-nalashtuvaty-ai-ahenta"],
  copy: {
    ua: {
      seoTitle: "Планування недільного служіння: графік, зміни, команда",
      seoDescription:
        "Як скласти графік служінь на місяць, зібрати зміну без двадцяти повідомлень і зробити так, щоб заміни не ламали неділю.",
      title: "Планування недільного служіння без хаосу в суботу",
      lead: "Кожна неділя складається з десятків дрібних домовленостей. Коли вони живуть у чатах, суботній вечір перетворюється на обдзвін.",
      keywords: [
        "графік служінь у церкві",
        "планування недільного служіння",
        "розклад команди прославлення",
        "заміни в служінні",
        "як скласти графік волонтерів",
      ],
      problem: {
        title: "Субота, 21:00, і невідомо, хто на звуці",
        text: "Один написав у чат, що не зможе. Другий відповів «спробую». Третього забули запитати. Керівник о десятій вечора пише всім по черзі — і так щотижня.",
      },
      sections: [
        {
          heading: "Чому чат не працює як графік",
          blocks: [
            {
              kind: "list",
              items: [
                "Повідомлення зникає під новими: відповідь «так» позавчора вже не знайти.",
                "Немає стану: «запитали», «погодився», «не може» — усе виглядає однаково.",
                "Ніхто не бачить навантаження: одна людина стоїть у графіку щотижня, і це помітно лише коли вона вигорить.",
                "Заміна не фіксується: команда думає, що людина буде, а вона домовилась приватно.",
              ],
            },
            { kind: "quote", text: "Графік у чаті — це не графік, а сподівання." },
          ],
        },
        {
          heading: "Як скласти графік на місяць",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Зберіть недоступність заздалегідь", text: "На початку місяця кожен позначає дати, коли його не буде. Це одна дія замість двадцяти уточнень." },
                { title: "Складіть зміни на весь місяць", text: "Не на тиждень. Місячний горизонт дає людям можливість планувати життя, а вам — побачити перекоси." },
                { title: "Перевірте навантаження", text: "Подивіться, хто стоїть більше трьох тижнів поспіль, і перерозподіліть." },
                { title: "Надішліть підтвердження", text: "Кожен бачить свої дати й підтверджує одним дотиком. Непідтверджені — це і є ваш список для дзвінків." },
              ],
            },
          ],
        },
        {
          heading: "Що має бути в плані самого служіння",
          blocks: [
            {
              kind: "table",
              columns: ["Блок", "Хто відповідає", "Що потрібно заздалегідь"],
              rows: [
                ["Прославлення", "Керівник прославлення", "Список пісень, тональності, склад команди"],
                ["Звук і відео", "Технічна команда", "Хто на пульті, хто на камері, що готувати"],
                ["Слово", "Проповідник", "Тема, тривалість, слайди"],
                ["Зустріч і гості", "Служіння зустрічі", "Хто чергує, скільки анкет, хто дзвонить після"],
                ["Діти", "Служіння дітей", "Скільки груп, хто з дітьми, реєстрація"],
              ],
            },
            {
              kind: "text",
              text: "План служіння — це не сценарій із хвилинами. Це відповідь на одне питання: хто за що відповідає цієї неділі, і що кожен має підготувати до суботи.",
            },
          ],
        },
        {
          heading: "Заміни: правило, яке рятує неділю",
          blocks: [
            {
              kind: "callout",
              title: "Заміна існує лише тоді, коли вона в графіку",
              text: "Домовленість двох людей у приватних повідомленнях не є заміною. Поки в графіку не змінилось ім'я, відповідальним залишається той, хто там стоїть.",
            },
            {
              kind: "list",
              items: [
                "Людина не може — позначає це в графіку, а не в чаті.",
                "Система показує, хто вільний у цю дату й має потрібну роль.",
                "Заміна підтверджена — графік оновився, команда бачить нове ім'я.",
                "Керівник бачить лише те, що справді не закрите.",
              ],
            },
          ],
        },
        {
          heading: "Ознаки, що планування налагоджене",
          blocks: [
            {
              kind: "list",
              items: [
                "У суботу ввечері немає обдзвону.",
                "Кожен служитель знає свої дати на місяць уперед.",
                "Видно, хто служить занадто часто, ще до того, як він про це скаже.",
                "Новий керівник може скласти графік, не маючи історії в голові.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Графік у чаті — це сподівання, а не план.",
        "Горизонт планування — місяць, а не тиждень.",
        "Заміна дійсна лише тоді, коли вона в графіку.",
        "Навантаження треба бачити заздалегідь, а не після вигорання.",
      ],
      faq: [
        {
          q: "Як часто можна ставити людину в графік?",
          a: "Домовтесь про межу заздалегідь — наприклад, не більше двох-трьох тижнів поспіль. Конкретне число менш важливе за те, що воно існує й видиме всім.",
        },
        {
          q: "Що робити з тими, хто ніколи не підтверджує?",
          a: "Не збільшувати кількість нагадувань, а поговорити. Зазвичай за мовчанням стоїть або незручна роль, або втома, про яку не сказали вголос.",
        },
        {
          q: "Чи потрібен окремий графік для кожного служіння?",
          a: "Так, але дивитись їх треба разом. Інакше одна й та сама людина опиняється і на звуці, і в дітях в одну неділю.",
        },
      ],
      cta: {
        title: "Планування служіння у системі",
        text: "Зміни, недоступність, підтвердження й заміни — без обдзвону в суботу ввечері.",
        label: "Модуль «Планування служіння»",
        href: "/modules/service-planning",
      },
    },
    en: {
      seoTitle: "Planning a Sunday service: rotas, shifts, teams",
      seoDescription:
        "How to build a month's rota, fill a Sunday team without twenty messages, and stop last-minute swaps from breaking the service.",
      title: "Planning Sunday without Saturday chaos",
      lead: "Every Sunday is made of dozens of small agreements. When they live in chats, Saturday evening turns into a phone marathon.",
      keywords: [
        "church service planning",
        "volunteer rota church",
        "worship team schedule",
        "church roster software",
        "service planning software",
      ],
      problem: {
        title: "Saturday, 9pm, and nobody knows who is on sound",
        text: "One wrote in the chat that they cannot. Another said they would try. A third was never asked. The lead is messaging everyone one by one — again.",
      },
      sections: [
        {
          heading: "Why a chat is not a rota",
          blocks: [
            {
              kind: "list",
              items: [
                "Messages sink: a yes from two days ago is unfindable.",
                "There is no state — asked, confirmed, declined all look the same.",
                "Nobody sees the load: one person serves every week and it shows only when they burn out.",
                "Swaps are invisible: the team expects someone who privately arranged cover.",
              ],
            },
            { kind: "quote", text: "A rota in a chat is not a plan, it is a hope." },
          ],
        },
        {
          heading: "Building a month's rota",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Collect unavailability first", text: "At the start of the month everyone marks the dates they are away. One action instead of twenty follow-ups." },
                { title: "Build the whole month", text: "Not one week. A month lets people plan their lives and lets you see imbalance." },
                { title: "Check the load", text: "Find anyone rostered more than three weeks running and redistribute." },
                { title: "Send confirmations", text: "Everyone sees their dates and confirms with one tap. The unconfirmed are your call list." },
              ],
            },
          ],
        },
        {
          heading: "What the service plan must contain",
          blocks: [
            {
              kind: "table",
              columns: ["Area", "Owner", "Needed in advance"],
              rows: [
                ["Worship", "Worship lead", "Song list, keys, team"],
                ["Sound and video", "Tech team", "Who is on the desk, who is on camera"],
                ["Preaching", "Preacher", "Topic, length, slides"],
                ["Welcome", "Welcome team", "Who is on duty, who calls guests afterwards"],
                ["Children", "Kids ministry", "Groups, helpers, check-in"],
              ],
            },
            {
              kind: "text",
              text: "A service plan is not a minute-by-minute script. It answers one question: who is responsible for what this Sunday, and what each needs ready by Saturday.",
            },
          ],
        },
        {
          heading: "Swaps: the rule that saves Sunday",
          blocks: [
            {
              kind: "callout",
              title: "A swap exists only when it is in the rota",
              text: "Two people agreeing in private messages is not a swap. Until the name changes in the rota, the person listed is still responsible.",
            },
            {
              kind: "list",
              items: [
                "Someone unavailable marks it in the rota, not in the chat.",
                "The system shows who is free that date and has the right role.",
                "Once confirmed, the rota updates and the team sees the new name.",
                "The lead only sees what is genuinely still open.",
              ],
            },
          ],
        },
        {
          heading: "Signs that planning works",
          blocks: [
            {
              kind: "list",
              items: [
                "No Saturday-evening phone marathon.",
                "Every volunteer knows their dates a month ahead.",
                "Overloaded people are visible before they say anything.",
                "A new lead can build the rota without carrying the history in their head.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "A rota in a chat is a hope, not a plan.",
        "Plan a month ahead, not a week.",
        "A swap counts only when it is in the rota.",
        "See the load before burnout, not after.",
      ],
      faq: [
        {
          q: "How often can one person be rostered?",
          a: "Agree a limit in advance — say no more than two or three weeks running. The exact number matters less than the fact that it exists and is visible.",
        },
        {
          q: "What about people who never confirm?",
          a: "Do not add reminders, have a conversation. Silence usually means the wrong role or unspoken tiredness.",
        },
        {
          q: "Does every ministry need its own rota?",
          a: "Yes, but they must be viewed together, or the same person ends up on sound and in kids on the same Sunday.",
        },
      ],
      cta: {
        title: "Service planning in the system",
        text: "Shifts, unavailability, confirmations and swaps — without the Saturday phone marathon.",
        label: "Service planning module",
        href: "/modules/service-planning",
      },
    },
  },
};
