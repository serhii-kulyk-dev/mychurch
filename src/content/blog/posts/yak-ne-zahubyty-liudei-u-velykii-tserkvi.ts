import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "yak-ne-zahubyty-liudei-u-velykii-tserkvi",
  category: "people",
  date: "2026-08-28",
  minutes: 8,
  related: ["mali-hrupy", "oblik-vidviduvanosti", "dosiahai-liudei"],
  copy: {
    ua: {
      seoTitle: "Як не загубити людей у великій церкві: практичний підхід",
      seoDescription:
        "Коли громада переростає 300 людей, пам'яті пастора вже не вистачає. Як зберегти особисту увагу до кожного через структуру, групи й видимі сигнали.",
      title: "Як не загубити людей, коли церква велика",
      lead: "У церкві на 80 людей пастор пам'ятає всіх. У церкві на 800 — не пам'ятає ніхто. Увага не зникає через байдужість: вона впирається в межу людської пам'яті.",
      keywords: [
        "велика церква управління",
        "як не втратити людей у церкві",
        "структура церкви на 500 людей",
        "облік членів великої громади",
        "малі групи у великій церкві",
      ],
      problem: {
        title: "Церква росте, а відчуття дому зникає",
        text: "Зал повний, служіння сильне, а люди кажуть: «Я тут уже рік, і мене ніхто не знає». Це не проблема духовності — це проблема структури, яка не змінилась разом із розміром.",
      },
      sections: [
        {
          heading: "Що саме ламається при зростанні",
          blocks: [
            {
              kind: "text",
              text: "До приблизно 150 людей громада тримається на особистих стосунках: усі одне одного знають в обличчя. Далі кожна нова сотня додає не стільки людей, скільки зв'язків, які вже неможливо втримати в голові. Церква зростає лінійно, а навантаження на пам'ять — значно швидше.",
            },
            {
              kind: "list",
              title: "Перші ознаки, що межу пройдено",
              items: [
                "На запитання «як справи в громаді?» відповідь займає кілька днів підготовки.",
                "Про те, що людина не приходить, дізнаються від третіх осіб.",
                "Служителі дублюють дзвінки: одній людині зателефонували троє, іншій — ніхто.",
                "З'являються «невидимі» люди: ходять роками, не належать нікуди.",
              ],
            },
          ],
        },
        {
          heading: "Правило: велика церква — це мережа малих",
          blocks: [
            {
              kind: "text",
              text: "Єдиний масштабований спосіб зберегти увагу — розділити громаду на одиниці, у яких відсутність людини помітна наступного тижня. Мала група, служіння, кампус, покоління. Кожна людина має належати хоча б до однієї такої одиниці — і в кожної одиниці має бути лідер з іменем.",
            },
            {
              kind: "table",
              columns: ["Розмір громади", "Що тримає увагу", "Що обов'язково"],
              rows: [
                ["до 150", "Особиста пам'ять пастора", "Список контактів"],
                ["150–400", "Лідери груп і служінь", "Єдина база людей, відмітка відвідуваності"],
                ["400–1000", "Структура: групи, служіння, покоління", "Сигнали зниклих, звіти по групах"],
                ["понад 1000", "Кампуси й координатори напрямів", "Ролі й доступи, аналітика по кожному кампусу"],
              ],
            },
          ],
        },
        {
          heading: "Хто дивиться на «невидимих»",
          blocks: [
            {
              kind: "text",
              text: "Найризикованіша категорія — люди поза будь-якою групою. Вони не в чиємусь списку, тому їхнє зникнення не викликає жодного сигналу. У великій церкві таких може бути третина громади.",
            },
            {
              kind: "steps",
              items: [
                { title: "Знайдіть їх", text: "Один фільтр: люди, які відвідують понад місяць і не належать до жодної групи чи служіння." },
                { title: "Розподіліть", text: "Розділіть цей список між лідерами — по десять людей, а не «усіх усім»." },
                { title: "Поставте термін", text: "Два тижні на перший контакт і запис у картці. Без терміну список просто лежатиме." },
                { title: "Поверніться до списку", text: "Через місяць перевірте, скільки людей з нього тепер мають групу. Це і є метрика роботи, а не кількість дзвінків." },
              ],
            },
          ],
        },
        {
          heading: "Що має бачити лідер, а що — пастор",
          blocks: [
            {
              kind: "list",
              items: [
                "Лідер групи: свої 10–15 людей, хто був, хто зник, хто просив про молитву.",
                "Керівник служіння: свою команду, навантаження, хто служить без перерви.",
                "Пастор: зведення по громаді — рух людей, нові, зниклі, стан груп, а не окремі картки.",
                "Адміністратор: якість даних — дублі, порожні контакти, люди без групи.",
              ],
            },
            {
              kind: "callout",
              title: "Доступи — не про секретність",
              text: "Розділення доступів у великій церкві потрібне не для того, щоб щось приховати, а щоб кожен бачив свій обсяг і не тонув у чужому. Лідеру з 12 людьми не потрібен список на 800.",
            },
          ],
        },
        {
          heading: "Три звички, які тримають велику громаду",
          blocks: [
            {
              kind: "list",
              items: [
                "Щотижнева відмітка присутності в кожній групі — без неї решта не працює.",
                "Щомісячний перегляд списку людей без групи.",
                "Щоквартальна розмова з лідерами про тих, хто зник: не «скільки», а «хто саме і що зробили».",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Після 150 людей структура важливіша за пам'ять.",
        "Кожна людина має належати до одиниці, де її відсутність помітна за тиждень.",
        "Найбільший ризик — люди без жодної групи; їх треба шукати фільтром, а не інтуїцією.",
        "Лідер бачить свій обсяг, пастор — зведення. Це різні екрани.",
      ],
      faq: [
        {
          q: "Скільки людей має бути в малій групі?",
          a: "Стільки, скільки лідер реально здатен помітити. Зазвичай це 8–15: у більшій групі відсутність однієї людини перестає впадати в око, і сенс одиниці уваги зникає.",
        },
        {
          q: "Чи потрібні кампуси, якщо ми зустрічаємось в одному приміщенні?",
          a: "Не обов'язково. Кампуси мають сенс, коли є окремі локації або кілька служінь із власними командами. Інакше достатньо груп, служінь і поколінь.",
        },
        {
          q: "Як переконати лідерів вести облік?",
          a: "Показати їм користь для себе, а не для звіту. Лідер бачить, хто з його людей не був три тижні — це економить йому час, а не додає роботи.",
        },
      ],
      cta: {
        title: "Подивіться, як розкладається структура громади",
        text: "Групи, служіння, кампуси й покоління — і видно, хто не належить нікуди.",
        label: "Усі модулі",
        href: "/modules",
      },
    },
    en: {
      seoTitle: "How not to lose people in a large church",
      seoDescription:
        "Past 300 people a pastor's memory stops scaling. How to keep personal attention through structure, groups and visible signals instead.",
      title: "How not to lose people when the church is large",
      lead: "In a church of 80 the pastor remembers everyone. In a church of 800 nobody does. Attention does not disappear through indifference — it hits the limit of human memory.",
      keywords: [
        "large church management",
        "church member retention",
        "church structure 500 members",
        "small groups large church",
        "church database for big congregation",
      ],
      problem: {
        title: "The church grows and the sense of home fades",
        text: "The room is full, the services are strong, and people say: I have been here a year and nobody knows me. That is not a spiritual problem — it is a structure that never grew with the size.",
      },
      sections: [
        {
          heading: "What actually breaks as you grow",
          blocks: [
            {
              kind: "text",
              text: "Up to roughly 150 people a church runs on personal relationships. After that every new hundred adds not so much people as connections, and connections outgrow memory much faster than attendance grows.",
            },
            {
              kind: "list",
              title: "Early signs the line has been crossed",
              items: [
                "Answering how is the church doing takes days of preparation.",
                "You learn that someone stopped coming from a third party.",
                "Calls are duplicated: three people phone one member and nobody phones another.",
                "Invisible people appear: they attend for years and belong nowhere.",
              ],
            },
          ],
        },
        {
          heading: "A large church is a network of small ones",
          blocks: [
            {
              kind: "text",
              text: "The only scalable way to keep attention is to divide the church into units where an absence is noticed the following week: a small group, a ministry, a campus, a generation. Everyone belongs to at least one, and every unit has a leader with a name.",
            },
            {
              kind: "table",
              columns: ["Size", "What holds attention", "What becomes essential"],
              rows: [
                ["under 150", "The pastor's own memory", "A contact list"],
                ["150–400", "Group and ministry leaders", "One people database, attendance marking"],
                ["400–1000", "Structure: groups, ministries, generations", "Signals for absentees, per-group reports"],
                ["over 1000", "Campuses and area coordinators", "Roles and access, analytics per campus"],
              ],
            },
          ],
        },
        {
          heading: "Who watches the invisible ones",
          blocks: [
            {
              kind: "text",
              text: "The riskiest group is people outside any unit. They are on nobody's list, so their absence triggers nothing. In a large church that can be a third of the congregation.",
            },
            {
              kind: "steps",
              items: [
                { title: "Find them", text: "One filter: attending for over a month, belonging to no group or ministry." },
                { title: "Share the list", text: "Split it between leaders, ten people each, rather than handing everyone to everyone." },
                { title: "Set a deadline", text: "Two weeks for the first contact and a note on the card. Without a deadline the list just sits there." },
                { title: "Come back to it", text: "A month later check how many now have a group. That is the metric, not the number of calls." },
              ],
            },
          ],
        },
        {
          heading: "What a leader sees, and what a pastor sees",
          blocks: [
            {
              kind: "list",
              items: [
                "Group leader: their own 10–15 people, who attended, who vanished, who asked for prayer.",
                "Ministry lead: their team, the load, who has served without a break.",
                "Pastor: the church-wide picture — movement, new people, absentees, group health — not individual cards.",
                "Administrator: data quality — duplicates, empty contacts, people without a group.",
              ],
            },
            {
              kind: "callout",
              title: "Access is not about secrecy",
              text: "Separating access in a large church is not about hiding things; it is so everyone sees their own scope instead of drowning in someone else's. A leader with twelve people does not need a list of eight hundred.",
            },
          ],
        },
        {
          heading: "Three habits that hold a large church",
          blocks: [
            {
              kind: "list",
              items: [
                "Weekly attendance marking in every group — nothing else works without it.",
                "A monthly review of people without a group.",
                "A quarterly conversation with leaders about those who disappeared: not how many, but who and what was done.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Past 150 people, structure matters more than memory.",
        "Everyone should belong to a unit where absence is noticed within a week.",
        "The biggest risk is people in no group; find them with a filter, not intuition.",
        "Leaders see their scope, pastors see the summary. Different screens.",
      ],
      faq: [
        {
          q: "How big should a small group be?",
          a: "Small enough for the leader to notice everyone. Usually 8–15; beyond that one person's absence stops standing out and the unit loses its purpose.",
        },
        {
          q: "Do we need campuses if we meet in one building?",
          a: "Not necessarily. Campuses make sense with separate locations or several services with their own teams. Otherwise groups, ministries and generations are enough.",
        },
        {
          q: "How do we convince leaders to keep records?",
          a: "Show the benefit to them, not to the report. A leader who can see which of their people missed three weeks saves time rather than gaining paperwork.",
        },
      ],
      cta: {
        title: "See how the structure breaks down",
        text: "Groups, ministries, campuses and generations — and who belongs nowhere.",
        label: "All modules",
        href: "/modules",
      },
    },
  },
};
