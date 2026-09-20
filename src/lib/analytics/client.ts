/* Клієнтська частина аналітики: облік візиту й відправка подій у GA4.

   Сайт роздається як статика, свого бекенда для лічильника немає —
   єдиний отримувач подій це Google Analytics (див. firebase.ts).
   Тому черги й буферизації тут теж немає: gtag ставить події в
   свою чергу сам і сам доставляє їх перед закриттям вкладки.

   Номер візиту тримаємо самі, у localStorage: у звітах зручно
   відрізняти першу зустріч від п'ятої, а GA такого параметра в
   події не кладе. Це випадковий лічильник, нікого не ідентифікує.

   Вимкнути збір можна двома шляхами: `?notrack=1` в адресі або
   перемикач на сторінці /privacy — обидва пишуть один і той же ключ. */

import { logToFirebase } from "./firebase";
import { OPTOUT_KEY, readFlag, writeFlag } from "./flag";

const SESSION_KEY = "mychurch-session";

/** 30 хвилин без подій — наступна подія починає новий візит. */
const SESSION_TTL = 30 * 60 * 1000;

interface SessionState {
  visit: number;
  started: number;
  last: number;
  ref: string;
}

/* Захист від дублікатів: однакова подія в межах цього вікна — одна подія. */
const DEDUPE_MS = 400;
let lastSignature = "";
let lastAt = 0;

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Приватний режим — аналітика просто не запишеться. */
  }
}

export function isOptedOut() {
  if (typeof window === "undefined") return true;
  return readFlag(OPTOUT_KEY);
}

export function setOptOut(off: boolean) {
  writeFlag(OPTOUT_KEY, off);
}

let sessionCache: SessionState | null = null;

/** Поточний візит; `fresh` — чи він щойно почався. */
function session(): { state: SessionState; fresh: boolean } {
  const now = Date.now();
  let state = sessionCache;
  if (!state) {
    try {
      state = JSON.parse(read(SESSION_KEY) ?? "null") as SessionState | null;
    } catch {
      state = null;
    }
  }

  if (state && now - state.last < SESSION_TTL) {
    state.last = now;
    sessionCache = state;
    write(SESSION_KEY, JSON.stringify(state));
    return { state, fresh: false };
  }

  const next: SessionState = {
    visit: (state?.visit ?? 0) + 1,
    started: now,
    last: now,
    /* Реферер беремо з першого кроку візиту — далі в межах сесії
       він уже наш власний. */
    ref: document.referrer || "",
  };
  sessionCache = next;
  write(SESSION_KEY, JSON.stringify(next));
  return { state: next, fresh: true };
}

/** Лишилось для сумісності викликів: доставку GA бере на себе. */
export function flush(_useBeacon = false) {
  void _useBeacon;
}

/** Записати крок відвідувача. Викликається і з трекера, і з форм. */
export function track(name: string, props?: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined" || isOptedOut()) return;
  const path = location.pathname;

  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value !== undefined && value !== null && value !== "") clean[key] = value;
  }

  /* Той самий крок двічі за мить — це подвійний виклик (React у режимі
     розробки) або дренькіт кнопки, а не два рішення людини. */
  const now = Date.now();
  const signature = `${name}|${path}|${JSON.stringify(clean)}`;
  if (signature === lastSignature && now - lastAt < DEDUPE_MS) return;
  lastSignature = signature;
  lastAt = now;

  /* Назви збігаються з нашими, окрім перегляду сторінки: у Google він
     зветься page_view, і звіти чекають саме на це. */
  logToFirebase(name === "pageview" ? "page_view" : name, {
    ...clean,
    page_path: path,
    page_title: name === "pageview" ? document.title.slice(0, 100) : undefined,
  });
  /* Заявка — це конверсія: шлемо ще й стандартною назвою Google,
     щоб її було видно в рекламних звітах без ручного налаштування. */
  if (name === "lead") logToFirebase("generate_lead", { ...clean, page_path: path });
}

/** Початок візиту: подія session_start раз на сесію. */
export function startSession() {
  if (typeof window === "undefined" || isOptedOut()) return;
  const { state, fresh } = session();
  if (!fresh) return;
  track("session_start", {
    visit: state.visit,
    ref: state.ref ? state.ref.slice(0, 200) : "",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}
