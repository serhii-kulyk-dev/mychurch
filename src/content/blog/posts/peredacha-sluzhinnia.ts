import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "peredacha-sluzhinnia",
  category: "process",
  date: "2026-09-11",
  minutes: 8,
  related: ["komanda-bez-vyhorannia", "dani-v-riznykh-mistsiakh", "planuvannia-nedilnoho-sluzhinnia"],
  copy: {
    ua: {
      seoTitle: "Передача служіння: як зробити її менш болісною",
      seoDescription:
        "Чому зміна керівника служіння завжди болить і що можна підготувати заздалегідь: доступи, графіки, контакти, домовленості й знання, які досі в голові.",
      title: "Передача служіння — це завжди болісно",
      lead: "Людина йде — і разом з нею йде половина служіння: паролі, домовленості з підрядниками, знання, кого не можна ставити в одну зміну. Біль неминучий, але його розмір залежить від підготовки.",
      keywords: [
        "передача служіння в церкві",
        "зміна керівника служіння",
        "як передати справи в церкві",
        "наступництво лідерів церква",
        "база знань служіння",
      ],
      problem: {
        title: "Усе трималось на одній людині",
        text: "Керівник служіння переїхав. Через місяць з'ясовується: ніхто не знає пароля від пошти служіння, графік вівся в його особистому файлі, а домовленість з музикантом була усною.",
      },
      sections: [
        {
          heading: "Чому це болить навіть при хорошому розставанні",
          blocks: [
            {
              kind: "text",
              text: "Служіння — це не список задач, а сукупність стосунків і неписаних домовленостей. Задачі передаються за день. Стосунки й контекст — за місяці. Саме тому передача болить навіть тоді, коли всі в добрих взаєминах.",
            },
            {
              kind: "list",
              title: "Що зазвичай губиться при передачі",
              items: [
                "Доступи: пошта, чати, папки з матеріалами, обладнання.",
                "Календар: коли замовляти, коли нагадувати, коли готувати сезон.",
                "Люди: хто на що погодився, хто в довгій перерві, хто повернеться восени.",
                "Контекст: чому торік вирішили робити саме так, а не інакше.",
              ],
            },
          ],
        },
        {
          heading: "Що готувати заздалегідь, а не в останній тиждень",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Спільні доступи з першого дня", text: "Пошта, чати й папки належать служінню, а не людині. Це найдешевше правило з усіх." },
                { title: "Графік у системі, а не у файлі", text: "Якщо графік змін живе в спільному місці, новий керівник бачить історію, а не порожній аркуш." },
                { title: "Один документ рішень", text: "Три-чотири абзаци на сезон: що змінили, чому, що не спрацювало. Це і є контекст." },
                { title: "Помічник завжди", text: "Помічник — не розкіш, а страховка. Служіння без другої людини передається найважче." },
              ],
            },
          ],
        },
        {
          heading: "Як виглядає спокійна передача",
          blocks: [
            {
              kind: "table",
              columns: ["Етап", "Термін", "Що відбувається"],
              rows: [
                ["Рішення", "за 2–3 місяці", "Домовленість про дату й наступника, без раптовості"],
                ["Спільна робота", "1–2 місяці", "Двоє ведуть служіння разом: один робить, другий поруч"],
                ["Передача доступів", "за 2 тижні", "Паролі, чати, підрядники, обладнання — за списком"],
                ["Супровід", "1 місяць після", "Попередній керівник відповідає на питання, але не керує"],
              ],
            },
            {
              kind: "callout",
              title: "Найчастіша помилка",
              text: "Передати служіння в тиждень «бо так склалось». Якщо іншого варіанту немає, хоча б випишіть усе, що знаєте, у простий список — навіть неідеальний список кращий за пам'ять, якої вже не буде поруч.",
            },
          ],
        },
        {
          heading: "Що має бути в системі, щоб передача була можливою",
          blocks: [
            {
              kind: "list",
              items: [
                "Команда служіння з ролями: хто керівник, хто помічник, хто в резерві.",
                "Графік змін з історією за рік — видно, хто скільки служив.",
                "База знань служіння: інструкції, чек-листи, домовленості.",
                "Ресурси: обладнання, приміщення, доступи — прив'язані до служіння, а не до людини.",
              ],
            },
            {
              kind: "text",
              text: "Коли все це живе в спільному просторі, передача перестає бути катастрофою і стає процесом на кілька тижнів. Біль залишається — але це біль прощання, а не паніки.",
            },
          ],
        },
      ],
      takeaways: [
        "Доступи належать служінню, а не людині — це правило економить місяці.",
        "Найважче передається контекст, тому фіксуйте рішення сезону в кількох абзацах.",
        "Служіння без помічника передається найболючіше.",
        "Спокійна передача — це три місяці, а не тиждень.",
      ],
      faq: [
        {
          q: "Що робити, якщо людина йде раптово й у поганих взаєминах?",
          a: "Спершу закрийте доступи й зафіксуйте, що саме залишилось невідомим. Далі збирайте знання з команди: зазвичай разом вони пам'ятають 80% того, що знав керівник.",
        },
        {
          q: "Чи не образливо готувати наступника заздалегідь?",
          a: "Навпаки: наявність помічника знімає навантаження з чинного керівника. Образливим це стає лише тоді, коли робиться таємно.",
        },
        {
          q: "Скільки часу займає повне входження нового керівника?",
          a: "Зазвичай один повний сезон. До того часу він проходить усі щорічні події вперше, і саме це, а не інструкції, дає впевненість.",
        },
      ],
      cta: {
        title: "Служіння, команди й графіки в одному місці",
        text: "Ролі, зміни, історія навантаження й база знань, які не йдуть разом з людиною.",
        label: "Модуль «Служіння»",
        href: "/modules/ministries",
      },
    },
    en: {
      seoTitle: "Handing over a ministry without the usual pain",
      seoDescription:
        "Why a ministry handover always hurts and what can be prepared in advance: access, rotas, contacts, agreements and the knowledge still living in one person's head.",
      title: "Handing over a ministry always hurts",
      lead: "When a leader leaves, half the ministry leaves too: passwords, supplier agreements, the knowledge of who should never be rostered together. The pain is unavoidable; its size depends on preparation.",
      keywords: [
        "church ministry handover",
        "ministry leader transition",
        "church leadership succession",
        "volunteer team handover",
        "ministry knowledge base",
      ],
      problem: {
        title: "Everything depended on one person",
        text: "The ministry lead moved away. A month later nobody knows the password to the ministry inbox, the rota lived in a personal file, and the agreement with the musician was verbal.",
      },
      sections: [
        {
          heading: "Why it hurts even when everyone parts well",
          blocks: [
            {
              kind: "text",
              text: "A ministry is not a task list but a set of relationships and unwritten agreements. Tasks transfer in a day; context and relationships take months. That is why handovers hurt even in the best circumstances.",
            },
            {
              kind: "list",
              title: "What usually gets lost",
              items: [
                "Access: inbox, chats, folders, equipment.",
                "The calendar: when to order, when to remind, when to prepare the season.",
                "People: who agreed to what, who is on a break, who returns in autumn.",
                "Context: why last year it was decided this way and not another.",
              ],
            },
          ],
        },
        {
          heading: "What to prepare long before the last week",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Shared access from day one", text: "The inbox, chats and folders belong to the ministry, not the person. The cheapest rule there is." },
                { title: "The rota in a system, not a file", text: "When the rota lives in a shared place, the next leader inherits history instead of a blank page." },
                { title: "One decisions document", text: "Three or four paragraphs per season: what changed, why, what did not work. That is the context." },
                { title: "Always an apprentice", text: "An apprentice is insurance. A ministry with one person is the hardest to hand over." },
              ],
            },
          ],
        },
        {
          heading: "What a calm handover looks like",
          blocks: [
            {
              kind: "table",
              columns: ["Stage", "Timing", "What happens"],
              rows: [
                ["Decision", "2–3 months ahead", "A date and a successor agreed, nothing sudden"],
                ["Shared leading", "1–2 months", "Two people lead together: one does, one stands beside"],
                ["Access transfer", "2 weeks ahead", "Passwords, chats, suppliers, equipment, by checklist"],
                ["Support", "1 month after", "The previous leader answers questions but does not lead"],
              ],
            },
            {
              kind: "callout",
              title: "The most common mistake",
              text: "A handover squeezed into one week. If there is no alternative, at least write down everything you know in a plain list — an imperfect list beats memory that will not be in the room.",
            },
          ],
        },
        {
          heading: "What the system has to hold",
          blocks: [
            {
              kind: "list",
              items: [
                "The ministry team with roles: lead, apprentice, reserve.",
                "A rota with a year of history, showing who served how often.",
                "A ministry knowledge base: instructions, checklists, agreements.",
                "Resources: equipment, rooms, access — attached to the ministry, not the person.",
              ],
            },
            {
              kind: "text",
              text: "With all of that in a shared space, a handover stops being a disaster and becomes a few weeks of work. The pain remains, but it is the pain of goodbye rather than panic.",
            },
          ],
        },
      ],
      takeaways: [
        "Access belongs to the ministry, not the person.",
        "Context is the hardest thing to transfer, so record the season's decisions.",
        "A ministry without an apprentice hands over worst.",
        "A calm handover takes three months, not one week.",
      ],
      faq: [
        {
          q: "What if someone leaves suddenly and badly?",
          a: "Close access first and write down what is now unknown. Then gather knowledge from the team: together they usually remember 80% of what the leader knew.",
        },
        {
          q: "Is preparing a successor insulting to the current leader?",
          a: "The opposite: an apprentice takes load off them. It only offends when it is done secretly.",
        },
        {
          q: "How long until a new leader is fully settled?",
          a: "Usually one full season, because only then have they been through every annual event once.",
        },
      ],
      cta: {
        title: "Ministries, teams and rotas in one place",
        text: "Roles, shifts, load history and a knowledge base that does not leave with the person.",
        label: "Ministries module",
        href: "/modules/ministries",
      },
    },
  },
};
