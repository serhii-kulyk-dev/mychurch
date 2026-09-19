import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "zakhyst-personalnykh-danykh",
  category: "data",
  date: "2026-07-15",
  minutes: 7,
  related: ["dani-v-riznykh-mistsiakh", "yak-obraty-systemu-dlia-tserkvy", "skilky-liudei-u-tserkvi"],
  copy: {
    ua: {
      seoTitle: "Персональні дані в церкві: доступи, згода, безпека",
      seoDescription:
        "Хто в церкві має бачити контакти й чутливу інформацію, як налаштувати доступи за ролями, що робити з даними дітей і як не втратити все разом з однією таблицею.",
      title: "Персональні дані церкви: хто що бачить",
      lead: "Церква зберігає більше чутливого, ніж більшість організацій: адреси, здоров'я, сімейні обставини, молитовні потреби. І майже ніде це не захищено навіть паролем.",
      keywords: [
        "персональні дані в церкві",
        "доступи в церковній системі",
        "захист даних членів церкви",
        "згода на обробку даних церква",
        "безпека бази церкви",
      ],
      problem: {
        title: "Таблиця з контактами в загальному чаті",
        text: "Файл «Люди_2026_остання_версія.xlsx» переслали в чат лідерів, звідти — ще в один чат. Тепер копія з адресами й телефонами лежить у телефонах у двадцяти людей, і жоден з них про це не пам'ятає.",
      },
      sections: [
        {
          heading: "Три рівні чутливості",
          blocks: [
            {
              kind: "table",
              columns: ["Рівень", "Що це", "Хто має бачити"],
              rows: [
                ["Базовий", "Ім'я, група, служіння", "Лідери відповідних груп і служінь"],
                ["Контактний", "Телефон, пошта, адреса", "Лідер своєї групи, адміністратор"],
                ["Чутливий", "Здоров'я, опіка, конфлікти, фінансова допомога", "Пастор і призначені особи"],
              ],
            },
            {
              kind: "text",
              text: "Помилка більшості церков не в тому, що дані відкриті, а в тому, що рівнів немає взагалі: або в людини немає доступу ні до чого, або вона отримує файл з усім одразу.",
            },
          ],
        },
        {
          heading: "Правила, які варто прийняти письмово",
          blocks: [
            {
              kind: "list",
              items: [
                "Доступ надається за роллю, а не за близькістю до керівництва.",
                "Лідер бачить свою групу, а не всю громаду.",
                "Дані не виносяться з системи: жодних вивантажень у чат.",
                "Доступ знімається того ж дня, коли людина завершує служіння.",
                "Чутливі записи веде обмежене коло, і про це знає той, кого це стосується.",
              ],
            },
            {
              kind: "callout",
              title: "Найбільший ризик — не хакер",
              text: "Реальна загроза для церкви — це файл, переданий у чат, і колишній лідер, у якого досі є доступ. Обидві проблеми вирішуються ролями, а не шифруванням.",
            },
          ],
        },
        {
          heading: "Згода і прозорість",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Скажіть людям, що саме зберігаєте", text: "Коротко й людською мовою: контакти, участь у групах, відвідування." },
                { title: "Питайте згоду там, де це доречно", text: "Фото з подій, публікація дня народження, участь у розсилках." },
                { title: "Дайте право виправити", text: "Людина має могти оновити свої дані — через бота або лідера." },
                { title: "Окремо домовтесь про дітей", text: "Дані дітей ведуться з прив'язкою до батьків, і згоду дають батьки." },
              ],
            },
          ],
        },
        {
          heading: "Технічний мінімум",
          blocks: [
            {
              kind: "list",
              items: [
                "Особистий вхід у кожного, без спільного пароля на всіх.",
                "Ролі з різними правами, а не «адміністратор для всіх, хто просить».",
                "Резервні копії, які хтось хоч раз перевіряв на відновлення.",
                "Журнал дій: видно, хто змінив запис і коли.",
                "Вивантаження даних — окреме право, а не звичайна кнопка для всіх.",
              ],
            },
            {
              kind: "text",
              text: "Цей мінімум не робить церкву фортецею, але прибирає 90% реальних інцидентів: випадкові витоки, забуті доступи, втрачені файли.",
            },
          ],
        },
      ],
      takeaways: [
        "Рівнів доступу має бути щонайменше три, а не жодного.",
        "Найчастіший витік — файл у чаті, а не зовнішня атака.",
        "Доступ знімається того ж дня, коли завершилось служіння.",
        "Дані дітей ведуться через сім'ю і за згодою батьків.",
      ],
      faq: [
        {
          q: "Чи можна давати лідерам телефони їхньої групи?",
          a: "Так, це їхня робота. Питання не в тому, чи давати, а в тому, щоб доступ був у системі, а не у вигляді файлу, який житиме вічно.",
        },
        {
          q: "Що робити з даними людини, яка пішла з церкви?",
          a: "Перевести запис в архів, обмежити доступ і зберегти лише те, що потрібно для історії. Видалення на вимогу людини слід виконувати.",
        },
        {
          q: "Хто в церкві відповідає за дані?",
          a: "Має бути одна призначена людина — зазвичай адміністратор системи. Спільна відповідальність на практиці означає її відсутність.",
        },
      ],
      cta: {
        title: "Питання про безпеку й доступи",
        text: "Як влаштовані ролі, резервні копії та доступи — коротко, без технічного жаргону.",
        label: "Питання та відповіді",
        href: "/faq",
      },
    },
    en: {
      seoTitle: "Personal data in church: access, consent, safety",
      seoDescription:
        "Who should see contacts and sensitive information, how to set role-based access, what to do with children's data and how not to lose everything with one spreadsheet.",
      title: "Church personal data: who sees what",
      lead: "A church holds more sensitive information than most organisations — addresses, health, family circumstances, prayer needs — and usually keeps it without even a password.",
      keywords: [
        "church data protection",
        "church database access control",
        "personal data in churches",
        "consent for church data",
        "church data security",
      ],
      problem: {
        title: "The contact spreadsheet in a group chat",
        text: "A file called people_2026_final.xlsx was forwarded into the leaders' chat, and from there into another. Copies with addresses and phone numbers now sit on twenty phones, and nobody remembers.",
      },
      sections: [
        {
          heading: "Three levels of sensitivity",
          blocks: [
            {
              kind: "table",
              columns: ["Level", "What it is", "Who should see it"],
              rows: [
                ["Basic", "Name, group, ministry", "Leaders of those groups and ministries"],
                ["Contact", "Phone, email, address", "Their own group leader, administrator"],
                ["Sensitive", "Health, care, conflict, financial help", "Pastor and named people"],
              ],
            },
            {
              kind: "text",
              text: "The usual mistake is not that data is open, but that there are no levels at all: either someone has access to nothing, or they get a file with everything.",
            },
          ],
        },
        {
          heading: "Rules worth writing down",
          blocks: [
            {
              kind: "list",
              items: [
                "Access follows role, not closeness to leadership.",
                "A leader sees their group, not the whole church.",
                "Data does not leave the system — no exports into chats.",
                "Access is removed the day a role ends.",
                "Sensitive notes are kept by a limited circle, and the person concerned knows.",
              ],
            },
            {
              kind: "callout",
              title: "The biggest risk is not a hacker",
              text: "The real threats are a file forwarded into a chat and a former leader who still has access. Both are solved by roles, not encryption.",
            },
          ],
        },
        {
          heading: "Consent and transparency",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Tell people what you store", text: "Briefly and in plain language: contacts, group participation, attendance." },
                { title: "Ask consent where it matters", text: "Event photos, birthday announcements, mailing lists." },
                { title: "Let people correct their data", text: "Through the bot or their leader." },
                { title: "Agree separately about children", text: "Children's records are linked to parents, and parents give consent." },
              ],
            },
          ],
        },
        {
          heading: "The technical minimum",
          blocks: [
            {
              kind: "list",
              items: [
                "A personal login for everyone, never one shared password.",
                "Roles with different rights, not administrator for anyone who asks.",
                "Backups that somebody has actually tested by restoring.",
                "An action log showing who changed what and when.",
                "Exporting data as a separate permission, not a button for all.",
              ],
            },
            {
              kind: "text",
              text: "This does not make a church a fortress, but it removes 90% of real incidents: accidental leaks, forgotten access, lost files.",
            },
          ],
        },
      ],
      takeaways: [
        "Have at least three access levels rather than none.",
        "The common leak is a file in a chat, not an external attack.",
        "Access ends the day the role ends.",
        "Children's data goes through the family, with parental consent.",
      ],
      faq: [
        {
          q: "Can leaders have their group's phone numbers?",
          a: "Yes, it is their job. The question is that access lives in the system rather than in a file that will outlive everyone.",
        },
        {
          q: "What about data of someone who left?",
          a: "Archive the record, restrict access and keep only what history requires. Deletion on request should be honoured.",
        },
        {
          q: "Who is responsible for data in a church?",
          a: "One named person, usually the system administrator. Shared responsibility means none in practice.",
        },
      ],
      cta: {
        title: "Questions about access and safety",
        text: "How roles, backups and access work, in plain language.",
        label: "Questions and answers",
        href: "/faq",
      },
    },
  },
};
