import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "telegram-bot-dlia-tserkvy",
  category: "ai",
  date: "2026-08-30",
  minutes: 7,
  related: ["yak-nalashtuvaty-ai-ahenta", "zaiavky-ta-zvernennia", "oblik-vidviduvanosti"],
  copy: {
    ua: {
      seoTitle: "Telegram-бот для церкви: що варто автоматизувати",
      seoDescription:
        "Які завдання церкви реально закриває бот у Telegram: явка, заявки, графіки служінь, приєднання до групи. Що робити ботом, а що залишити людям.",
      title: "Telegram-бот для церкви: що автоматизувати першим",
      lead: "Церква вже живе в Telegram: там групи, там оголошення, там питання. Бот потрібен не щоб додати ще один застосунок, а щоб дії відбувались там, де люди вже є.",
      keywords: [
        "Telegram-бот для церкви",
        "бот для малої групи",
        "автоматизація церкви в Telegram",
        "як відмічати явку в телеграмі",
        "бот для служінь",
      ],
      problem: {
        title: "Застосунок поставили, але ніхто ним не користується",
        text: "Найчастіша історія: церква впроваджує систему, а лідери й далі пишуть у чат. Не тому що система погана — тому що заради однієї відмітки не хочеться відкривати окремий застосунок.",
      },
      sections: [
        {
          heading: "Що бот закриває найкраще",
          blocks: [
            {
              kind: "list",
              items: [
                "Відмітка присутності на зустрічі групи — кілька дотиків без переходів.",
                "Підтвердження зміни в служінні: «буду» чи «не зможу», з причиною.",
                "Приєднання нової людини до групи за посиланням, без анкет на папері.",
                "Заявки й молитовні потреби, які одразу стають записом з відповідальним.",
                "Нагадування: зустріч, зміна, подія — тим, хто справді має прийти.",
              ],
            },
            {
              kind: "text",
              text: "Спільна риса цих завдань — вони короткі й повторюються щотижня. Саме такі дії варто виносити в месенджер; усе довше залишається в застосунку.",
            },
          ],
        },
        {
          heading: "Меню має залежати від ролі",
          blocks: [
            {
              kind: "table",
              columns: ["Роль", "Що бачить у меню", "Чого не бачить"],
              rows: [
                ["Учасник групи", "Своя група, своя явка, відгук про зустріч", "Чужу явку й списки інших"],
                ["Лідер групи", "Свої групи, справи, відмітка явки, теми", "Дані інших груп"],
                ["Служитель", "Свої зміни, задачі на зміну, підтвердження", "Керування командами"],
                ["Адміністратор", "Люди, сім'ї, аналітика, форми, пошук", "—"],
              ],
            },
            {
              kind: "text",
              text: "Одне й те саме меню, яке бачать усі, швидко перетворюється на список незрозумілих кнопок. Роль має визначати, що людина бачить першим.",
            },
          ],
        },
        {
          heading: "Чого не варто робити ботом",
          blocks: [
            {
              kind: "list",
              items: [
                "Довгі форми: десять полів у чаті — це гірше, ніж сторінка в застосунку.",
                "Пастирські розмови: бот може передати запит, але не вести розмову замість людини.",
                "Складна аналітика: у чаті доречні три цифри, а не таблиця на екран.",
                "Все підряд: бот, у якому 60 кнопок, використовується так само рідко, як і застосунок.",
              ],
            },
            {
              kind: "callout",
              title: "Правило двох дотиків",
              text: "Якщо щотижнева дія вимагає більше двох дотиків у боті, її або спрощують, або повертають у застосунок.",
            },
          ],
        },
        {
          heading: "Як запустити без опору",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Почніть з лідерів груп", text: "Одна дія — відмітка явки. Коли вона приживеться, додавайте решту." },
                { title: "Покажіть користь одразу", text: "Після відмітки лідер бачить, хто з його людей зник. Це і є причина натискати кнопку щотижня." },
                { title: "Не дублюйте канали", text: "Якщо нагадування приходить і в боті, і в чаті, люди перестають читати обидва." },
                { title: "Тримайте зв'язок з даними", text: "Усе, що зроблено в боті, має одразу бути в системі, інакше ви створите ще одне місце зберігання." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "У месенджер виносять короткі дії, які повторюються щотижня.",
        "Меню має залежати від ролі, інакше це список незрозумілих кнопок.",
        "Щотижнева дія — не більше двох дотиків.",
        "Бот має писати в ту саму базу, а не створювати нову.",
      ],
      faq: [
        {
          q: "Чи обов'язково всім встановлювати застосунок?",
          a: "Ні. Більшості учасників вистачає бота: явка, група, заявка. Застосунок потрібен тим, хто працює з даними — адміністраторам і координаторам.",
        },
        {
          q: "Що з приватністю в месенджері?",
          a: "Бот показує людині лише її дані й дані, до яких вона має доступ за роллю. Персональні списки не надсилаються в загальні чати.",
        },
        {
          q: "Чи можна користуватись іншим месенджером?",
          a: "Так, підхід той самий. Вибір залежить від того, де вже сидить ваша громада, а не від технології.",
        },
      ],
      cta: {
        title: "Подивіться, як виглядає бот церкви",
        text: "Меню за ролями, приєднання до групи, явка й заявки — у знайомому месенджері.",
        label: "Сторінка Telegram-бота",
        href: "/telegram",
      },
    },
    en: {
      seoTitle: "A Telegram bot for a church: what to automate",
      seoDescription:
        "Which church tasks a messenger bot really covers: attendance, requests, rotas, joining a group — and what should stay with people.",
      title: "A church bot: what to automate first",
      lead: "Your church already lives in a messenger. A bot is not another app to install; it puts actions where people already are.",
      keywords: [
        "church Telegram bot",
        "small group bot",
        "church automation messenger",
        "attendance bot church",
        "volunteer rota bot",
      ],
      problem: {
        title: "The app is installed and nobody uses it",
        text: "The familiar story: a church rolls out a system and leaders keep writing in the chat. Not because the system is bad, but because nobody opens a separate app for one attendance mark.",
      },
      sections: [
        {
          heading: "What a bot covers best",
          blocks: [
            {
              kind: "list",
              items: [
                "Attendance at a group meeting, in a couple of taps.",
                "Rota confirmation: I will be there, or I cannot, with a reason.",
                "Joining a group from a link, with no paper forms.",
                "Requests and prayer needs that immediately become records with an owner.",
                "Reminders about meetings, shifts and events for the people who are actually involved.",
              ],
            },
            {
              kind: "text",
              text: "They share one trait: short and weekly. Those are the actions worth moving into a messenger; anything longer belongs in the app.",
            },
          ],
        },
        {
          heading: "The menu must follow the role",
          blocks: [
            {
              kind: "table",
              columns: ["Role", "Sees in the menu", "Does not see"],
              rows: [
                ["Group member", "Their group, their attendance, feedback", "Anyone else's attendance"],
                ["Group leader", "Their groups, tasks, attendance, topics", "Other groups' data"],
                ["Volunteer", "Their shifts, shift tasks, confirmation", "Team management"],
                ["Administrator", "People, families, analytics, forms, search", "—"],
              ],
            },
            {
              kind: "text",
              text: "One menu for everyone quickly becomes a wall of unclear buttons. The role should decide what a person sees first.",
            },
          ],
        },
        {
          heading: "What not to do with a bot",
          blocks: [
            {
              kind: "list",
              items: [
                "Long forms: ten fields in a chat is worse than one page in an app.",
                "Pastoral conversations: a bot can pass on a request, not hold the conversation.",
                "Heavy analytics: three numbers belong in a chat, a full table does not.",
                "Everything at once: a bot with sixty buttons gets used as rarely as the app.",
              ],
            },
            {
              kind: "callout",
              title: "The two-tap rule",
              text: "If a weekly action needs more than two taps in the bot, simplify it or move it back to the app.",
            },
          ],
        },
        {
          heading: "Rolling it out without resistance",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Start with group leaders", text: "One action: attendance. Add the rest once it sticks." },
                { title: "Show the payoff immediately", text: "After marking, the leader sees who disappeared. That is the reason to tap the button next week." },
                { title: "Do not duplicate channels", text: "If a reminder arrives in both the bot and the chat, people stop reading both." },
                { title: "Keep it connected to the data", text: "Everything done in the bot must land in the same system, or you have created another silo." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Move short, weekly actions into the messenger.",
        "Menus follow roles.",
        "A weekly action takes at most two taps.",
        "The bot writes into the same database, never a new one.",
      ],
      faq: [
        {
          q: "Does everyone have to install the app?",
          a: "No. Most members need only the bot. The app is for those who work with data: administrators and coordinators.",
        },
        {
          q: "What about privacy in a messenger?",
          a: "The bot shows a person only their own data and what their role allows. Personal lists are never posted into group chats.",
        },
        {
          q: "Can we use a different messenger?",
          a: "Yes, the approach is the same. Choose where your congregation already is, not the technology.",
        },
      ],
      cta: {
        title: "See what the church bot looks like",
        text: "Role-based menus, joining a group, attendance and requests in a familiar messenger.",
        label: "Telegram bot page",
        href: "/telegram",
      },
    },
  },
};
