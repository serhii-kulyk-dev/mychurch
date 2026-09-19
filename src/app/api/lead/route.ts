import { i18n } from "@/lib/i18n";
import { SITE_EMAIL } from "@/lib/seo";
import { clientIp, createDeduper, createLimiter } from "@/lib/rate-limit";

/* ────────────────────────────────────────────────────────────────
   Прийом лідів із форми демо (модалка) і з брифу на /modules.

   Канали дублюються: повідомлення йде і в Telegram, і на пошту.
   Достатньо, щоб спрацював бодай один — лід не губиться, якщо
   один із сервісів лежить. Якщо не налаштовано жодного каналу,
   роут чесно віддає 503, і форма показує запасні контакти
   замість «дякуємо».

   ENV:
     TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  — бот і чат, куди падають ліди
     RESEND_API_KEY, LEAD_EMAIL_FROM       — пошта (https://resend.com)
     LEAD_EMAIL_TO                         — куди слати (дефолт SITE_EMAIL)
   ──────────────────────────────────────────────────────────────── */

export const runtime = "nodejs";
/* Роут завжди виконується на запит — кешувати відправку ліда не можна. */
export const dynamic = "force-dynamic";

interface LeadPayload {
  name: string;
  phone: string;
  /** "demo" — модалка, "brief" — форма на /modules. */
  source: "demo" | "brief";
  /** Бриф: розмір церкви, інструменти, побажання. */
  about?: string;
  size?: string;
  tools?: string[];
  /** Ідентифікатори цілей із фінального блоку. */
  goals?: string[];
  /** Сторінка, з якої надіслано. */
  page?: string;
  lang?: string;
  /** Пастка для ботів: люди це поле не бачать і не заповнюють. */
  company?: string;
}

const MAX = { name: 80, phone: 32, about: 2000, size: 60, page: 200 };

/* Усе, що прийшло з форми, чистимо перед тим, як кудись покласти.
   Керівні символи викидаємо (крім переносу рядка — він потрібен у
   «Побажаннях»), CRLF зводимо до \n. */
function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/* Поля, які в інтерфейсі займають один рядок: ім'я, телефон, розмір,
   сторінка. Перенос усередині такого значення — або випадковість, або
   спроба дописати щось у тему листа (ім'я їде в Subject), тож будь-який
   пробільний набір зводимо до одного пробілу. */
function line(value: unknown, max: number) {
  return clean(value, max).replace(/\s+/g, " ").trim();
}

/* Telegram розбирає повідомлення як HTML, тож усе, що надрукував
   відвідувач, треба екранувати. Ім'я на кшталт ТОВ "Ромашка" & партнери
   інакше валить відправку (400 can't parse entities) — і якщо пошта не
   налаштована, лід губиться; а <a href> із поля став би живим посиланням
   у робочому чаті. Пошта отримує той самий текст без розмітки. */
function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Цілі приходять ідентифікаторами, а в лід потрапляють наші ж підписи зі
   словника. Чужий текст у повідомлення не потрапляє: невідомий id відкидаємо. */
const GOAL_LABELS = i18n.ua.builder.goals as Record<string, { label: string }>;

function goalLabels(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 16)
    .map((id) => (typeof id === "string" ? GOAL_LABELS[id]?.label : undefined))
    .filter((label): label is string => Boolean(label));
}

/* Три різні заслінки, бо спам буває трьох видів.

   1. Одна адреса — не більше 5 лідів за 10 хвилин. Ловить того, хто
      довбить кнопку або крутить скрипт з одного місця.
   2. Увесь процес — не більше 40 лідів за 10 хвилин. Ботнет міняє адреси,
      і перша заслінка його не бачить; ця не дає залити чат і пошту.
      Звичайний день лендінга — одиниці лідів, тож поріг із запасом.
   3. Той самий телефон із тієї самої форми — один лід на 15 хвилин.
      Це головне проти дублів: подвійний клік, повтор після обриву мережі
      чи перезаслана форма більше не перетворюються на N повідомлень. */
const WINDOW_MS = 10 * 60 * 1000;
const byIp = createLimiter({ limit: 5, windowMs: WINDOW_MS });
const overall = createLimiter({ limit: 40, windowMs: WINDOW_MS });
const duplicates = createDeduper({ ttlMs: 15 * 60 * 1000 });

