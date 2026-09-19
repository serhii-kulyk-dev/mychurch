import { promises as fs } from "node:fs";
import path from "node:path";
import type { StoredEvent } from "./types";

/* Сховище подій. Свій сервіс, без зовнішньої аналітики: дані про
   відвідувачів нікуди не виїжджають із нашого сервера.

   Драйвер вибирається сам:
     • Upstash / Vercel KV — якщо задані UPSTASH_REDIS_REST_URL і токен
       (потрібно на serverless, де файлова система тільки для читання);
     • файли JSONL — один файл на добу в ANALYTICS_DIR (типово .data/analytics);
     • пам'ять процесу — запасний варіант, якщо писати нікуди
       (нагадаємо про це в кабінеті, щоб мовчки не губити дані).

   ENV:
     ANALYTICS_DIR              — тека для файлів (типово <корінь>/.data/analytics)
     ANALYTICS_RETENTION_DAYS   — скільки діб тримати (типово 400)
     UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (або KV_REST_API_*)  */

const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_DAYS = Number(process.env.ANALYTICS_RETENTION_DAYS ?? 400);
const DIR = process.env.ANALYTICS_DIR ?? path.join(process.cwd(), ".data", "analytics");
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";
const REDIS_PREFIX = "mychurch:analytics:";

export function dayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

/** Дні (YYYY-MM-DD) від `from` до `to` включно, з запасом у добу з обох боків. */
function daysInRange(from: number, to: number) {
  const out: string[] = [];
  for (let t = from - DAY_MS; t <= to + DAY_MS; t += DAY_MS) out.push(dayKey(t));
  const last = dayKey(to + DAY_MS);
  if (out[out.length - 1] !== last) out.push(last);
  return [...new Set(out)];
}

function parseLines(text: string, from: number, to: number, out: StoredEvent[]) {
  for (const line of text.split("\n")) {
    if (!line) continue;
    try {
      const e = JSON.parse(line) as StoredEvent;
      if (e.ts >= from && e.ts <= to) out.push(e);
    } catch {
      /* Побитий рядок (обірваний запис) — пропускаємо, решта файлу жива. */
    }
  }
}

export interface Store {
  readonly driver: "redis" | "file" | "memory";
  /** Людською мовою: де саме лежать дані. Показується в кабінеті. */
  readonly where: string;
  append(events: StoredEvent[]): Promise<void>;
  read(from: number, to: number): Promise<StoredEvent[]>;
}

// ── Пам'ять процесу ───────────────────────────────────────────────────────────

const MEMORY_LIMIT = 50_000;
const memory: StoredEvent[] = [];

const memoryStore: Store = {
  driver: "memory",
  where: "пам'ять процесу — дані зникнуть після перезапуску",
  async append(events) {
    memory.push(...events);
    if (memory.length > MEMORY_LIMIT) memory.splice(0, memory.length - MEMORY_LIMIT);
  },
  async read(from, to) {
    return memory.filter((e) => e.ts >= from && e.ts <= to);
  },
};

// ── Файли ─────────────────────────────────────────────────────────────────────

let lastSweep = 0;

async function sweepOldFiles() {
  const now = Date.now();
  if (now - lastSweep < 6 * 60 * 60 * 1000) return;
  lastSweep = now;
  try {
    const cutoff = dayKey(now - RETENTION_DAYS * DAY_MS);
    const files = await fs.readdir(DIR);
    await Promise.all(
      files
        .filter((f) => f.endsWith(".jsonl") && f.slice(0, 10) < cutoff)
        .map((f) => fs.rm(path.join(DIR, f), { force: true }))
    );
  } catch {
    /* Прибирання — не критична операція. */
  }
}

