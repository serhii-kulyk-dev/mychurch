/* Формат однієї події в сховищі.

   Контекст візиту (джерело, пристрій, країна) дублюється в кожній
   події навмисно: так звіт будується одним проходом по файлу,
   без джойнів і без окремої таблиці сесій.                         */

export interface StoredEvent {
  /** Мітка часу, epoch ms. */
  ts: number;
  /** Назва події — див. EVENT_LABELS. */
  name: string;
  /** Шлях сторінки, на якій сталася подія. */
  path: string;
  /** Постійний ідентифікатор браузера (перший раз генерується на клієнті). */
  visitor: string;
  /** Ідентифікатор візиту (30 хв без активності — новий візит). */
  session: string;
  /** Котрий це візит цього браузера: 1, 2, 3… */
  visit: number;
  /** Деталі події: id блоку, текст кнопки, глибина прокрутки тощо. */
  props?: Record<string, string | number | boolean>;

  /* ── Контекст візиту ── */
  /** Хост реферера ("google.com") або "" для прямого заходу. */
  ref?: string;
  /** Джерело: utm_source, або хост реферера, або "direct". */
  source: string;
  medium?: string;
  campaign?: string;
  device: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  lang?: string;
  screen?: string;
  /** Хеш IP + солі: для дедуплікації й захисту від флуду, без самої адреси. */
  ipHash?: string;
}

/** Те, що надсилає браузер у /api/track. */
export interface TrackBatch {
  v: string;
  s: string;
  visit: number;
  ref?: string;
  query?: string;
  screen?: string;
  lang?: string;
  events: Array<{
    n: string;
    t: number;
    p: string;
    d?: Record<string, string | number | boolean>;
  }>;
}
