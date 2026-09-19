import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "perenesty-dani-z-excel",
  category: "data",
  date: "2026-08-08",
  minutes: 7,
  related: ["dani-v-riznykh-mistsiakh", "skilky-liudei-u-tserkvi", "yak-obraty-systemu-dlia-tserkvy"],
  copy: {
    ua: {
      seoTitle: "Як перенести дані церкви з Excel і Google Таблиць",
      seoDescription:
        "Покроковий перенос бази церкви з таблиць у систему: як підготувати файл, що робити з дублями, як зіставити колонки й перевірити результат.",
      title: "Як перенести церкву з таблиць у систему",
      lead: "Найбільший страх перед переходом — «ми загубимо дані». Насправді дані губляться не під час переносу, а роками до нього. Перенос — це якраз момент, коли їх нарешті видно.",
      keywords: [
        "імпорт даних церкви",
        "перенести базу з Excel",
        "імпорт з Google Таблиць",
        "як перейти на систему для церкви",
        "міграція даних церкви",
      ],
      problem: {
        title: "Файл на 800 рядків, і страшно його чіпати",
        text: "Колонки називаються «тел», «тел2» і «примітка». Половина дат народження в різних форматах. Хтось записаний двічі. І всі бояться, що при переносі стане ще гірше.",
      },
      sections: [
        {
          heading: "Що зробити до імпорту",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Зробіть копію", text: "Працюйте з копією файлу, оригінал не чіпайте. Це звучить банально, але саме тут найчастіше й втрачають дані." },
                { title: "Один рядок — одна людина", text: "Об'єднані комірки, підзаголовки всередині таблиці й порожні рядки-роздільники ламають будь-який імпорт." },
                { title: "Один тип даних у колонці", text: "Якщо в колонці «телефон» трапляється «немає» або «питати у Валі» — винесіть це в примітки." },
                { title: "Домовтесь про статуси", text: "Ще до імпорту вирішіть, кого вважаєте членом, кого відвідувачем, кого архівом." },
              ],
            },
          ],
        },
        {
          heading: "Що робити з типовими проблемами файлу",
          blocks: [
            {
              kind: "table",
              columns: ["Проблема", "Рішення", "Чого не робити"],
              rows: [
                ["Дублі людей", "Об'єднати за телефоном і прізвищем", "Видаляти навмання, не звіряючи"],
                ["Порожні контакти", "Імпортувати як є, позначити до уточнення", "Викидати рядок"],
                ["Дати в різних форматах", "Звести до одного формату перед імпортом", "Залишити «на потім»"],
                ["Сім'ї в одному рядку", "Розділити на людей і зв'язати в сім'ю", "Записувати родину як одну людину"],
                ["Примітки в довільній формі", "Перенести в поле приміток повністю", "Намагатись розібрати руками"],
              ],
            },
          ],
        },
        {
          heading: "Сам перенос: чотири кроки",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Завантаження", text: "Файл таблиці завантажується як є — з усіма колонками, які в ньому є." },
                { title: "Зіставлення колонок", text: "Ваша колонка «тел» стає телефоном, «примітка» — приміткою. Те, чого немає в системі, можна додати як власне поле." },
                { title: "Перевірка перед записом", text: "Система показує, що саме буде створено: скільки людей, скільки дублів знайдено, де порожні обов'язкові поля." },
                { title: "Імпорт і звіряння", text: "Після імпорту звіряють кількість рядків і вибірково перевіряють десяток карток." },
              ],
            },
            {
              kind: "callout",
              title: "Імпорт має бути оборотним",
              text: "Перед першим справжнім імпортом переконайтесь, що завантаження можна скасувати. Якщо ні — імпортуйте спершу 20 рядків, а не всі 800.",
            },
          ],
        },
        {
          heading: "Після імпорту: чистка силами лідерів",
          blocks: [
            {
              kind: "list",
              items: [
                "Роздайте лідерам їхні групи: кожен звіряє 10–15 карток.",
                "Порожні телефони збирайте не листом на всіх, а поступово — при першому ж контакті.",
                "Не женіться за стовідсотковою чистотою: 90% правильних даних, які використовують, кращі за 100% у файлі, який ніхто не відкриває.",
                "Закрийте стару таблицю в режим тільки для читання того ж дня.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Працюйте з копією, оригінал не чіпайте.",
        "Один рядок — одна людина, один тип даних у колонці.",
        "Перевірка перед записом обов'язкова, імпорт має бути оборотним.",
        "Чистять дані лідери по своїх групах, а не один адміністратор.",
      ],
      faq: [
        {
          q: "Скільки часу займає перенос бази на 500 людей?",
          a: "Сам імпорт — менше години. Підготовка файлу й домовленості про статуси зазвичай забирають кілька днів, і це нормально.",
        },
        {
          q: "Чи можна імпортувати кілька файлів?",
          a: "Так, по черзі: спершу люди, потім групи, потім відвідуваність. Кожен наступний файл прив'язується до вже створених людей.",
        },
        {
          q: "Що робити зі старими даними, які вже неактуальні?",
          a: "Імпортувати в архів зі статусом. Видалення виглядає як чистота, але позбавляє церкву історії стосунків.",
        },
      ],
      cta: {
        title: "Подивіться, як виглядає імпорт",
        text: "Завантаження, зіставлення колонок і перевірка перед тим, як щось буде записано.",
        label: "Сторінка імпорту",
        href: "/import",
      },
    },
    en: {
      seoTitle: "Moving church data from Excel and Google Sheets",
      seoDescription:
        "A step-by-step migration of a church database from spreadsheets: preparing the file, handling duplicates, mapping columns and checking the result.",
      title: "Moving your church from spreadsheets into a system",
      lead: "The biggest fear about switching is losing data. In reality data is lost in the years before a migration, not during it. The migration is when you finally see it.",
      keywords: [
        "church data import",
        "migrate church database from Excel",
        "import from Google Sheets",
        "church database migration",
        "switching church software",
      ],
      problem: {
        title: "An 800-row file nobody dares touch",
        text: "Columns called phone, phone2 and note. Half the birthdays in different formats. Someone listed twice. And everyone fears the migration will make it worse.",
      },
      sections: [
        {
          heading: "Before the import",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Work on a copy", text: "Never touch the original. It sounds obvious, and it is exactly where data is usually lost." },
                { title: "One row, one person", text: "Merged cells, subheadings inside the table and blank separator rows break any import." },
                { title: "One data type per column", text: "If the phone column contains none or ask Valya, move that into notes." },
                { title: "Agree the statuses", text: "Decide who counts as a member, an attender and an archive record before you import." },
              ],
            },
          ],
        },
        {
          heading: "Typical file problems",
          blocks: [
            {
              kind: "table",
              columns: ["Problem", "Fix", "Do not"],
              rows: [
                ["Duplicate people", "Merge by phone and surname", "Delete at random"],
                ["Empty contacts", "Import as is, flag for follow-up", "Drop the row"],
                ["Mixed date formats", "Normalise before importing", "Leave it for later"],
                ["Whole families in one row", "Split into people and link as a family", "Record a family as one person"],
                ["Free-form notes", "Move into a notes field as they are", "Try to parse them by hand"],
              ],
            },
          ],
        },
        {
          heading: "The migration in four steps",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Upload", text: "The file goes in as it is, with whatever columns it has." },
                { title: "Map the columns", text: "Your phone column becomes a phone; anything the system lacks can become a custom field." },
                { title: "Review before writing", text: "The system shows what will be created: how many people, how many duplicates, which required fields are empty." },
                { title: "Import and verify", text: "Compare the row count and spot-check a dozen records." },
              ],
            },
            {
              kind: "callout",
              title: "An import must be reversible",
              text: "Before the first real import, confirm you can undo it. If you cannot, import 20 rows first, not all 800.",
            },
          ],
        },
        {
          heading: "After the import: cleanup by leaders",
          blocks: [
            {
              kind: "list",
              items: [
                "Give leaders their own groups: ten to fifteen records each.",
                "Collect missing phone numbers at the next contact rather than by mass email.",
                "Do not chase perfection: 90% correct data in use beats 100% in a file nobody opens.",
                "Set the old spreadsheet to read-only the same day.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Work on a copy.",
        "One row per person, one data type per column.",
        "Always review before writing, and keep the import reversible.",
        "Leaders clean their own groups.",
      ],
      faq: [
        {
          q: "How long does a 500-person migration take?",
          a: "The import itself is under an hour. Preparing the file and agreeing statuses usually takes a few days, and that is normal.",
        },
        {
          q: "Can we import several files?",
          a: "Yes, in order: people first, then groups, then attendance. Each later file attaches to the people already created.",
        },
        {
          q: "What about outdated records?",
          a: "Import them as archive with a status. Deleting looks tidy but costs the church its relationship history.",
        },
      ],
      cta: {
        title: "See how the import works",
        text: "Upload, column mapping and a review step before anything is written.",
        label: "Import page",
        href: "/import",
      },
    },
  },
};