const fileStore: Store = {
  driver: "file",
  where: `файли JSONL у ${DIR}`,
  async append(events) {
    const byDay = new Map<string, string[]>();
    for (const e of events) {
      const key = dayKey(e.ts);
      const bucket = byDay.get(key);
      const line = JSON.stringify(e);
      if (bucket) bucket.push(line);
      else byDay.set(key, [line]);
    }
    await fs.mkdir(DIR, { recursive: true });
    for (const [day, lines] of byDay) {
      await fs.appendFile(path.join(DIR, `${day}.jsonl`), lines.join("\n") + "\n", "utf8");
    }
    void sweepOldFiles();
  },
  async read(from, to) {
    const out: StoredEvent[] = [];
    await Promise.all(
      daysInRange(from, to).map(async (day) => {
        try {
          parseLines(await fs.readFile(path.join(DIR, `${day}.jsonl`), "utf8"), from, to, out);
        } catch {
          /* Дня без подій просто немає на диску. */
        }
      })
    );
    return out.sort((a, b) => a.ts - b.ts);
  },
};

// ── Redis (Upstash / Vercel KV) ───────────────────────────────────────────────

async function redis(commands: unknown[][]): Promise<unknown[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const data = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  return data.map((r) => r.result);
}

const redisStore: Store = {
  driver: "redis",
  where: "Redis (Upstash / Vercel KV)",
  async append(events) {
    const byDay = new Map<string, string[]>();
    for (const e of events) {
      const key = dayKey(e.ts);
      const bucket = byDay.get(key);
      if (bucket) bucket.push(JSON.stringify(e));
      else byDay.set(key, [JSON.stringify(e)]);
    }
    const commands: unknown[][] = [];
    for (const [day, lines] of byDay) {
      commands.push(["RPUSH", REDIS_PREFIX + day, ...lines]);
      commands.push(["EXPIRE", REDIS_PREFIX + day, RETENTION_DAYS * 24 * 60 * 60]);
    }
    await redis(commands);
  },
  async read(from, to) {
    const days = daysInRange(from, to);
    const results = await redis(days.map((d) => ["LRANGE", REDIS_PREFIX + d, 0, -1]));
    const out: StoredEvent[] = [];
    for (const day of results) {
      if (!Array.isArray(day)) continue;
      for (const line of day as string[]) parseLines(line, from, to, out);
    }
    return out.sort((a, b) => a.ts - b.ts);
  },
};

// ── Вибір драйвера ────────────────────────────────────────────────────────────

/* Постійне сховище, яке ми обрали на старті. Навіть коли тимчасово
   пишемо в пам'ять, воно лишається тим, куди ми хочемо повернутись. */
const preferred: Store = REDIS_URL && REDIS_TOKEN ? redisStore : fileStore;
const RETRY_MS = 5 * 60 * 1000;

let active: Store = preferred;
let warned = false;
let fellBackAt = 0;

export const store: Store = {
  get driver() {
    return active.driver;
  },
  get where() {
    return active.where;
  },
  async append(events) {
    if (!events.length) return;

    /* Redis — це мережа, і моргнути вона може на рівному місці. Тому
       падіння не вирок: раз на кілька хвилин пробуємо постійне сховище
       знову й забираємо з собою те, що назбиралось у пам'яті. Диск
       «тільки для читання» від цього не оживе — просто впаде ще раз. */
    if (active === memoryStore && Date.now() - fellBackAt > RETRY_MS) {
      const buffered = memory.slice();
      try {
        if (buffered.length) await preferred.append(buffered);
        /* Знімаємо рівно стільки, скільки віддали: поки тривав запис,
           у пам'ять могли впасти нові події. */
        memory.splice(0, buffered.length);
        active = preferred;
        warned = false;
        console.info(`[analytics] сховище знову доступне (${preferred.driver}), подій повернуто: ${buffered.length}`);
      } catch {
        fellBackAt = Date.now();
      }
    }

    try {
      await active.append(events);
      return;
    } catch (err) {
      /* Диск тільки для читання (типово для serverless) — переходимо
         в пам'ять, але один раз голосно про це кажемо в логах. */
      if (active === memoryStore) {
        console.error("[analytics] подія не збереглась навіть у пам'ять", err);
        return;
      }
      if (!warned) {
        warned = true;
        console.error(
          "[analytics] не вдалось записати події, переходжу в пам'ять процесу. " +
            "Для постійного зберігання задайте UPSTASH_REDIS_REST_URL/TOKEN або ANALYTICS_DIR з правом запису.",
          err
        );
      }
      active = memoryStore;
      fellBackAt = Date.now();
    }
    await memoryStore.append(events);
  },
  read(from, to) {
    return active.read(from, to);
  },
};
