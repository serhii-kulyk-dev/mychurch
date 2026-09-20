import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "yak-nalashtuvaty-ai-ahenta",
  category: "ai",
  date: "2026-09-12",
  minutes: 8,
  related: ["vid-vidviduvacha-do-lidera", "vasha-tserkva-unikalna", "dani-v-riznykh-mistsiakh"],
  copy: {
    ua: {
      seoTitle: "Як налаштувати ШІ-асистента, щоб він допомагав церкві",
      seoDescription:
        "Що має вміти помічник у церкві, які завдання йому можна довірити, де потрібне підтвердження людини й з чого почати, щоб він справді економив час.",
      title: "Як налаштувати помічника, щоб він вам допомагав",
      lead: "Помічник корисний не тоді, коли гарно відповідає, а тоді, коли робить кроки в системі: знаходить людей, збирає зміну, нагадує тим, хто не відповів.",
      keywords: [
        "ШІ-помічник для церкви",
        "асистент у Telegram для церкви",
        "автоматизація рутини в церкві",
        "розумний помічник адміністратора",
        "як використовувати ШІ в церкві",
      ],
      problem: {
        title: "Помічник, який лише розмовляє, не знімає навантаження",
        text: "Загальний чат-бот може написати гарний текст привітання, але не знає, хто з вашої групи не був місяць, і не вміє поставити вам нагадування подзвонити. Тому за тиждень ним перестають користуватись.",
      },
      sections: [
        {
          heading: "Три умови, без яких помічник марний",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Знає вашу базу, а не інтернет", text: "Він має відповідати по даних вашої церкви: люди, групи, служіння, події, явка. Інакше це просто пошук." },
                { title: "Діє, а не лише відповідає", text: "Знайти тих, хто випав, надіслати нагадування, забронювати залу, підготувати чернетки повідомлень лідерам." },
                { title: "Нічого не робить без вашого «так»", text: "Кожна дія, яка виходить назовні, показується вам як чернетка. Ви підтверджуєте — і лише тоді вона виконується." },
              ],
            },
            {
              kind: "quote",
              text: "Помічник має приносити готовий результат на підтвердження, а не список порад.",
            },
          ],
        },
        {
          heading: "З чого почати: три завдання першого місяця",
          blocks: [
            {
              kind: "table",
              columns: ["Завдання", "Що просите", "Що економить"],
              rows: [
                ["Хто зник", "Знайди тих, хто не був у моїй групі місяць", "Перегляд журналів явки вручну"],
                ["Зібрати зміну", "Які позиції не закриті на неділю, нагадай тим, хто мовчить", "Вечір суботніх дзвінків"],
                ["Підсумок тижня", "Що сталося в моєму служінні за тиждень", "Складання звіту руками"],
              ],
            },
            {
              kind: "text",
              text: "Не давайте помічнику десять завдань одразу. Три реальні, які повторюються щотижня, дадуть більше користі, ніж двадцять можливостей, про які ніхто не згадає.",
            },
          ],
        },
        {
          heading: "Як формулювати запит",
          blocks: [
            {
              kind: "list",
              items: [
                "Говоріть як з людиною: «хто не був у моїй групі вже місяць» працює краще за спроби вигадати команду.",
                "Одна мета в одному повідомленні. «Знайди і напиши» — нормально, «знайди, напиши, забронюй і склади звіт» — ні.",
                "Уточнюйте період: місяць, чотири зустрічі, з початку сезону.",
                "Якщо результат не той — виправляйте словами, а не починайте спочатку.",
              ],
            },
            {
              kind: "callout",
              title: "Помічник працює в межах ваших прав",
              text: "Лідер групи бачить через помічника лише свою групу, адміністратор — свою зону. Помічник не може показати більше, ніж людині дозволено бачити самій.",
            },
          ],
        },
        {
          heading: "Що не варто доручати",
          blocks: [
            {
              kind: "list",
              items: [
                "Особисті відповіді на молитовні потреби — це та частина, де потрібна саме людина.",
                "Рішення про людей: хто готовий до служіння, кого ставити лідером.",
                "Розсилки без перегляду. Навіть точний текст варто прочитати перед відправкою.",
                "Чутливі теми: конфлікти, опіка, фінансові труднощі родини.",
              ],
            },
            {
              kind: "text",
              text: "Правило просте: помічник бере на себе пошук, підготовку й нагадування. Рішення й турбота залишаються людям.",
            },
          ],
        },
        {
          heading: "Як зрозуміти, що налаштування вдалось",
          blocks: [
            {
              kind: "list",
              items: [
                "Лідери пишуть помічнику самі, без нагадувань зверху.",
                "Суботній обдзвін скоротився, бо нагадування пішли автоматично.",
                "Ніхто не питає «а де подивитись явку» — питають помічника.",
                "Ви жодного разу не знайшли дію, яка виконалась без підтвердження.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Помічник корисний тоді, коли діє в системі, а не просто відповідає.",
        "Почніть з трьох щотижневих завдань, а не з двадцяти можливостей.",
        "Кожна зовнішня дія — тільки після підтвердження людини.",
        "Рішення про людей і турбота не делегуються.",
      ],
      faq: [
        {
          q: "Чи бачить помічник особисті дані всієї церкви?",
          a: "Ні. Він працює в межах прав користувача: що людина не може відкрити сама, того їй не покаже й помічник.",
        },
        {
          q: "Чи можна дати помічнику власне ім'я?",
          a: "Так, церкви зазвичай так і роблять. Ім'я — це лише подача; важливіше, до яких даних і дій він має доступ.",
        },
        {
          q: "Що робити, якщо помічник помилився?",
          a: "Саме для цього кожна дія показується як чернетка. Помилку видно до відправлення, а не після.",
        },
      ],
      cta: {
        title: "Подивіться сценарії помічника",
        text: "Реальні запити лідерів і кроки, які помічник виконує в системі до вашого підтвердження.",
        label: "Сторінка ШІ-помічника",
        href: "/ai",
      },
    },
    en: {
      seoTitle: "Setting up an AI assistant that actually helps a church",
      seoDescription:
        "What a church assistant should be able to do, which tasks to delegate, where human confirmation is required, and how to start so it really saves time.",
      title: "Setting up an assistant that actually helps you",
      lead: "An assistant is useful not when it answers nicely, but when it takes steps in the system: finds people, fills a rota, reminds those who did not reply.",
      keywords: [
        "AI assistant for churches",
        "church automation assistant",
        "Telegram assistant church",
        "church admin automation",
        "using AI in ministry",
      ],
      problem: {
        title: "An assistant that only talks removes no load",
        text: "A generic chatbot can write a nice welcome message, but it does not know who in your group has been absent for a month and cannot set you a reminder to call them. So people stop using it within a week.",
      },
      sections: [
        {
          heading: "Three conditions, or it is useless",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "It knows your database, not the internet", text: "It answers from your church data: people, groups, ministries, events, attendance." },
                { title: "It acts, not only replies", text: "Finds who dropped off, sends reminders, books a room, drafts messages to leaders." },
                { title: "Nothing happens without your yes", text: "Every outgoing action is shown as a draft and executed only after you confirm." },
              ],
            },
            { kind: "quote", text: "An assistant should bring a finished result for approval, not a list of advice." },
          ],
        },
        {
          heading: "Where to start: three tasks for month one",
          blocks: [
            {
              kind: "table",
              columns: ["Task", "What you ask", "What it saves"],
              rows: [
                ["Who disappeared", "Find who has missed my group for a month", "Manually reading attendance logs"],
                ["Fill the rota", "Which Sunday positions are open, remind the silent ones", "A Saturday of phone calls"],
                ["Weekly summary", "What happened in my ministry this week", "Writing the report by hand"],
              ],
            },
            {
              kind: "text",
              text: "Do not hand over ten tasks at once. Three that repeat every week beat twenty capabilities nobody remembers.",
            },
          ],
        },
        {
          heading: "How to phrase a request",
          blocks: [
            {
              kind: "list",
              items: [
                "Speak as you would to a person; invented command syntax works worse.",
                "One goal per message. Find and message is fine; find, message, book and report is not.",
                "Name the period: a month, four meetings, since the season started.",
                "If the result is off, correct it in words rather than starting over.",
              ],
            },
            {
              kind: "callout",
              title: "It works within your permissions",
              text: "A group leader sees only their group through the assistant, an administrator their area. It can never show more than the person may see themselves.",
            },
          ],
        },
        {
          heading: "What not to delegate",
          blocks: [
            {
              kind: "list",
              items: [
                "Personal replies to prayer needs.",
                "Decisions about people: who is ready to serve, who should lead.",
                "Unreviewed broadcasts. Even a correct text deserves a read before sending.",
                "Sensitive matters: conflict, pastoral care, family finances.",
              ],
            },
            {
              kind: "text",
              text: "The rule is simple: the assistant takes searching, preparing and reminding. Decisions and care stay with people.",
            },
          ],
        },
        {
          heading: "How to know it worked",
          blocks: [
            {
              kind: "list",
              items: [
                "Leaders write to it without being told to.",
                "The Saturday phone marathon shrank because reminders went out automatically.",
                "Nobody asks where to find attendance any more.",
                "You have never found an action executed without confirmation.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "An assistant earns its place by acting in the system, not by answering.",
        "Start with three weekly tasks.",
        "Every outgoing action needs human confirmation.",
        "Decisions about people are never delegated.",
      ],
      faq: [
        {
          q: "Does it see everyone's personal data?",
          a: "No. It works inside the user's permissions: what a person cannot open themselves, the assistant will not show them.",
        },
        {
          q: "Can we give it our own name?",
          a: "Yes, churches usually do. The name is presentation; what matters is the data and actions it can reach.",
        },
        {
          q: "What if it gets something wrong?",
          a: "That is why every action appears as a draft. Mistakes are visible before sending, not after.",
        },
      ],
      cta: {
        title: "See the assistant scenarios",
        text: "Real requests from leaders and the steps the assistant takes before you confirm.",
        label: "AI assistant page",
        href: "/ai",
      },
    },
  },
};
