import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "vid-vidviduvacha-do-lidera",
  category: "people",
  date: "2026-09-19",
  minutes: 10,
  related: ["stavte-tsili", "yak-nalashtuvaty-ai-ahenta", "piat-pytan-pro-systemu"],
  copy: {
    ua: {
      seoTitle: "Шлях людини в церкві: від першого візиту до лідера",
      seoDescription:
        "Шість етапів шляху в церкві: відвідувач, покаяння, мала група, хрещення, служіння, лідер. Що має статись на кожному і як не загубити людину між ними.",
      title: "Від першого візиту до лідера: шість етапів шляху",
      lead: "Людина приходить у церкву один раз, а лишається — через десятки маленьких кроків. Ось шість етапів цього шляху і те, що на кожному має зробити хтось конкретний, а не «церква загалом».",
      keywords: [
        "шлях учнівства в церкві",
        "етапи духовного зростання",
        "супровід людини після покаяння",
        "підготовка до хрещення в церкві",
        "як виростити лідера в церкві",
        "залучення людей до служіння",
      ],
      problem: {
        title: "Між покаянням і служінням — порожнеча",
        text: "Людина покаялась на служінні в лютому. Далі не сталось нічого: у групу її ніхто не запросив, про хрещення ніхто не поговорив, у команду не покликали. До літа вона просто перестала приходити — і формально ніхто не зробив нічого поганого.",
      },
      sections: [
        {
          heading: "Досягати людей — означає вести їх далі",
          blocks: [
            {
              kind: "text",
              text: "Церква майже ніколи не має проблеми з першим кроком. Люди приходять: із другом, у кризу, після запрошення, просто повз. Проблема починається там, де перший крок мав перетворитись на другий, а ніхто не назвав, який саме крок другий і хто за нього відповідає.",
            },
            {
              kind: "quote",
              text: "«Тож ідіть, і навчіть всі народи» — Матвія 28:19, переклад Огієнка",
            },
            {
              kind: "text",
              text: "Доручення говорить не «зберіть», а «навчіть». Це означає рух: людина має кудись іти від того місця, де вона вперше сіла в залі. Шлях нижче — це не церковна ієрархія і не рівні святості. Це просто перелік моментів, у які людині потрібен хтось поруч.",
            },
          ],
        },
        {
          heading: "Шість етапів шляху в церкві",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Відвідувач",
                  text: "Перший візит. Завдання етапу — щоб у людини з'явилось ім'я в системі, контакт і жива людина, яка написала їй протягом тижня. Анкета через QR на вході займає хвилину, привітання того ж дня коштує ще п'ять.",
                },
                {
                  title: "Покаяння",
                  text: "Рішення ухвалене — і саме тут воно найчастіше губиться. Рішення має мати наслідок у календарі: розмова, перша зустріч, молитовна підтримка, конкретна дата. Не «ми за вас молимось», а «у четвер о сьомій зустрічаємось з Андрієм».",
                },
                {
                  title: "Мала група",
                  text: "Місце, де людину помітять наступного тижня. Це найсильніший запобіжник від тихого зникнення: у залі можна не прийти непоміченим, у групі з дванадцяти — ні. Запрошення має бути в конкретну групу поруч, з іменем лідера, а не посиланням на загальний список.",
                },
                {
                  title: "Хрещення",
                  text: "Свідомий крок і перша публічна відповідальність. Навколо нього — підготовка, курс, розмова з пастором, реєстрація, дата. Уся ця історія має лишитись у картці людини, а не в пам'яті того, хто готував групу хрещення позаминулого року.",
                },
                {
                  title: "Служіння",
                  text: "Людина переходить з тих, хто отримує, до тих, хто дає. Потрібні роль у команді, графік, підтвердження участі й матеріали в одному місці. І одразу — межа навантаження, бо саме звідси починається вигорання.",
                },
                {
                  title: "Лідер",
                  text: "Своя група чи служіння, відповідальність за інших людей, доступ до аналітики своєї ділянки. І головне — можливість передати справу без втрат, коли прийде час.",
                },
              ],
            },
            {
              kind: "text",
              text: "Назвіть етапи так, як звично вашій церкві: у когось між групою і хрещенням стоїть курс, у когось членство оформлюється окремо. Важлива не термінологія, а те, що етапи існують явно й про кожну людину можна сказати, де вона зараз.",
            },
          ],
        },
        {
          heading: "Що на кожному етапі бере на себе система",
          blocks: [
            {
              kind: "table",
              columns: ["Етап", "Що має статись", "Що бере на себе система"],
              rows: [
                ["Відвідувач", "Контакт і привітання протягом тижня", "Анкета через QR створює картку, відповідальний отримує нагадування того ж дня"],
                ["Покаяння", "Наступний крок із датою", "Статус у картці, завдання відповідальному, запис у календарі"],
                ["Мала група", "Знайомство з лідером конкретної групи", "Список тих, хто ходить понад місяць і досі без групи"],
                ["Хрещення", "Підготовка й дата", "Реєстрація на курс, нагадування учасникам, історія в картці"],
                ["Служіння", "Роль, графік і межа навантаження", "Графік із підтвердженнями і сигнал про тих, хто служить без перерви"],
                ["Лідер", "Відповідальність і передача справ", "Аналітика по своїй групі й передача без втрати історії"],
              ],
            },
            {
              kind: "text",
              text: "Жоден рядок у правій колонці не замінює розмову. Система лише прибирає причину, через яку розмова не відбувається: «я не знав», «я забув», «це було в іншому чаті».",
            },
          ],
        },
        {
          heading: "Де шлях обривається найчастіше",
          blocks: [
            {
              kind: "list",
              title: "Чотири місця, у яких люди зупиняються",
              items: [
                "Після першого візиту: анкета лишилась на папері, і другий крок залежить від того, чи не загубився аркуш.",
                "Після покаяння: рішення записали в блокнот служіння, але наступної дії за ним не стоїть.",
                "Перед групою: людину запросили «в малі групи» взагалі, а не в конкретну групу до конкретного лідера.",
                "У служінні: людина стоїть у графіку щонеділі півтора року, і ніхто не бачить цього навантаження цілісно.",
              ],
            },
            {
              kind: "callout",
              title: "Відповідальний за перехід, а не за етап",
              text: "Найчастіша помилка — закріпити людей за етапами: служіння зустрічі за гостей, координатора за групи. Між етапами утворюється нічия зона, і саме в ній губляться люди. Відповідальний потрібен за перехід: хто саме веде людину від покаяння до групи.",
            },
          ],
        },
        {
          heading: "Лідер — це не фініш шляху",
          blocks: [
            {
              kind: "text",
              text: "Шлях виглядає завершеним на шостому етапі, але насправді він там починається заново: лідер веде свою групу, і в ній сидить людина, яка вперше прийшла минулої неділі. Церква росте не тому, що більше людей увійшло, а тому, що більше людей дійшли до кінця шляху і повели наступних.",
            },
            {
              kind: "text",
              text: "Тому найкращий показник здоров'я громади — не кількість на служінні, а кількість людей, які за рік перейшли хоча б на один етап далі. Цю цифру видно тільки тоді, коли етап зафіксований у картці людини, а не в чиїйсь пам'яті.",
            },
          ],
        },
        {
          heading: "З чого почати цього місяця",
          blocks: [
            {
              kind: "list",
              items: [
                "Випишіть свої етапи — рівно тими словами, якими користується ваша церква.",
                "Проти кожного переходу впишіть одне ім'я. Порожньо — значить, цей перехід не працює.",
                "Перевірте останніх десять людей, які покаялись: скільки з них зараз у групі?",
                "Почніть фіксувати етап у картці людини. Далі буде видно, де черга зупиняється.",
              ],
            },
            {
              kind: "text",
              text: "Не запускайте всі шість етапів одночасно. Візьміть той перехід, на якому зараз втрачаєте найбільше, і доведіть його до звички. Наступний додасте через три місяці.",
            },
          ],
        },
      ],
      takeaways: [
        "Люди губляться не на етапах, а на переходах між ними.",
        "За кожен перехід має відповідати конкретна людина, а не служіння загалом.",
        "Покаяння без наступного кроку з датою залишається подією, а не початком шляху.",
        "Етап людини має бути видимий у картці, інакше його не видно нікому.",
        "Лідер — не кінець шляху: з нього шлях починається для наступних людей.",
      ],
      faq: [
        {
          q: "А якщо в нашій церкві інші етапи?",
          a: "Так і має бути. Етапи — це опис вашої практики, а не чужий шаблон. У системі їх налаштовують під церкву: додають курс, членство чи випробувальний період у служінні й прибирають те, чого у вас немає.",
        },
        {
          q: "Хто має відмічати перехід людини на наступний етап?",
          a: "Той, хто його супроводжував: лідер групи, керівник служіння, відповідальний за гостей. Якщо відмічає один адміністратор за всіх, дані швидко перестають відповідати дійсності.",
        },
        {
          q: "Чи не перетворює це людей на позиції у воронці?",
          a: "Різниця в тому, що робиться далі. Якщо етап потрібен для звіту — так, перетворює. Якщо зміна етапу породжує дзвінок, знайомство чи запрошення — це просто спосіб не забути про людину.",
        },
      ],
      cta: {
        title: "Подивіться, як шлях виглядає в модулі «Онбординг»",
        text: "Етапи, відповідальні за переходи й історія людини — від першого візиту до служіння.",
        label: "Модуль «Онбординг»",
        href: "/modules/onboarding",
      },
    },
    en: {
      seoTitle: "A person's path in church: from first visit to leader",
      seoDescription:
        "Six stages of the path through a church: visitor, repentance, small group, baptism, ministry, leader. What has to happen at each one and where people slip away.",
      title: "From first visit to leader: the six stages",
      lead: "People arrive once, but they stay through dozens of small steps. Here are the six stages of that path, and what a specific person — not the church in general — has to do at each of them.",
      keywords: [
        "discipleship path in church",
        "stages of spiritual growth",
        "following up after a decision for Christ",
        "preparing people for baptism",
        "raising leaders in church",
        "getting people into ministry",
      ],
      problem: {
        title: "The gap between a decision and a ministry",
        text: "Someone makes a decision at a February service. Then nothing happens: no invitation to a group, no conversation about baptism, no place on a team. By summer they have stopped coming — and formally nobody did anything wrong.",
      },
      sections: [
        {
          heading: "Reaching people means leading them further",
          blocks: [
            {
              kind: "text",
              text: "Churches rarely struggle with the first step. People come: with a friend, in a crisis, after an invitation, or simply passing by. The trouble starts where that first step should have become a second one, and nobody named what the second step is or who owns it.",
            },
            {
              kind: "quote",
              text: "Therefore go and make disciples of all nations — Matthew 28:19",
            },
            {
              kind: "text",
              text: "The commission does not say gather, it says make disciples. That implies movement: a person has to go somewhere from the seat they first sat in. The path below is not a hierarchy or a ladder of holiness. It is simply a list of the moments when someone needs another person beside them.",
            },
          ],
        },
        {
          heading: "The six stages of the path",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Visitor",
                  text: "The first visit. The job of this stage is a name in the system, a contact and a real person who writes within the week. A QR form at the door takes a minute; a same-day welcome costs five more.",
                },
                {
                  title: "Repentance",
                  text: "The decision is made — and this is exactly where it usually gets lost. A decision needs a consequence in the calendar: a conversation, a first meeting, prayer support, a date. Not we are praying for you, but Thursday at seven with Andrii.",
                },
                {
                  title: "Small group",
                  text: "A place where someone notices them next week. It is the strongest protection against a quiet disappearance: you can miss a service unnoticed, you cannot miss a group of twelve. The invitation has to be to one specific group nearby, with the leader's name, not to a list.",
                },
                {
                  title: "Baptism",
                  text: "A deliberate step and the first public commitment. Around it sit preparation, a course, a conversation with the pastor, registration and a date. All of that history belongs on the person's record, not in the memory of whoever ran the class two years ago.",
                },
                {
                  title: "Ministry",
                  text: "The person moves from receiving to giving. They need a role on a team, a rota, confirmations and materials in one place — and, from day one, a limit on the load, because this is where burnout begins.",
                },
                {
                  title: "Leader",
                  text: "Their own group or ministry, responsibility for other people, analytics for their own patch — and the ability to hand it all over without loss when the time comes.",
                },
              ],
            },
            {
              kind: "text",
              text: "Name the stages the way your church already speaks. Some put a course between group and baptism, some handle membership separately. The terminology does not matter; what matters is that the stages exist explicitly and you can say where any given person is right now.",
            },
          ],
        },
        {
          heading: "What the system carries at each stage",
          blocks: [
            {
              kind: "table",
              columns: ["Stage", "What has to happen", "What the system carries"],
              rows: [
                ["Visitor", "Contact and a welcome within the week", "The QR form creates the record; the owner is reminded the same day"],
                ["Repentance", "A next step with a date", "A status on the record, a task for the owner, an entry in the calendar"],
                ["Small group", "An introduction to one specific leader", "The list of people attending over a month with no group"],
                ["Baptism", "Preparation and a date", "Course registration, reminders, the history on the record"],
                ["Ministry", "A role, a rota and a load limit", "A rota with confirmations and a flag for anyone serving without a break"],
                ["Leader", "Responsibility and a clean handover", "Analytics for their own group and a handover that keeps the history"],
              ],
            },
            {
              kind: "text",
              text: "Nothing in the right-hand column replaces a conversation. The system only removes the reasons the conversation never happens: I did not know, I forgot, it was in another chat.",
            },
          ],
        },
        {
          heading: "Where the path breaks most often",
          blocks: [
            {
              kind: "list",
              title: "Four places where people stop",
              items: [
                "After the first visit: the card stays on paper, so the second step depends on whether the sheet survives the week.",
                "After a decision: it was written in a ministry notebook, with no action behind it.",
                "Before a group: the person was invited to small groups in general, not to one group and one leader.",
                "In ministry: eighteen months on the rota every Sunday, with nobody seeing the load as a whole.",
              ],
            },
            {
              kind: "callout",
              title: "Own the transition, not the stage",
              text: "The common mistake is assigning people to stages: the welcome team to guests, a coordinator to groups. That leaves an unowned gap between stages, and the gap is where people are lost. Someone has to own the transition itself: who walks a person from a decision into a group.",
            },
          ],
        },
        {
          heading: "Leader is not the end of the path",
          blocks: [
            {
              kind: "text",
              text: "The path looks finished at stage six, but that is where it starts again: the leader runs a group, and in that group sits someone who came for the first time last Sunday. A church grows not because more people walked in, but because more people reached the end of the path and took the next ones along.",
            },
            {
              kind: "text",
              text: "So the healthiest measure is not attendance but the number of people who moved at least one stage further this year. That number only exists when the stage lives on the person's record rather than in somebody's memory.",
            },
          ],
        },
        {
          heading: "Where to start this month",
          blocks: [
            {
              kind: "list",
              items: [
                "Write down your stages, in the words your church actually uses.",
                "Put one name against each transition. An empty line means that transition does not work.",
                "Check the last ten people who made a decision: how many are in a group now?",
                "Start recording the stage on the person's record, and the queue will show you where it stalls.",
              ],
            },
            {
              kind: "text",
              text: "Do not launch all six at once. Take the transition where you lose the most right now and turn it into a habit. Add the next one in three months.",
            },
          ],
        },
      ],
      takeaways: [
        "People are lost between stages, not on them.",
        "Every transition needs a named owner, not a ministry in general.",
        "A decision without a dated next step stays an event instead of a beginning.",
        "A person's stage must be visible on their record, or it is visible to nobody.",
        "Leader is not the end: the path starts there for the next people.",
      ],
      faq: [
        {
          q: "What if our church has different stages?",
          a: "It should. The stages describe your practice, not someone else's template. In the system they are configurable: add a course, membership or a trial period in ministry, and remove whatever you do not have.",
        },
        {
          q: "Who marks the move to the next stage?",
          a: "Whoever walked with the person: the group leader, the ministry lead, the person responsible for guests. If one administrator marks it for everyone, the data stops matching reality within weeks.",
        },
        {
          q: "Does this turn people into positions in a funnel?",
          a: "It depends on what happens next. If the stage exists for a report, then yes. If a change of stage produces a call, an introduction or an invitation, it is simply a way of not forgetting a person.",
        },
      ],
      cta: {
        title: "See the path inside the Onboarding module",
        text: "Stages, owners for every transition and the person's history — from the first visit to ministry.",
        label: "Onboarding module",
        href: "/modules/onboarding",
      },
    },
  },
};
