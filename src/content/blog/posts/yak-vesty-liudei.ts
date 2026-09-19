import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "yak-vesty-liudei",
  category: "people",
  date: "2026-09-08",
  minutes: 8,
  related: ["novi-liudy-pershi-90-dniv", "mali-hrupy", "dosiahai-liudei"],
  copy: {
    ua: {
      seoTitle: "Як вести людей у церкві: шлях від гостя до служителя",
      seoDescription:
        "Покроковий шлях людини в церкві: гість, постійний відвідувач, учасник групи, член церкви, служитель. Хто відповідає за кожен крок і як його не загубити.",
      title: "Як вести людей: шлях від гостя до служителя",
      lead: "Людина не стає служителем випадково. Між першим візитом і служінням є 4–5 кроків, і кожен з них хтось має супроводжувати — інакше людина зупиняється на другому.",
      keywords: [
        "шлях людини в церкві",
        "як інтегрувати нових людей у церкві",
        "служіння турботи",
        "духовне зростання членів церкви",
        "як залучати людей до служіння",
      ],
      problem: {
        title: "Люди «зависають» між гостем і учасником",
        text: "На служінні щонеділі десять нових облич. Через пів року в малих групах не додалось нікого. Ніхто не винен окремо — просто між «прийшов» і «долучився» немає жодного названого кроку.",
      },
      sections: [
        {
          heading: "П'ять етапів, які має пройти людина",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Гість", text: "Перший візит. Завдання цього етапу одне — щоб людина мала ім'я, контакт і когось, хто написав їй протягом тижня." },
                { title: "Постійний відвідувач", text: "Приходить регулярно, але ще ні з ким не познайомився ближче. Тут вирішується, чи буде далі: людина або знаходить своє коло, або тихо зникає." },
                { title: "Учасник малої групи", text: "З'являється місце, де його помітять на наступному тижні. Це найсильніший запобіжник від втрати людини." },
                { title: "Член церкви", text: "Свідомий крок і відповідальність. Тут з'являються курс, розмова з пастором, хрещення — залежно від вашої практики." },
                { title: "Служитель", text: "Людина не просто отримує, а служить. Це не фініш, а перехід у нову роль, з власним ризиком вигорання." },
              ],
            },
            {
              kind: "text",
              text: "Назвіть ці етапи так, як звично вашій церкві. Важлива не термінологія, а те, що етапи існують явно й кожен знає, на якому етапі зараз конкретна людина.",
            },
          ],
        },
        {
          heading: "Головне питання: хто відповідає за перехід",
          blocks: [
            {
              kind: "text",
              text: "Найчастіша помилка — закріпити відповідального за етап, а не за перехід. «Служіння зустрічі» відповідає за гостей, «мала група» — за учасників, а між ними порожнеча, у якій люди й губляться.",
            },
            {
              kind: "table",
              columns: ["Перехід", "Хто веде", "Що має статись"],
              rows: [
                ["Гість → постійний", "Служіння зустрічі", "Дзвінок або повідомлення протягом тижня, запрошення на конкретну подію"],
                ["Постійний → група", "Координатор малих груп", "Особисте знайомство з лідером групи, а не посилання на загальний список"],
                ["Група → член церкви", "Лідер групи й пастор", "Розмова, курс, дата"],
                ["Член → служитель", "Керівник служіння", "Пробна зміна разом з наставником"],
              ],
            },
          ],
        },
        {
          heading: "Що заважає найчастіше",
          blocks: [
            {
              kind: "list",
              items: [
                "Анкета гостя лишається на папері, тому наступний крок залежить від того, чи не загубився аркуш.",
                "Про людину знає лише той, хто з нею познайомився. Він у відпустці — і ланцюг обривається.",
                "Немає межі часу: «колись зателефонуємо» перетворюється на «вже незручно, минув місяць».",
                "Етапи ніде не видно, тому неможливо сказати, скільки людей зараз між другим і третім кроком.",
              ],
            },
            {
              kind: "callout",
              title: "Термін, який варто зафіксувати",
              text: "Перший контакт з гостем — протягом 72 годин. Не тому що це магічне число, а тому що після нього людина вже пам'ятає не вас, а робочий тиждень.",
            },
          ],
        },
        {
          heading: "Як це виглядає в системі",
          blocks: [
            {
              kind: "text",
              text: "У картці людини видно етап, дату приходу, групу, служіння й останній контакт. Перехід між етапами — це не звіт, а дія: змінився етап — автоматично з'явилось завдання для відповідального.",
            },
            {
              kind: "list",
              title: "Три речі, які система бере на себе",
              items: [
                "Нагадує відповідальному про гостя, з яким ще ніхто не зв'язався.",
                "Показує список людей, які ходять понад місяць і досі без групи.",
                "Веде історію: хто, коли й про що говорив з людиною — доступно наступному лідеру.",
              ],
            },
          ],
        },
        {
          heading: "З чого почати цього тижня",
          blocks: [
            {
              kind: "list",
              items: [
                "Випишіть свої етапи на аркуші — рівно ті назви, якими користується ваша церква.",
                "Проти кожного переходу впишіть одне ім'я. Порожньо — значить, цей перехід не працює.",
                "Перевірте останніх десять гостей: з кількома з них поговорили протягом тижня?",
                "Почніть фіксувати етап у картці людини, а не в пам'яті лідерів.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Шлях людини складається з переходів, і саме на переходах губляться люди.",
        "За кожен перехід має відповідати конкретна людина, а не служіння загалом.",
        "Перший контакт з гостем — протягом 72 годин.",
        "Етап людини має бути видимий у картці, а не в пам'яті лідера.",
      ],
      faq: [
        {
          q: "Скільки етапів оптимально?",
          a: "Чотири-п'ять. Менше — етапи надто широкі й нічого не показують. Більше — лідери перестають їх заповнювати, і дані швидко стають недостовірними.",
        },
        {
          q: "Що робити, якщо людина застрягла на етапі?",
          a: "Перевірте перехід, а не людину. Якщо на одному місці застрягли десятки — проблема в тому, що перехід нічий, або в тому, що наступний крок надто великий.",
        },
        {
          q: "Чи не стане це формальністю?",
          a: "Стане, якщо етап заповнюють для звіту. Не стане, якщо зміна етапу породжує конкретну дію: дзвінок, знайомство, запрошення.",
        },
      ],
      cta: {
        title: "Онбординг нової людини — покроково",
        text: "Модуль веде людину від першого візиту до служіння і не дає переходу зависнути.",
        label: "Модуль «Онбординг»",
        href: "/modules/onboarding",
      },
    },
    en: {
      seoTitle: "Guiding people: from first-time guest to volunteer",
      seoDescription:
        "The path a person takes through a church — guest, regular, group member, member, volunteer — who owns each step, and how people stop falling between them.",
      title: "Guiding people: from guest to volunteer",
      lead: "Nobody becomes a volunteer by accident. There are four or five steps between a first visit and serving, and each needs an owner — otherwise people stop at step two.",
      keywords: [
        "church assimilation process",
        "first time guest follow up",
        "church membership path",
        "getting people into small groups",
        "volunteer recruitment church",
      ],
      problem: {
        title: "People get stuck between guest and participant",
        text: "Ten new faces every Sunday. Six months later the small groups have not grown by a single person. Nobody is individually at fault — there is simply no named step between arriving and belonging.",
      },
      sections: [
        {
          heading: "The five stages a person moves through",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Guest", text: "A first visit. The only job at this stage is that the person has a name, a contact and someone who writes within the week." },
                { title: "Regular attender", text: "Comes often but knows nobody closely. This is where it is decided: they find their circle, or they quietly disappear." },
                { title: "Small group member", text: "Now there is a place where their absence is noticed next week. This is the strongest safeguard against losing someone." },
                { title: "Member", text: "A deliberate commitment: a course, a conversation with the pastor, baptism — whatever your practice is." },
                { title: "Volunteer", text: "The person now serves rather than only receives. Not a finish line, but a new role with its own burnout risk." },
              ],
            },
            {
              kind: "text",
              text: "Name the stages the way your church already speaks. What matters is not the terminology but that stages exist explicitly and everyone knows where a given person stands.",
            },
          ],
        },
        {
          heading: "The real question: who owns the transition",
          blocks: [
            {
              kind: "text",
              text: "The common mistake is assigning an owner to a stage instead of to a transition. The welcome team owns guests, small groups own members, and between them is the gap where people vanish.",
            },
            {
              kind: "table",
              columns: ["Transition", "Owner", "What must happen"],
              rows: [
                ["Guest → regular", "Welcome team", "A call or message within the week, an invitation to something specific"],
                ["Regular → group", "Small group coordinator", "A personal introduction to a leader, not a link to a list"],
                ["Group → member", "Group leader and pastor", "A conversation, a course, a date"],
                ["Member → volunteer", "Ministry lead", "A trial shift alongside a mentor"],
              ],
            },
          ],
        },
        {
          heading: "What gets in the way",
          blocks: [
            {
              kind: "list",
              items: [
                "The guest card stays on paper, so the next step depends on whether the sheet survives.",
                "Only the person who met them knows them. They go on holiday and the chain breaks.",
                "No time limit: we will call sometime becomes it has been a month, it is awkward now.",
                "Stages are invisible, so nobody can say how many people sit between step two and three.",
              ],
            },
            {
              kind: "callout",
              title: "One deadline worth fixing",
              text: "First contact with a guest within 72 hours — not because the number is magic, but because after that the working week has replaced you in their memory.",
            },
          ],
        },
        {
          heading: "How it looks in a system",
          blocks: [
            {
              kind: "text",
              text: "The person card shows the stage, arrival date, group, ministry and last contact. Changing a stage is an action, not a report: the change creates a task for whoever owns the next step.",
            },
            {
              kind: "list",
              title: "Three things the system carries",
              items: [
                "Reminds the owner about a guest nobody has contacted.",
                "Lists people who have attended for over a month and still have no group.",
                "Keeps the history of who spoke with whom, available to the next leader.",
              ],
            },
          ],
        },
        {
          heading: "Where to start this week",
          blocks: [
            {
              kind: "list",
              items: [
                "Write your stages on one sheet, in your church's own words.",
                "Put one name against each transition. An empty line means that transition does not work.",
                "Check the last ten guests: how many were contacted within a week?",
                "Record the stage on the person card rather than in leaders' memory.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "A person's path is made of transitions, and transitions are where people are lost.",
        "Every transition needs a named owner, not a team in general.",
        "Contact a guest within 72 hours.",
        "The stage belongs on the person card, not in someone's memory.",
      ],
      faq: [
        {
          q: "How many stages should we have?",
          a: "Four or five. Fewer and they show nothing; more and leaders stop filling them in, which makes the data unreliable fast.",
        },
        {
          q: "What if someone is stuck at a stage?",
          a: "Examine the transition, not the person. If dozens are stuck in the same place, either the transition has no owner or the next step is too large.",
        },
        {
          q: "Will this not become a formality?",
          a: "It will, if the stage is filled in for a report. It will not, if changing a stage triggers a real action: a call, an introduction, an invitation.",
        },
      ],
      cta: {
        title: "Onboarding, step by step",
        text: "The module walks a person from first visit to serving and keeps transitions from stalling.",
        label: "Onboarding module",
        href: "/modules/onboarding",
      },
    },
  },
};
