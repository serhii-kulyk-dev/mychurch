import type { Lang } from "@/lib/i18n";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/seo";

/* ────────────────────────────────────────────────────────────────
   ЧЕРНЕТКА. Тексти написані під те, що сайт і система реально
   роблять сьогодні, і узгоджені з відповідями в розділі «Питання»
   (термін зберігання, сервери в ЄС, експорт, перелік інтеграцій).

   ПЕРЕД ПУБЛІКАЦІЄЮ:
   1. ✔ ENTITY заповнено (ФОП Кулик С. В., ІПН 3600912298).
      Юридичної адреси в документах немає свідомо — для зв'язку вистачає
      пошти й телефону в кінці сторінки. Якщо юрист скаже інакше — додати сюди.
   2. Дати обидва тексти на перевірку юристу.
   3. Перевірити перелік субпідрядників у «Кому ми передаємо дані»:
      там має бути рівно те, що ввімкнено в продакшені.
   ──────────────────────────────────────────────────────────────── */

/** Реквізити постачальника послуги. Поки не заповнено — видно на сторінці. */
const ENTITY_UA = "ФОП Кулик Сергій Віталійович, ІПН 3600912298";
const ENTITY_EN = "Serhii Kulyk, individual entrepreneur (Ukraine), tax ID 3600912298";

/** Дата останнього перегляду документів. */
export const LEGAL_UPDATED = "2026-09-19";

export interface LegalSection {
  heading: string;
  /** Абзаци тексту. */
  body?: string[];
  /** Маркований список під абзацами. */
  list?: string[];
  /** Під розділом показується перемикач «не рахувати мене». */
  optOut?: boolean;
}

export interface LegalCopy {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  updatedLabel: string;
  lead: string;
  sections: LegalSection[];
  contactHeading: string;
  contactText: string;
  backLabel: string;
}

