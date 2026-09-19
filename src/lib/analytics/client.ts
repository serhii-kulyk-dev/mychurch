/* Клієнтська частина аналітики: ідентифікатори, черга подій, відправка.

   Ідентифікатор браузера живе в localStorage і нікого не ідентифікує
   персонально — це випадковий рядок. Куки не ставимо (тому й банер
   про куки сайту не потрібен), крос-сайтового стеження немає.

   Вимкнути збір можна двома шляхами: `?notrack=1` в адресі або
   перемикач на сторінці /privacy — обидва пишуть один і той же ключ. */

import { logToFirebase } from "./firebase";
import { OPTOUT_KEY, readFlag, writeFlag } from "./flag";

const VISITOR_KEY = "mychurch-vid";
const SESSION_KEY = "mychurch-session";
const ENDPOINT = "/api/track";

/** 30 хвилин без подій — наступна подія починає новий візит. */
const SESSION_TTL = 30 * 60 * 1000;
const FLUSH_DELAY = 2000;
const FLUSH_SIZE = 15;
/** Події, після яких не чекаємо — відправляємо негайно. */
const URGENT = new Set(["lead", "lead_failed", "form_submit"]);

interface SessionState {
  id: string;
  visit: number;
  started: number;
  last: number;
  ref: string;
  query: string;
}

interface QueuedEvent {
  n: string;
  t: number;
  p: string;
  d?: Record<string, string | number | boolean>;
}

const queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
/* Захист від дублікатів: однакова подія в межах цього вікна — одна подія. */
const DEDUPE_MS = 400;
let lastSignature = "";
let lastAt = 0;

function id() {
  try {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  } catch {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
}

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

/** Кабінет і технічні сторінки не рахуємо — інакше звіт міряв би нас самих. */
function ignoredPath(path: string) {
  return path.startsWith("/admin");
}

function visitorId() {
  let v = read(VISITOR_KEY);
  if (!v) {
    v = id();
    write(VISITOR_KEY, v);
  }
  return v;
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
    id: id(),
    visit: (state?.visit ?? 0) + 1,
    started: now,
    last: now,
    /* Реферер і мітки кампанії беремо з першого кроку візиту —
       далі в межах сесії вони вже наші власні. */
    ref: document.referrer || "",
    query: location.search || "",
  };
  sessionCache = next;
  write(SESSION_KEY, JSON.stringify(next));
  return { state: next, fresh: true };
}

function send(useBeacon: boolean) {
  if (!queue.length) return;
  const { state } = session();
  const body = JSON.stringify({
    v: visitorId(),
    s: state.id,
    visit: state.visit,
    ref: state.ref,
    query: state.query,
    screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
    lang: document.documentElement.getAttribute("data-lang") ?? "ua",
    events: queue.splice(0, queue.length),
  });

  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
    }).catch(() => {});
  } catch {
    /* Блокувальник реклами чи офлайн — сайту це не має заважати. */
  }
}

export function flush(useBeacon = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  send(useBeacon);
}

/** Записати крок відвідувача. Викликається і з трекера, і з форм. */
export function track(name: string, props?: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined" || isOptedOut()) return;
  const path = location.pathname;
  if (ignoredPath(path)) return;

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

  queue.push({ n: name, t: now, p: path, d: Object.keys(clean).length ? clean : undefined });

  /* Той самий крок — у GA4. Назви збігаються з нашими, окрім перегляду
     сторінки: у Google він зветься page_view, і звіти чекають саме на це. */
  logToFirebase(name === "pageview" ? "page_view" : name, {
    ...clean,
    page_path: path,
    page_title: name === "pageview" ? document.title.slice(0, 100) : undefined,
  });
  /* Заявка — це конверсія: шлемо ще й стандартною назвою Google,
     щоб її було видно в рекламних звітах без ручного налаштування. */
  if (name === "lead") logToFirebase("generate_lead", { ...clean, page_path: path });

  if (queue.length >= FLUSH_SIZE || URGENT.has(name)) {
    flush();
    return;
  }
  if (!timer) timer = setTimeout(() => flush(), FLUSH_DELAY);
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
