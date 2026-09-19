/* Словник подій аналітики.

   Один список для трекера в браузері і для підписів у кабінеті —
   щоб назви не розповзались по проєкту. Подія — це рядок; сюди
   додаються лише ті, які ми справді шлемо.                        */

export const EVENT_LABELS: Record<string, string> = {
  session_start: "Початок візиту",
  pageview: "Перегляд сторінки",
  section_view: "Побачив блок",
  scroll: "Прокрутка",
  click: "Клік",
  cta: "Клік по головній кнопці",
  cta_goal_on: "Обрав біль у фінальному блоці",
  cta_goal_off: "Зняв біль у фінальному блоці",
  link_click: "Перехід по посиланню",
  outbound: "Пішов на інший сайт",
  modal_open: "Відкрив форму",
  modal_close: "Закрив форму",
  form_start: "Почав заповнювати",
  form_error: "Помилка у формі",
  form_submit: "Надіслав форму",
  lead: "Заявка",
  lead_failed: "Заявка не дійшла",
  builder_pick: "Обрав бажання в конструкторі",
  brief_size: "Вказав розмір церкви",
  brief_tool: "Вказав інструмент",
  faq_open: "Розгорнув питання",
  demo_play: "Запустив демо",
  lang_switch: "Перемкнув мову",
  theme_switch: "Перемкнув тему",
  copy: "Скопіював контакт",
  page_exit: "Пішов зі сторінки",
  analytics_off: "Вимкнув статистику",
};

export function eventLabel(name: string) {
  return EVENT_LABELS[name] ?? name;
}

/** Події, які в стрічці кроків підсвічуються як важливі. */
export const KEY_EVENTS = new Set(["lead", "form_submit", "modal_open", "form_start", "lead_failed"]);

/* ── Воронка ───────────────────────────────────────────────────────
   П'ять кроків від «зайшов» до «залишив заявку». Рахується по
   візитах: візит зараховується в крок, якщо в ньому була подія.   */

export interface FunnelStep {
  id: string;
  label: string;
  hint: string;
}

export const FUNNEL: FunnelStep[] = [
  { id: "visit", label: "Зайшов на сайт", hint: "будь-який візит" },
  { id: "engaged", label: "Почав читати", hint: "прокрутив ≥50% або відкрив другу сторінку" },
  { id: "intent", label: "Натиснув кнопку", hint: "клік по CTA або відкрита форма" },
  { id: "form", label: "Почав заповнювати", hint: "ввів ім'я чи телефон" },
  { id: "lead", label: "Залишив заявку", hint: "лід дійшов у Telegram / пошту" },
];
