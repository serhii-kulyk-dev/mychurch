import { after } from "next/server";
import { store } from "@/lib/analytics/store";
import { looksLikeBot, toStoredEvents } from "@/lib/analytics/ingest";
import { clientIp, createLimiter } from "@/lib/rate-limit";
import type { TrackBatch } from "@/lib/analytics/types";

/* Прийом подій із сайту. Відповідає 204 одразу, а пише вже після
   відповіді (`after`) — трекер не має додавати сторінці ані мілісекунди.

   Приймає і звичайний JSON (fetch), і text/plain — саме так надсилає
   `navigator.sendBeacon`, коли вкладку закривають.                   */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Заслінка від флуду: до 120 пачок на адресу за 10 хвилин.
   Звичайний візит укладається в одиниці пачок. Адреси без проксі
   («unknown») складаються в один кошик, і поріг для них вищий —
   інакше локальний запуск глушив би сам себе. */
const WINDOW_MS = 10 * 60 * 1000;
const byIp = createLimiter({ limit: 120, windowMs: WINDOW_MS });
const unknownIp = createLimiter({ limit: 1200, windowMs: WINDOW_MS });

const NO_CONTENT = { status: 204, headers: { "cache-control": "no-store" } };

export async function POST(request: Request) {
  const headers = request.headers;
  /* Ботам не заважаємо, але й у звіт їх не пускаємо. */
  if (looksLikeBot(headers)) return new Response(null, NO_CONTENT);
  const ip = clientIp(headers);
  const limiter = ip ? byIp : unknownIp;
  if (limiter.check(ip || "unknown")) {
    return new Response(null, { status: 429, headers: { "cache-control": "no-store" } });
  }

  let batch: TrackBatch;
  try {
    batch = JSON.parse(await request.text()) as TrackBatch;
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const selfHost = (headers.get("x-forwarded-host") ?? headers.get("host") ?? "").replace(/^www\./, "").split(":")[0];
  const events = await toStoredEvents(batch, headers, selfHost);
  if (!events.length) return new Response(null, NO_CONTENT);

  after(async () => {
    try {
      await store.append(events);
    } catch (err) {
      console.error("[analytics] подія не збереглась", err);
    }
  });

  return new Response(null, NO_CONTENT);
}
