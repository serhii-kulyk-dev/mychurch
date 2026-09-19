import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "skilky-liudei-u-tserkvi",
  category: "growth",
  date: "2026-07-10",
  minutes: 7,
  related: ["analizuite", "oblik-vidviduvanosti", "dani-v-riznykh-mistsiakh"],
  copy: {
    ua: {
      seoTitle: "Скільки людей у вашій церкві: як порахувати чесно",
      seoDescription:
        "Член церкви, постійний відвідувач, гість — як рахувати громаду, щоб число означало те саме для всіх, і чому «на служінні було 300» не відповідає на це питання.",
      title: "Скільки людей у вашій церкві насправді",
      lead: "Просте питання, на яке в більшості церков є три різні відповіді. І це не проблема арифметики — це проблема визначень.",
      keywords: [
        "скільки людей у церкві",
        "як порахувати членів церкви",
        "член церкви визначення",
        "статистика громади",
        "база членів церкви",
      ],
      problem: {
        title: "Три відповіді на одне питання",
        text: "Пастор каже «близько чотирьохсот». Адміністратор дивиться в таблицю й бачить 512 записів. На служінні в неділю було 230. Усі троє мають рацію — і саме тому планувати неможливо.",
      },
      sections: [
        {
          heading: "Чому числа не збігаються",
          blocks: [
            {
              kind: "list",
              items: [
                "У таблиці накопичились ті, хто виїхав, змінив церкву або помер — записи ніхто не закриває.",
                "Дублі: одна людина двічі, бо записали з різними номерами.",
                "На служінні є ті, кого немає в таблиці, — гості й нерегулярні.",
                "Немає визначення: кого саме вважати «своїм».",
              ],
            },
            {
              kind: "text",
              text: "Найчастіша причина — остання. Доки немає спільного визначення, кожен рахує за власним, і жодну цифру не можна порівняти навіть із собою торік.",
            },
          ],
        },
        {
          heading: "Чотири різні числа, які потрібні церкві",
          blocks: [
            {
              kind: "table",
              columns: ["Число", "Визначення", "Для чого"],
              rows: [
                ["Члени", "Ті, хто зробив свідомий крок за вашою практикою", "Рішення громади, служіння, відповідальність"],
                ["Регулярні відвідувачі", "Були щонайменше двічі за останні 8 тижнів", "Реальний розмір громади"],
                ["Спільнота", "Усі, хто якось пов'язаний: родини, друзі, онлайн", "Комунікація та події"],
                ["Присутні", "Кількість людей у залі конкретної неділі", "Приміщення, ресурси, логістика"],
              ],
            },
            {
              kind: "text",
              text: "Ці числа не мають збігатися — вони відповідають на різні питання. Погано не те, що їх чотири, а те, що зазвичай усі чотири називають одним словом.",
            },
          ],
        },
        {
          heading: "Як навести лад за один місяць",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Запишіть визначення", text: "Одне речення на кожну категорію. Це рішення пастора й ради, а не адміністратора." },
                { title: "Приберіть дублі", text: "Пошук за телефоном і прізвищем зазвичай знаходить 5–10% повторів." },
                { title: "Закрийте неактуальні записи", text: "Не видаляйте — переводьте в архів зі статусом. Історія має лишитись." },
                { title: "Перевірте через групи", text: "Роздайте лідерам списки їхніх людей: вони виправлять свої 15 записів швидше, ніж адміністратор — усі 500." },
              ],
            },
            {
              kind: "callout",
              title: "Ніколи не видаляйте людей",
              text: "Людина, яка виїхала, може повернутись через три роки. Архівний запис зберігає історію; видалений запис змушує починати знайомство з нуля.",
            },
          ],
        },
        {
          heading: "Як тримати число чесним далі",
          blocks: [
            {
              kind: "list",
              items: [
                "Раз на квартал — перегляд архіву: хто повернувся, хто справді пішов.",
                "Відвідуваність дає автоматичне визначення «регулярного» без ручної роботи.",
                "Одне місце для змін: якщо контакт оновлюють у трьох файлах, за пів року знову буде три числа.",
                "Щорічний зріз на ту саму дату — тоді зростання видно без сезонних коливань.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Спочатку визначення, потім підрахунок.",
        "Церкві потрібні чотири різні числа, і вони не повинні збігатись.",
        "Записи людей архівують, а не видаляють.",
        "Списки виправляють лідери груп, а не один адміністратор.",
      ],
      faq: [
        {
          q: "Хто має ухвалювати визначення членства?",
          a: "Пастор і рада церкви. Це богословське й практичне рішення громади, а система лише фіксує його як статус.",
        },
        {
          q: "Що робити з людьми, які ходять роками, але не є членами?",
          a: "Це і є категорія регулярних відвідувачів. Вона часто більша за членство, і саме вона показує реальний розмір громади.",
        },
        {
          q: "Як рахувати дітей?",
          a: "Окремо, з прив'язкою до сім'ї. Інакше дитячі групи або губляться в загальному числі, або подвоюють його.",
        },
      ],
      cta: {
        title: "Люди й сім'ї в одному реєстрі",
        text: "Статуси, архів, сім'ї та історія відвідувань — щоб число нарешті означало одне й те саме.",
        label: "Модуль «Люди»",
        href: "/modules/people",
      },
    },
    en: {
      seoTitle: "How many people are in your church, honestly",
      seoDescription:
        "Member, regular attender, guest: how to count a congregation so the number means the same to everyone, and why 300 were at the service does not answer it.",
      title: "How many people are in your church, really",
      lead: "A simple question with three different answers in most churches. That is not an arithmetic problem but a definition problem.",
      keywords: [
        "how to count church members",
        "church membership definition",
        "church attendance vs membership",
        "congregation size",
        "church member database",
      ],
      problem: {
        title: "Three answers to one question",
        text: "The pastor says about four hundred. The administrator sees 512 rows. Sunday attendance was 230. All three are right, which is exactly why planning is impossible.",
      },
      sections: [
        {
          heading: "Why the numbers disagree",
          blocks: [
            {
              kind: "list",
              items: [
                "The list still holds people who moved away, changed church or died; nobody closes records.",
                "Duplicates: the same person twice under different phone numbers.",
                "People at the service who are not in the list at all.",
                "No definition of who counts as ours.",
              ],
            },
            {
              kind: "text",
              text: "The last one is the usual cause. Without a shared definition everyone counts their own way, and no number can be compared even with itself a year ago.",
            },
          ],
        },
        {
          heading: "Four different numbers a church needs",
          blocks: [
            {
              kind: "table",
              columns: ["Number", "Definition", "Used for"],
              rows: [
                ["Members", "Those who took a deliberate step by your practice", "Decisions, serving, responsibility"],
                ["Regular attenders", "Present at least twice in the last 8 weeks", "The real size of the congregation"],
                ["Community", "Everyone connected: families, friends, online", "Communication and events"],
                ["Present", "People in the room on a given Sunday", "Space, resources, logistics"],
              ],
            },
            {
              kind: "text",
              text: "They are not supposed to match — they answer different questions. The problem is not that there are four, but that all four are usually called by one word.",
            },
          ],
        },
        {
          heading: "Cleaning it up in a month",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Write the definitions", text: "One sentence per category. A decision for the pastor and board, not the administrator." },
                { title: "Remove duplicates", text: "Matching by phone and surname usually finds 5–10% repeats." },
                { title: "Close outdated records", text: "Archive with a status rather than delete. The history must stay." },
                { title: "Verify through groups", text: "Give leaders their own lists: fifteen records each is faster than five hundred for one admin." },
              ],
            },
            {
              kind: "callout",
              title: "Never delete a person",
              text: "Someone who moved away may return in three years. An archived record keeps the history; a deleted one forces you to start the relationship from scratch.",
            },
          ],
        },
        {
          heading: "Keeping the number honest",
          blocks: [
            {
              kind: "list",
              items: [
                "A quarterly archive review: who came back, who really left.",
                "Attendance gives an automatic definition of regular without manual work.",
                "One place for edits, or in six months you will have three numbers again.",
                "An annual snapshot on the same date, so growth is visible without seasonal noise.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Definitions first, counting second.",
        "A church needs four different numbers, and they should not match.",
        "Archive people, never delete them.",
        "Group leaders clean the lists, not one administrator.",
      ],
      faq: [
        {
          q: "Who decides the membership definition?",
          a: "The pastor and the board. It is a theological and practical decision; the system only records it as a status.",
        },
        {
          q: "What about people who attend for years but are not members?",
          a: "They are your regular attenders — often a larger number, and the one that shows the real size of the congregation.",
        },
        {
          q: "How do we count children?",
          a: "Separately, linked to a family. Otherwise kids either vanish inside the total or double it.",
        },
      ],
      cta: {
        title: "People and families in one register",
        text: "Statuses, archive, families and attendance history, so the number finally means one thing.",
        label: "People module",
        href: "/modules/people",
      },
    },
  },
};
