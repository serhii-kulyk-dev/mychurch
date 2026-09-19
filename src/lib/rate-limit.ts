/* Спільна заслінка від флуду для роутів /api/*.

   Лічильники живуть у пам'яті процесу — для лендінга цього досить і не
   потребує зовнішнього сховища. На кількох інстансах кожен рахує свій
   трафік: межа стає м'якшою, але заслінка лишається.

   Тут три речі:
     clientIp      — чия це адреса насправді (з оглядкою на підробку);
     createLimiter — скільки запитів з адреси пускаємо за вікно;
     createDeduper — той самий запит удруге за вікно не обробляємо.       */

/* Заголовки, які проставляє сам проксі й перезаписує чуже значення —
   підробити їх ззовні не можна. */
const TRUSTED_IP_HEADERS = ["x-vercel-forwarded-for", "cf-connecting-ip", "x-real-ip"] as const;

/** Адреса відвідувача; порожній рядок, якщо визначити не вдалось. */
export function clientIp(headers: Headers): string {
  for (const name of TRUSTED_IP_HEADERS) {
    const value = headers.get(name)?.trim();
    if (value) return value;
  }
  /* Ланцюжок x-forwarded-for клієнт може почати сам: «1.2.3.4» приїде
     ліворуч, а наш проксі допише справжню адресу праворуч. Тому беремо
     ПРАВИЙ запис — його дописав найближчий до нас проксі, не клієнт.
     (CDN перед nginx дав би тут адресу CDN, але для таких схем вище вже
     спрацював cf-connecting-ip / x-vercel-forwarded-for.) */
  const chain = headers.get("x-forwarded-for");
  if (chain) {
    const parts = chain.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "";
}

/* Мапа в JS тримає ключі в порядку вставки. Перевставляючи ключ на
   кожному дотику, отримуємо чергу «найдавніше чіпали — попереду», і
   витісняти при переповненні можна з голови. Раніше мапа на переповненні
   чистилась цілком — і флудер міг скинути власний лічильник, наробивши
   нових ключів. */
function touch<T>(map: Map<string, T>, key: string, value: T, maxKeys: number) {
  map.delete(key);
  map.set(key, value);
  if (map.size <= maxKeys) return;
  for (const oldest of map.keys()) {
    map.delete(oldest);
    if (map.size <= maxKeys) break;
  }
}

export interface LimiterOptions {
  /** Скільки запитів з одного ключа пускаємо за вікно. */
  limit: number;
  windowMs: number;
  /** Скільки ключів тримаємо в пам'яті. */
  maxKeys?: number;
}

export interface Limiter {
  /** true — ліміт вичерпано, запит обслуговувати не треба. */
  check(key: string): boolean;
}

export function createLimiter({ limit, windowMs, maxKeys = 20_000 }: LimiterOptions): Limiter {
  const hits = new Map<string, number[]>();
  let sweptAt = 0;

  /* Прибирання простроченого — не частіше разу на вікно. */
  function sweep(now: number) {
    if (now - sweptAt < windowMs) return;
    sweptAt = now;
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => now - t < windowMs);
      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  }

  return {
    check(key: string) {
      const now = Date.now();
      sweep(now);
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

      if (recent.length >= limit) {
        /* Понад лімітом більше нічого не записуємо: масив не росте, поки
           той самий клієнт довбиться у зачинені двері, і двері відчиняться
           рівно через вікно після останньої ПРИЙНЯТОЇ спроби. */
        touch(hits, key, recent, maxKeys);
        return true;
      }

      recent.push(now);
      touch(hits, key, recent, maxKeys);
      return false;
    },
  };
}

export interface Deduper {
  /** true — точно такий самий запит уже приймали в межах вікна. */
  seenRecently(key: string): boolean;
  /** Зняти позначку: обробка не вдалась, повтор має пройти одразу. */
  forget(key: string): void;
}

export function createDeduper({ ttlMs, maxKeys = 5_000 }: { ttlMs: number; maxKeys?: number }): Deduper {
  const seen = new Map<string, number>();
  let sweptAt = 0;

  return {
    seenRecently(key: string) {
      const now = Date.now();
      if (now - sweptAt >= ttlMs) {
        sweptAt = now;
        for (const [k, at] of seen) if (now - at >= ttlMs) seen.delete(k);
      }
      const at = seen.get(key);
      /* Відлік починається від першої появи, а не від останньої: інакше
         рівномірний повтор тримав би ключ «свіжим» вічно. */
      if (at !== undefined && now - at < ttlMs) return true;
      /* Позначку ставимо одразу, ще до обробки: два паралельні запити
         (подвійний клік) інакше проскочили б обидва. */
      touch(seen, key, now, maxKeys);
      return false;
    },

    forget(key: string) {
      seen.delete(key);
    },
  };
}