const privacyUa: LegalCopy = {
  seoTitle: "Політика конфіденційності — Моя Церква",
  seoDescription:
    "Як «Моя Церква» обробляє персональні дані: які дані збираємо, де їх зберігаємо, кому передаємо, скільки тримаємо і які права має церква та її члени.",
  eyebrow: "Правова інформація",
  title: "Політика конфіденційності",
  updatedLabel: "Оновлено",
  lead:
    "Церква довіряє нам дані своїх людей — імена, контакти, участь у служіннях. Нижче чесно описано, що саме ми з ними робимо, а чого не робимо ніколи.",
  sections: [
    {
      heading: "1. Хто за що відповідає",
      body: [
        `Послугу надає ${ENTITY_UA} (далі — «ми», «Моя Церква»).`,
        "Щодо даних членів громади розпорядником є церква, а не ми. Церква вирішує, кого внести в систему, які поля заповнити й хто з команди матиме доступ. Ми виступаємо обробником: працюємо з цими даними лише за вказівкою церкви й лише для того, щоб система працювала.",
        "Щодо даних, які ви залишаєте на цьому сайті (форма демо, бриф, звернення в підтримку), розпорядником є ми.",
      ],
    },
    {
      heading: "2. Які дані ми обробляємо",
      body: ["Три різні набори, з різними підставами й строками."],
      list: [
        "Заявки з сайту: ім'я та номер телефону, які ви вводите у формі, плюс те, що ви самі написали про свою церкву. Використовуємо, щоб зв'язатися з вами й підготувати пропозицію.",
        "Дані в системі церкви: картки людей (ім'я, контакти, дата народження, родинні зв'язки, статус, участь у групах і служіннях, відмітки приходу, нотатки лідерів). Їх вносить церква — ми лише зберігаємо й показуємо їх тим, кому церква дала доступ.",
        "Технічні дані: адреса запиту, тип браузера, час звернення, журнали помилок. Потрібні, щоб система працювала й щоб ми бачили збої.",
      ],
    },
    {
      heading: "3. На якій підставі",
      list: [
        "Заявки з сайту — ваша згода, яку ви даєте, надсилаючи форму. Її можна відкликати в будь-який момент, написавши нам.",
        "Дані в системі — договір з церквою та її законний інтерес вести облік власної громади. Підставу щодо своїх членів визначає церква.",
        "Технічні дані — наш законний інтерес забезпечувати роботу й безпеку сервісу.",
      ],
    },
    {
      heading: "4. Чого ми не робимо",
      list: [
        "Не продаємо й не передаємо дані церкви третім особам для реклами.",
        "Не використовуємо дані однієї церкви, щоб щось продати іншій.",
        "Не читаємо нотатки лідерів і картки людей заради цікавості: доступ співробітника до бази церкви можливий лише на запит церкви (наприклад, коли ви просите допомогти з імпортом чи відновленням) і фіксується в журналі.",
      ],
    },
    {
      heading: "5. Кому ми передаємо дані",
      body: [
        "Лише тим постачальникам, без яких сервіс не працює, і лише в обсязі, потрібному для конкретної функції:",
      ],
      list: [
        "Хостинг і бази даних — сервери в Європейському Союзі.",
        "Telegram — щоб бот церкви надсилав повідомлення тим, хто на нього підписався.",
        "Viber, Twilio, Turbo SMS — доставка SMS і повідомлень, якщо церква ввімкнула ці канали.",
        "Google (Таблиці, Календар) — лише коли церква сама під'єднала інтеграцію та надала доступ.",
        "Google Analytics — знеособлена статистика відвідувань цього сайту (без даних із системи церкви).",
      ],
    },
    {
      heading: "6. Де зберігаються й як захищені",
      list: [
        "Дані зберігаються на серверах у Європейському Союзі.",
        "Передача даних між браузером і сервером захищена TLS.",
        "Доступ видається за ролями: кожен бачить рівно те, що потрібно для його служіння.",
        "Резервні копії створюються щодня; копії за останні 30 днів зберігаються для відновлення.",
      ],
    },
    {
      heading: "7. Скільки зберігаємо",
      list: [
        "Заявки з сайту — до 12 місяців з моменту останньої комунікації, якщо ви не попросите видалити раніше.",
        "Знеособлена статистика сайту — до 13 місяців, далі видаляється автоматично.",
        "Дані в системі — увесь час, поки церква користується сервісом.",
        "Після припинення роботи — ще 60 днів, щоб церква встигла завантажити повний експорт. Після цього дані видаляються, а резервні копії перестають існувати за своїм циклом (до 30 днів).",
      ],
    },
    {
      heading: "8. Ваші права",
      body: [
        "Відповідно до Закону України «Про захист персональних даних» і, де він застосовний, GDPR, ви маєте право:",
      ],
      list: [
        "дізнатися, які ваші дані ми обробляємо, і отримати їхню копію;",
        "виправити неточні дані;",
        "вимагати видалення даних;",
        "відкликати згоду, якщо обробка відбувається на її підставі;",
        "заперечити проти обробки;",
        "подати скаргу до Уповноваженого Верховної Ради України з прав людини або до наглядового органу у вашій країні.",
      ],
    },
    {
      heading: "9. Якщо ви член церкви",
      body: [
        "Ваші дані внесла ваша церква, і саме вона вирішує, що з ними робити. Спершу зверніться до адміністратора або пастора вашої громади. Якщо це не спрацювало — напишіть нам, і ми передамо звернення церкві та допоможемо його виконати технічно.",
      ],
    },
    {
      heading: "10. Файли cookie, локальне сховище і статистика сайту",
      body: [
        "Цей сайт — статичні сторінки без власного сервера, тож свого лічильника ми не тримаємо. Єдина статистика — Google Analytics (GA4). Він ставить власні файли cookie (_ga та подібні) і передає знеособлені дані про візит компанії Google; вашу IP-адресу обробляє Google, ми її не бачимо й ніде не зберігаємо.",
        "У локальному сховищі браузера лежить лише те, що потрібне самому сайту: номер візиту (випадковий лічильник, який нікого не ідентифікує), обрана тема (світла або темна), мова інтерфейсу і позначка про відмову від збору. Ці записи не залишають ваш браузер.",
        "Ми бачимо знеособлені кроки: які сторінки відкривали, доки прокрутили, які кнопки натискали, з якого джерела прийшли. Те, що ви друкуєте в полях форми, у статистику не потрапляє — тільки факт, що форму почали заповнювати й надіслали. Рекламних мереж і піксельних трекерів соцмереж на сайті немає.",
        "Збір можна вимкнути кнопкою нижче або додавши ?notrack=1 до адреси сторінки — тоді Google Analytics узагалі не завантажується. Очистити збережене — у налаштуваннях браузера.",
      ],
      optOut: true,
    },
    {
      heading: "11. Зміни до цієї політики",
      body: [
        "Якщо документ зміниться суттєво, ми повідомимо церкви, які користуються системою, до того, як зміни наберуть чинності. Дата останнього перегляду завжди вказана вгорі сторінки.",
      ],
    },
  ],
  contactHeading: "Як з нами зв'язатися",
  contactText: `З будь-яким питанням про дані пишіть на ${SITE_EMAIL} або телефонуйте ${SITE_PHONE}. Відповідаємо протягом робочого дня.`,
  backLabel: "На головну",
};