/* Тіло ліда — це кілька рядків; мегабайти сюди приходять тільки зі зла. */
const MAX_BODY = 8 * 1024;

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { channel: "telegram", ok: false, skipped: true };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    return { channel: "telegram", ok: res.ok, status: res.status };
  } catch (e) {
    return { channel: "telegram", ok: false, error: String(e) };
  }
}

async function sendEmail(subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO ?? SITE_EMAIL;
  if (!key || !from) return { channel: "email", ok: false, skipped: true };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text }),
      signal: AbortSignal.timeout(8000),
    });
    return { channel: "email", ok: res.ok, status: res.status };
  } catch (e) {
    return { channel: "email", ok: false, error: String(e) };
  }
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return Response.json({ ok: false, error: "too_large" }, { status: 413 });
    }
    body = JSON.parse(raw) as LeadPayload;
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  /* Бот заповнив приховане поле — тихо відповідаємо «ок», нікуди не шлемо. */
  if (clean(body.company, 100)) return Response.json({ ok: true });

  /* Заслінки — до розбору й перевірок: флуд не має коштувати нам роботи.
     Невідома адреса (запуск без проксі) складається в один спільний кошик —
     краще спільна межа, ніж жодної. */
  const ip = clientIp(request.headers) || "unknown";
  if (byIp.check(ip)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  if (overall.check("all")) {
    console.error("[lead] спрацювала загальна заслінка — схоже на ботнет");
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const name = line(body.name, MAX.name);
  const phone = line(body.phone, MAX.phone);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) {
    return Response.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const source = body.source === "brief" ? "brief" : "demo";

  /* Дубль: той самий телефон із тієї самої форми. Відповідаємо «ок» —
     заявка справді прийнята, просто повідомлення вже пішло. Форма покаже
     «дякуємо», а не помилку, і людина не почне слати втретє. */
  const dedupeKey = `${source}|${phone.replace(/\D/g, "")}`;
  if (duplicates.seenRecently(dedupeKey)) {
    return Response.json({ ok: true, duplicate: true });
  }

  const title = source === "brief" ? "🧩 Бриф із /modules" : "📞 Заявка на демо";
  const lines = [
    `Ім'я: ${name}`,
    `Телефон: ${phone}`,
    line(body.size, MAX.size) && `Розмір: ${line(body.size, MAX.size)}`,
    Array.isArray(body.tools) && body.tools.length && `Інструменти: ${body.tools.slice(0, 12).map((s) => line(s, 40)).join(", ")}`,
    goalLabels(body.goals).length && `Хочуть покращити: ${goalLabels(body.goals).join(", ")}`,
    clean(body.about, MAX.about) && `Побажання: ${clean(body.about, MAX.about)}`,
    line(body.page, MAX.page) && `Сторінка: ${line(body.page, MAX.page)}`,
    `Мова: ${body.lang === "en" ? "en" : "ua"}`,
    `Час: ${new Date().toISOString()}`,
  ].filter(Boolean) as string[];

  /* Один набір рядків — два представлення: чистий текст у пошту,
     екранований і з жирним заголовком у Telegram. */
  const text = [title, ...lines].join("\n");
  const html = [`<b>${escapeHtml(title)}</b>`, ...lines.map(escapeHtml)].join("\n");

  const results = await Promise.all([
    sendTelegram(html),
    sendEmail(source === "brief" ? `Бриф з сайту — ${name}` : `Заявка на демо — ${name}`, text),
  ]);

  const delivered = results.filter((r) => r.ok);
  if (delivered.length === 0) {
    /* Жоден канал не відпрацював — лід не має зникнути безслідно.
       Знімаємо позначку дубля, щоб повтор одразу пішов у роботу. */
    duplicates.forget(dedupeKey);
    console.error("[lead] не доставлено", { results, text });
    const configured = results.some((r) => !("skipped" in r && r.skipped));
    return Response.json(
      { ok: false, error: configured ? "delivery_failed" : "not_configured" },
      { status: 503 }
    );
  }

  return Response.json({ ok: true, delivered: delivered.map((r) => r.channel) });
}
