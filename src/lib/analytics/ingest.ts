import { userAgent } from "next/server";
import { clientIp } from "@/lib/rate-limit";
import type { StoredEvent, TrackBatch } from "./types";

/* Перетворення пачки подій із браузера на записи для сховища:
   чистимо рядки, дораховуємо джерело візиту, пристрій і країну.

   Свідомо НЕ зберігаємо: IP-адресу (тільки хеш із сіллю), e-mail,
   телефон і будь-який текст, введений у поля форм.                 */

const LIMITS = { name: 40, path: 200, key: 32, value: 200, ref: 200 };
const MAX_EVENTS = 60;
const MAX_PROPS = 12;

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Сіль для хешування IP: своя на кожну добу, щоб хеш не був вічним ідентифікатором. */
function dailySalt() {
  const base = process.env.ANALYTICS_SALT ?? process.env.ANALYTICS_PASSWORD ?? "mychurch";
  return `${base}:${new Date().toISOString().slice(0, 10)}`;
}

async function hashIp(ip: string) {
  if (!ip) return undefined;
  const data = new TextEncoder().encode(dailySalt() + ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}



/* Пошуковики й соцмережі під своїми іменами — інакше в звіті буде
   мішанина з "www.google.com", "google.com.ua" і "l.facebook.com". */
const KNOWN: Array<[RegExp, string]> = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\./, "bing"],
  [/(^|\.)duckduckgo\./, "duckduckgo"],
  [/(^|\.)yahoo\./, "yahoo"],
  [/(^|\.)facebook\.|(^|\.)fb\./, "facebook"],
  [/(^|\.)instagram\./, "instagram"],
  [/(^|\.)t\.me$|(^|\.)telegram\./, "telegram"],
  [/(^|\.)youtube\.|(^|\.)youtu\.be$/, "youtube"],
  [/(^|\.)linkedin\.|lnkd\.in$/, "linkedin"],
  [/(^|\.)tiktok\./, "tiktok"],
  [/(^|\.)viber\./, "viber"],
  [/(^|\.)x\.com$|(^|\.)twitter\./, "x"],
];

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export interface SessionContext {
  ref: string;
  source: string;
  medium?: string;
  campaign?: string;
}

/** Звідки прийшов візит: спершу UTM-мітки, потім реферер, інакше — прямий захід. */
export function resolveSource(referrer: string, query: string, selfHost: string): SessionContext {
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const utmSource = str(params.get("utm_source"), LIMITS.key);
  const utmMedium = str(params.get("utm_medium"), LIMITS.key);
  const utmCampaign = str(params.get("utm_campaign"), LIMITS.key);
  const host = hostOf(referrer);

  if (utmSource) {
    return { ref: host, source: utmSource.toLowerCase(), medium: utmMedium || undefined, campaign: utmCampaign || undefined };
  }
  if (!host || host === selfHost) return { ref: "", source: "direct" };

  const known = KNOWN.find(([re]) => re.test(host));
  return {
    ref: host,
    source: known ? known[1] : host,
    medium: known && ["google", "bing", "duckduckgo", "yahoo"].includes(known[1]) ? "organic" : "referral",
  };
}

/** Прапорець «це бот» — такі візити в звіт не потрапляють. */
export function looksLikeBot(headers: Headers) {
  const ua = headers.get("user-agent") ?? "";
  if (!ua) return true;
  if (/bot|crawl|spider|slurp|headless|preview|monitor|lighthouse|curl|wget|python-requests|axios/i.test(ua)) return true;
  try {
    return userAgent({ headers }).isBot;
  } catch {
    return false;
  }
}

export async function toStoredEvents(batch: TrackBatch, headers: Headers, selfHost: string): Promise<StoredEvent[]> {
  const visitor = str(batch.v, LIMITS.key);
  const session = str(batch.s, LIMITS.key);
  if (!visitor || !session || !Array.isArray(batch.events) || !batch.events.length) return [];

  const ua = userAgent({ headers });
  const context = resolveSource(str(batch.ref, LIMITS.ref), str(batch.query, LIMITS.ref), selfHost);
  const ipHash = await hashIp(clientIp(headers));
  const now = Date.now();

  const base = {
    visitor,
    session,
    visit: Math.max(1, Math.min(9999, Math.round(Number(batch.visit) || 1))),
    ref: context.ref || undefined,
    source: context.source,
    medium: context.medium,
    campaign: context.campaign,
    device: ua.device?.type ?? "desktop",
    browser: ua.browser?.name,
    os: ua.os?.name,
    country: headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? undefined,
    city: decodeCity(headers.get("x-vercel-ip-city")),
    lang: str(batch.lang, 8) || undefined,
    screen: str(batch.screen, 16) || undefined,
    ipHash,
  };

  return batch.events.slice(0, MAX_EVENTS).flatMap((raw) => {
    const name = str(raw.n, LIMITS.name);
    if (!name) return [];
    /* Час приходить із браузера: годинник там може брехати, тому
       майбутнє й глибоке минуле підтягуємо до моменту прийому. */
    const ts = Number(raw.t);
    const safeTs = Number.isFinite(ts) && ts > now - 6 * 60 * 60 * 1000 && ts < now + 60_000 ? ts : now;
    return [{ ...base, ts: safeTs, name, path: str(raw.p, LIMITS.path) || "/", props: cleanProps(raw.d) }];
  });
}

function decodeCity(value: string | null) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function cleanProps(input: unknown) {
  if (!input || typeof input !== "object") return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>).slice(0, MAX_PROPS)) {
    const k = str(key, LIMITS.key);
    if (!k) continue;
    if (typeof value === "number" && Number.isFinite(value)) out[k] = Math.round(value * 100) / 100;
    else if (typeof value === "boolean") out[k] = value;
    else if (typeof value === "string" && value.trim()) out[k] = value.trim().slice(0, LIMITS.value);
  }
  return Object.keys(out).length ? out : undefined;
}