const privacyEn: LegalCopy = {
  seoTitle: "Privacy policy — MyChurch",
  seoDescription:
    "How MyChurch handles personal data: what we collect, where it is stored, who we share it with, how long we keep it, and the rights a church and its members have.",
  eyebrow: "Legal",
  title: "Privacy policy",
  updatedLabel: "Updated",
  lead:
    "A church trusts us with data about its people — names, contacts, who serves where. Below is a plain account of what we do with it, and what we never do.",
  sections: [
    {
      heading: "1. Who is responsible for what",
      body: [
        `The service is provided by ${ENTITY_EN} (“we”, “MyChurch”).`,
        "For data about congregation members, the church is the controller, not us. The church decides who goes into the system, which fields are filled in, and who on the team has access. We act as a processor: we handle that data only on the church's instructions and only to make the system work.",
        "For the data you leave on this website (demo form, brief, support requests), we are the controller.",
      ],
    },
    {
      heading: "2. What data we handle",
      body: ["Three separate sets, with different grounds and different retention."],
      list: [
        "Website enquiries: the name and phone number you enter in a form, plus whatever you tell us about your church. Used to get in touch and prepare a proposal.",
        "Data inside a church's system: person profiles (name, contacts, date of birth, family links, status, group and ministry participation, attendance marks, leaders' notes). The church enters this — we store it and show it to whoever the church has granted access.",
        "Technical data: request address, browser type, timestamps, error logs. Needed to keep the system running and to see failures.",
      ],
    },
    {
      heading: "3. On what grounds",
      list: [
        "Website enquiries — your consent, given when you submit the form. You can withdraw it at any time by writing to us.",
        "Data in the system — our contract with the church and its legitimate interest in keeping records of its own congregation. The church determines the grounds regarding its members.",
        "Technical data — our legitimate interest in operating and securing the service.",
      ],
    },
    {
      heading: "4. What we do not do",
      list: [
        "We do not sell or pass a church's data to third parties for advertising.",
        "We do not use one church's data to sell anything to another.",
        "We do not browse leaders' notes or member profiles out of curiosity: staff access to a church's database happens only at the church's request (for example when you ask for help with an import or a restore) and is recorded in a log.",
      ],
    },
    {
      heading: "5. Who we share data with",
      body: ["Only the providers the service cannot run without, and only to the extent a given function needs:"],
      list: [
        "Hosting and databases — servers in the European Union.",
        "Telegram — so the church's bot can message people who subscribed to it.",
        "Viber, Twilio, Turbo SMS — delivery of SMS and messages, if the church switched those channels on.",
        "Google (Sheets, Calendar) — only where the church connected the integration itself and granted access.",
        "Google Analytics — anonymous visit statistics for this website (no data from the church's system).",
      ],
    },
    {
      heading: "6. Where it is stored and how it is protected",
      list: [
        "Data is stored on servers in the European Union.",
        "Traffic between the browser and the server is protected by TLS.",
        "Access is granted by role: each person sees exactly what their role needs.",
        "Backups run daily; copies from the last 30 days are retained for restores.",
      ],
    },
    {
      heading: "7. How long we keep it",
      list: [
        "Website enquiries — up to 12 months from the last contact, unless you ask us to delete them sooner.",
        "Anonymous site statistics — up to 13 months, then deleted automatically.",
        "Data in the system — for as long as the church uses the service.",
        "After the church stops — a further 60 days, so it can download a full export. After that the data is deleted, and backups age out on their own cycle (up to 30 days).",
      ],
    },
    {
      heading: "8. Your rights",
      body: [
        "Under the Ukrainian Law on Personal Data Protection and, where it applies, the GDPR, you have the right to:",
      ],
      list: [
        "find out what data of yours we process and receive a copy;",
        "have inaccurate data corrected;",
        "request deletion;",
        "withdraw consent, where processing relies on it;",
        "object to processing;",
        "lodge a complaint with the Ukrainian Parliament Commissioner for Human Rights or with the supervisory authority in your country.",
      ],
    },
    {
      heading: "9. If you are a church member",
      body: [
        "Your data was entered by your church, and the church decides what happens to it. Speak to your congregation's administrator or pastor first. If that does not resolve it, write to us — we will pass the request to the church and help carry it out technically.",
      ],
    },
    {
      heading: "10. Cookies, local storage and site analytics",
      body: [
        "This site is static pages with no server of our own, so we run no counter of our own. The only analytics is Google Analytics (GA4). It sets its own cookies (_ga and similar) and sends anonymous visit data to Google; your IP address is processed by Google — we never see it and never store it.",
        "Your browser's local storage holds only what the site itself needs: a visit number (a random counter that identifies nobody), your chosen theme (light or dark), the interface language and the opt-out flag. None of it leaves your browser.",
        "What we see are anonymous steps: which pages were opened, how far they were scrolled, which buttons were pressed, which source the visit came from. What you type into form fields never enters the statistics — only the fact that a form was started and sent. There are no advertising networks and no social-network pixel trackers on this site.",
        "You can switch collection off with the button below, or by adding ?notrack=1 to the page address — Google Analytics is then never loaded at all. To clear what is stored, use your browser settings.",
      ],
      optOut: true,
    },
    {
      heading: "11. Changes to this policy",
      body: [
        "If this document changes materially, we will tell the churches using the system before the change takes effect. The date of the last revision is always shown at the top of this page.",
      ],
    },
  ],
  contactHeading: "How to reach us",
  contactText: `For any question about data, write to ${SITE_EMAIL} or call ${SITE_PHONE}. We reply within the working day.`,
  backLabel: "Back home",
};

