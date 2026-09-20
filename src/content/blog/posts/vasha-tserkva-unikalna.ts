import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "vasha-tserkva-unikalna",
  category: "process",
  date: "2026-09-18",
  minutes: 8,
  related: ["yak-obraty-systemu-dlia-tserkvy", "dani-v-riznykh-mistsiakh", "piat-pytan-pro-systemu"],
  copy: {
    ua: {
      seoTitle: "Ваша церква унікальна: система має підлаштуватись під вас",
      seoDescription:
        "Чому церкві не варто ламати свої процеси заради програми: що можна налаштувати під себе, а що дійсно варто змінити, і як перевірити це до впровадження.",
      title: "Ваша церква унікальна — не підлаштовуйтесь під систему",
      lead: "Назви служінь, структура, шлях людини, навіть те, кого ви вважаєте членом церкви, — у кожній громаді своє. Система, яка вимагає це переписати, коштуватиме вам більше, ніж здається.",
      keywords: [
        "налаштування системи під церкву",
        "гнучка система для церкви",
        "своя структура церкви в програмі",
        "впровадження системи в церкві",
        "система під процеси церкви",
      ],
      problem: {
        title: "Програма диктує, як має жити громада",
        text: "У системі є «members» і «visitors», а у вас — п'ять станів. Є «groups», а у вас групи, домашні церкви й молодіжні команди. І щоразу доводиться пояснювати лідерам, чому в програмі все називається не так, як у житті.",
      },
      sections: [
        {
          heading: "Що в кожній церкві справді своє",
          blocks: [
            {
              kind: "list",
              items: [
                "Назви: служіння, домашні групи, покоління, спільноти — словник громади складався роками.",
                "Структура: один зал, кілька кампусів, мережа домашніх церков, служіння в кількох містах.",
                "Шлях людини: у когось курс перед членством, у когось хрещення, у когось наставництво.",
                "Ролі та доступи: де пастор бачить усе, а де свідомо ні.",
                "Ритм року: сезони, табори, свята, які не збігаються ні з чиїм шаблоном.",
              ],
            },
            {
              kind: "text",
              text: "Це не примхи. Це і є ідентичність громади: те, як вона говорить про себе й як ухвалює рішення. Система, яка стирає цей словник, поступово стирає й участь людей — бо вони перестають впізнавати в ній свою церкву.",
            },
          ],
        },
        {
          heading: "Що варто змінити, а що — залишити",
          blocks: [
            {
              kind: "table",
              columns: ["Що", "Підлаштовуємо систему", "Змінюємо практику"],
              rows: [
                ["Назви й словник", "Так, завжди", "—"],
                ["Етапи шляху людини", "Так", "—"],
                ["Структура громади", "Так", "—"],
                ["Дані у п'яти таблицях", "—", "Так: один список людей"],
                ["Усні домовленості замість графіка", "—", "Так: графік у спільному місці"],
                ["Доступ «у всіх до всього»", "—", "Так: ролі й межі"],
              ],
            },
            {
              kind: "text",
              text: "Правило просте: підлаштовувати систему треба під те, що є ідентичністю церкви, і не варто — під те, що є просто безладом. Безлад не унікальний: він однаковий у всіх.",
            },
          ],
        },
        {
          heading: "Питання, які варто поставити до впровадження",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Чи можна перейменувати сутності?", text: "Якщо «мала група» ніяк не стане «домашньою церквою», уся подальша робота йтиме проти вашого словника." },
                { title: "Чи можна додати свої поля?", text: "У кожної церкви є те, що вона обов'язково фіксує: рік хрещення, місто, волонтерська згода." },
                { title: "Чи можна змінити етапи?", text: "Шлях людини має описувати вашу практику, а не практику розробника." },
                { title: "Що станеться, якщо ми передумаємо?", text: "Гнучкість перевіряється не на старті, а на другій зміні рішення." },
              ],
            },
          ],
        },
        {
          heading: "Гнучкість не означає «зроблю все з нуля»",
          blocks: [
            {
              kind: "callout",
              title: "Межа розумного",
              text: "Хороша система дає готові модулі й дозволяє налаштувати назви, поля, етапи, ролі та звіти. Але якщо доводиться писати процес з нуля для кожної дрібниці, це вже не гнучкість, а перекладання роботи на вас.",
            },
            {
              kind: "text",
              text: "Орієнтир такий: типова церква має запуститись за тиждень-два на готових модулях, а налаштування під себе — робити поступово, у процесі, без програміста.",
            },
          ],
        },
        {
          heading: "Як це працює в «Моїй Церкві»",
          blocks: [
            {
              kind: "list",
              items: [
                "Модулі вмикаються окремо: беріть тільки те, що потрібно вашій громаді зараз.",
                "Назви й поля змінюються під ваш словник.",
                "Етапи шляху людини описуєте ви, а не шаблон.",
                "Ролі й доступи налаштовуються під вашу структуру — від однієї церкви до мережі кампусів.",
              ],
            },
            {
              kind: "text",
              text: "Мета одна: щоб лідер, відкривши систему, бачив свою церкву, а не чужу схему.",
            },
          ],
        },
      ],
      takeaways: [
        "Словник, структура й шлях людини — це ідентичність громади, її не варто ламати.",
        "Безлад у даних не є унікальністю: його варто змінювати.",
        "Гнучкість перевіряється на другій зміні рішення, а не на старті.",
        "Запуск на готових модулях, налаштування — поступово й без програміста.",
      ],
      faq: [
        {
          q: "Чи не стане надмірна гнучкість джерелом хаосу?",
          a: "Стане, якщо налаштовувати все одразу. Тому починають із базової конфігурації, живуть із нею місяць і змінюють тільки те, що реально заважає.",
        },
        {
          q: "Хто має відповідати за налаштування?",
          a: "Одна людина в церкві — адміністратор системи. Не комітет: узгодження назв комітетом триває довше, ніж саме впровадження.",
        },
        {
          q: "Що робити, якщо в нас кілька церков у мережі?",
          a: "Спільна структура з окремими кампусами: спільні довідники й ролі, але свої люди, групи й звіти в кожної локації.",
        },
      ],
      cta: {
        title: "Подивіться, що саме налаштовується",
        text: "Модулі, назви, поля, етапи й ролі — під вашу церкву, а не навпаки.",
        label: "Модуль «Налаштування»",
        href: "/modules/customization",
      },
    },
    en: {
      seoTitle: "Your church is unique: the system should adapt to you",
      seoDescription:
        "Why a church should not rewrite its processes for software: what to configure, what genuinely needs changing, and how to test it before you commit.",
      title: "Your church is unique — do not bend to the software",
      lead: "Ministry names, structure, the path a person walks, even who counts as a member: every church does it differently. Software that demands you rewrite that costs more than it looks.",
      keywords: [
        "configurable church software",
        "flexible church management system",
        "custom church structure software",
        "church software implementation",
        "church database custom fields",
      ],
      problem: {
        title: "The software dictates how the church should live",
        text: "The system has members and visitors; you have five states. It has groups; you have groups, house churches and youth teams. And every time, leaders have to be told why nothing is called what they call it.",
      },
      sections: [
        {
          heading: "What is genuinely unique in every church",
          blocks: [
            {
              kind: "list",
              items: [
                "Vocabulary: ministries, house groups, generations, communities — built over years.",
                "Structure: one room, several campuses, a network of house churches, work in several cities.",
                "The path of a person: a course before membership here, baptism there, mentoring elsewhere.",
                "Roles and access: where the pastor sees everything and where deliberately not.",
                "The rhythm of the year: seasons, camps and feasts that match nobody's template.",
              ],
            },
            {
              kind: "text",
              text: "These are not whims. They are identity: how a church speaks about itself and makes decisions. Software that erases that vocabulary gradually erases participation too, because people stop recognising their own church in it.",
            },
          ],
        },
        {
          heading: "What to change and what to keep",
          blocks: [
            {
              kind: "table",
              columns: ["Area", "Adapt the system", "Change the practice"],
              rows: [
                ["Names and vocabulary", "Always", "—"],
                ["Stages of the path", "Yes", "—"],
                ["Church structure", "Yes", "—"],
                ["Data in five spreadsheets", "—", "Yes: one list of people"],
                ["Verbal agreements instead of a rota", "—", "Yes: a shared rota"],
                ["Everyone can see everything", "—", "Yes: roles and boundaries"],
              ],
            },
            {
              kind: "text",
              text: "The rule: adapt the system to what is identity, and do not adapt it to what is simply mess. Mess is not unique — it looks the same everywhere.",
            },
          ],
        },
        {
          heading: "Questions to ask before you commit",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Can entities be renamed?", text: "If small group can never become house church, everything afterwards fights your vocabulary." },
                { title: "Can we add our own fields?", text: "Every church records something specific: year of baptism, city, volunteer consent." },
                { title: "Can stages be changed?", text: "The path should describe your practice, not the developer's." },
                { title: "What if we change our minds?", text: "Flexibility is tested on the second change of mind, not the first setup." },
              ],
            },
          ],
        },
        {
          heading: "Flexible does not mean build it yourself",
          blocks: [
            {
              kind: "callout",
              title: "The reasonable limit",
              text: "Good software ships ready modules and lets you configure names, fields, stages, roles and reports. If every small thing has to be built from scratch, that is not flexibility — it is work handed back to you.",
            },
            {
              kind: "text",
              text: "A fair benchmark: a typical church should go live in a week or two on ready modules, then tune things gradually, without a developer.",
            },
          ],
        },
        {
          heading: "How MyChurch handles it",
          blocks: [
            {
              kind: "list",
              items: [
                "Modules switch on separately: take only what your church needs now.",
                "Names and fields follow your vocabulary.",
                "You describe the stages of the path, not a template.",
                "Roles and access match your structure, from one church to a network of campuses.",
              ],
            },
            {
              kind: "text",
              text: "One goal: a leader who opens the system should see their own church, not someone else's diagram.",
            },
          ],
        },
      ],
      takeaways: [
        "Vocabulary, structure and the path of a person are identity — do not break them.",
        "Messy data is not uniqueness; change that part.",
        "Flexibility is proven on the second change of mind.",
        "Launch on ready modules, configure gradually, without a developer.",
      ],
      faq: [
        {
          q: "Will too much flexibility create chaos?",
          a: "It will if you configure everything at once. Start with a basic setup, live with it for a month, and change only what genuinely gets in the way.",
        },
        {
          q: "Who should own the configuration?",
          a: "One person: the system administrator. Not a committee — agreeing names by committee takes longer than the rollout itself.",
        },
        {
          q: "What if we are a network of churches?",
          a: "A shared structure with separate campuses: common directories and roles, but each location with its own people, groups and reports.",
        },
      ],
      cta: {
        title: "See what can be configured",
        text: "Modules, names, fields, stages and roles — shaped to your church, not the other way round.",
        label: "Customisation module",
        href: "/modules/customization",
      },
    },
  },
};