const termsUa: LegalCopy = {
  seoTitle: "Умови використання — Моя Церква",
  seoDescription:
    "Умови користування системою «Моя Церква»: що входить у послугу, обов'язки церкви та наші, оплата, право на дані, експорт і припинення роботи.",
  eyebrow: "Правова інформація",
  title: "Умови використання",
  updatedLabel: "Оновлено",
  lead:
    "Коротко й без дрібного шрифту: що ми беремо на себе, що лишається за церквою і що буде з даними, якщо ми розійдемось.",
  sections: [
    {
      heading: "1. Хто надає послугу",
      body: [
        `Систему «Моя Церква» надає ${ENTITY_UA}. Користуючись системою або залишаючи заявку на сайті, ви погоджуєтесь із цими умовами.`,
      ],
    },
    {
      heading: "2. Що таке «Моя Церква»",
      body: [
        "Це вебсистема для обліку та організації церковних процесів: люди, сім'ї, малі групи, служіння, події, відвідуваність, заявки й аналітика. Склад модулів для конкретної церкви погоджується окремо на етапі впровадження.",
        "Систему адаптовано під роботу з телефона через браузер. Окремий застосунок для iOS та Android перебуває в розробці; його наявність не є частиною цих умов, поки ми не повідомимо про запуск.",
      ],
    },
    {
      heading: "3. Акаунти і доступи",
      list: [
        "Церква призначає адміністратора, який створює акаунти команді й видає ролі.",
        "Кожен акаунт належить конкретній людині; передавати доступ третім особам не можна.",
        "Церква відповідає за дії, вчинені під акаунтами її команди, і має одразу повідомити нас, якщо доступ скомпрометовано.",
      ],
    },
    {
      heading: "4. Обов'язки церкви",
      list: [
        "Вносити в систему лише ті дані, на обробку яких церква має законну підставу.",
        "Повідомити своїх членів, що їхні дані ведуться в системі, і на їхній запит забезпечити доступ, виправлення або видалення.",
        "Не використовувати систему для розсилок, не пов'язаних із життям громади, і не вносити дані людей, які просили цього не робити.",
      ],
    },
    {
      heading: "5. Що беремо на себе ми",
      list: [
        "Тримаємо систему доступною й усуваємо збої, щойно про них дізнаємось.",
        "Відповідаємо на звернення підтримки протягом робочого дня.",
        "Регулярно випускаємо оновлення. Невеликі виправлення виходять без простою; про великі зміни попереджаємо заздалегідь.",
        "Робимо щоденні резервні копії й зберігаємо копії за останні 30 днів.",
      ],
    },
    {
      heading: "6. Оплата",
      body: [
        "Поки діє програма підключення, саме підключення та впровадження безкоштовні. Консалтинг безкоштовний до 1 листопада 2026 року. Про завершення програми ми повідомляємо церкви заздалегідь.",
        "Далі вартість обговорюється індивідуально, залежно від розміру громади та набору модулів. Ми називаємо ціну до початку робіт і не змінюємо її заднім числом. Безкоштовний період не перетворюється на платну підписку автоматично: щоб продовжити на платній основі, потрібна ваша окрема згода.",
      ],
    },
    {
      heading: "7. Дані церкви належать церкві",
      list: [
        "Ми не претендуємо на права щодо даних, які церква внесла в систему.",
        "Повний експорт у форматі CSV або Excel доступний будь-коли, без пояснень, навіщо він вам.",
        "Після припинення роботи дані зберігаються ще 60 днів — за цей час експорт можна завантажити. Після цього вони видаляються.",
      ],
    },
    {
      heading: "8. Межі відповідальності",
      body: [
        "Ми робимо все розумне, щоб система працювала без збоїв, але не гарантуємо безперервної роботи сторонніх сервісів — Telegram, Viber, операторів SMS і Google, — від яких залежать окремі функції.",
        "Ми не відповідаємо за рішення, ухвалені церквою на підставі даних у системі, і за коректність даних, які внесла команда церкви.",
      ],
    },
    {
      heading: "9. Припинення",
      body: [
        "Церква може припинити користування в будь-який момент, повідомивши нас. Ми можемо припинити надання послуги, якщо систему використовують із порушенням цих умов або закону — попередивши й давши час завантажити експорт, окрім випадків, коли закон вимагає діяти негайно.",
      ],
    },
    {
      heading: "10. Зміни умов і застосовне право",
      body: [
        "Про суттєві зміни умов ми повідомляємо церкви до того, як вони наберуть чинності. До цих умов застосовується законодавство України.",
      ],
    },
  ],
  contactHeading: "Питання щодо умов",
  contactText: `Напишіть на ${SITE_EMAIL} або зателефонуйте ${SITE_PHONE} — розберемось разом.`,
  backLabel: "На головну",
};

const termsEn: LegalCopy = {
  seoTitle: "Terms of use — MyChurch",
  seoDescription:
    "Terms for using MyChurch: what the service covers, the church's obligations and ours, payment, data ownership, export and termination.",
  eyebrow: "Legal",
  title: "Terms of use",
  updatedLabel: "Updated",
  lead:
    "Short, and without the small print: what we take on, what stays with the church, and what happens to the data if we part ways.",
  sections: [
    {
      heading: "1. Who provides the service",
      body: [
        `MyChurch is provided by ${ENTITY_EN}. By using the system or submitting a form on this site, you agree to these terms.`,
      ],
    },
    {
      heading: "2. What MyChurch is",
      body: [
        "A web system for running church processes: people, families, small groups, ministries, events, attendance, requests and analytics. Which modules a given church gets is agreed separately during rollout.",
        "The system is built to work from a phone through the browser. A dedicated iOS and Android app is in development; its availability is not part of these terms until we announce the launch.",
      ],
    },
    {
      heading: "3. Accounts and access",
      list: [
        "The church appoints an administrator who creates team accounts and assigns roles.",
        "Each account belongs to a specific person; access may not be passed to third parties.",
        "The church is responsible for actions taken under its team's accounts and must tell us immediately if access is compromised.",
      ],
    },
    {
      heading: "4. The church's obligations",
      list: [
        "Enter only data the church has a lawful basis to process.",
        "Tell its members their data is kept in the system, and on request provide access, correction or deletion.",
        "Not use the system for messaging unrelated to congregation life, and not enter data about people who asked not to be included.",
      ],
    },
    {
      heading: "5. What we take on",
      list: [
        "Keeping the system available and fixing failures as soon as we learn of them.",
        "Answering support requests within the working day.",
        "Shipping updates regularly. Small fixes go out with no downtime; we give notice before larger changes.",
        "Running daily backups and retaining copies from the last 30 days.",
      ],
    },
    {
      heading: "6. Payment",
      body: [
        "While the onboarding programme runs, onboarding and rollout are free. Consulting is free until 1 November 2026. We give churches notice before the programme ends.",
        "After that, pricing is agreed individually, based on the size of the congregation and the set of modules. We name the price before work starts and do not change it retroactively. A free period never converts into a paid subscription automatically: continuing on paid terms requires your separate agreement.",
      ],
    },
    {
      heading: "7. A church's data belongs to the church",
      list: [
        "We claim no rights over the data a church enters into the system.",
        "A full export as CSV or Excel is available at any time, with no need to explain why you want it.",
        "After you stop, data is kept for a further 60 days so the export can be downloaded. After that it is deleted.",
      ],
    },
    {
      heading: "8. Limits of liability",
      body: [
        "We do everything reasonable to keep the system running, but we cannot guarantee uninterrupted operation of the third-party services some features depend on — Telegram, Viber, SMS carriers and Google.",
        "We are not responsible for decisions a church makes on the basis of data in the system, nor for the accuracy of data entered by the church's team.",
      ],
    },
    {
      heading: "9. Termination",
      body: [
        "A church may stop using the service at any time by telling us. We may stop providing it if the system is used in breach of these terms or the law — with notice and time to download an export, except where the law requires us to act immediately.",
      ],
    },
    {
      heading: "10. Changes and governing law",
      body: [
        "We notify churches of material changes before they take effect. These terms are governed by the law of Ukraine.",
      ],
    },
  ],
  contactHeading: "Questions about these terms",
  contactText: `Write to ${SITE_EMAIL} or call ${SITE_PHONE} — we'll work it out together.`,
  backLabel: "Back home",
};

export const PRIVACY_COPY: Record<Lang, LegalCopy> = { ua: privacyUa, en: privacyEn };
export const TERMS_COPY: Record<Lang, LegalCopy> = { ua: termsUa, en: termsEn };
