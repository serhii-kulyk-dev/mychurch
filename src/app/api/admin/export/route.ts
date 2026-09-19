import { cookies } from "next/headers";
import { store } from "@/lib/analytics/store";
import { resolveRange } from "@/lib/analytics/range";
import { ADMIN_COOKIE, verifyToken } from "@/lib/analytics/auth";

/* Вивантаження сирих подій: CSV для таблиці, JSON для скриптів.
   Дані наші, тож забрати їх можна будь-коли й без посередників. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLUMNS = [
  "ts",
  "date",
  "name",
  "path",
  "visitor",
  "session",
  "visit",
  "source",
  "medium",
  "campaign",
  "ref",
  "device",
  "browser",
  "os",
  "country",
  "city",
  "lang",
  "props",
] as const;

/* Excel і Numbers виконують клітинку, що починається з =, +, - або @,
   як формулу. Назви подій і шляхи прилітають із відкритого /api/track —
   такий рядок може підсунути будь-хто, а відкриють файл уже в нас.
   Знешкоджуємо апострофом: він лишається в тексті, але формули немає. */
const FORMULA = /^[=+\-@\t\r]/;

function csvCell(value: unknown) {
  const text = value === undefined || value === null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  const quoted = text.replace(/"/g, '""');
  if (FORMULA.test(text)) return `"'${quoted}"`;
  return /[",;\n]/.test(text) ? `"${quoted}"` : text;
}

export async function GET(request: Request) {
  /* Своя перевірка, а не лише proxy.ts: тут віддається весь сирий потік
     подій, тож роут не має покладатись на те, що його хтось прикриє.
     Документація Next прямо каже, що proxy — не заміна авторизації. */
  if (!(await verifyToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const range = resolveRange(params.get("range") ?? undefined);
  const events = await store.read(range.from, range.to);
  const stamp = new Date().toISOString().slice(0, 10);
  const json = params.get("format") === "json";

  const name = `mychurch-analytics-${range.id}-${stamp}.${json ? "json" : "csv"}`;
  return streamed(json ? jsonChunks(events) : csvChunks(events), {
    "content-type": json ? "application/json; charset=utf-8" : "text/csv; charset=utf-8",
    "content-disposition": `attachment; filename="${name}"`,
    "cache-control": "no-store",
  });
}

/* «Увесь час» — це 400 діб подій. Сам масив ми вже тримаємо в пам'яті
   (сховище віддає його цілим), але складати з нього ще й один суцільний
   рядок — це другий такий самий шматок пам'яті, а для JSON з відступами
   ще й у кілька разів більший. Тож віддаємо потоком, рядок за рядком. */
function streamed(chunks: Iterable<string>, headers: Record<string, string>) {
  const encoder = new TextEncoder();
  const iterator = chunks[Symbol.iterator]();
  return new Response(
    new ReadableStream({
      pull(controller) {
        const next = iterator.next();
        if (next.done) controller.close();
        else controller.enqueue(encoder.encode(next.value));
      },
    }),
    { headers }
  );
}

function* csvChunks(events: Awaited<ReturnType<typeof store.read>>) {
  /* BOM — щоб Excel не зіпсував українські літери. */
  yield "\ufeff" + COLUMNS.join(";") + "\n";
  for (const e of events) {
    yield (
      COLUMNS.map((column) =>
        csvCell(column === "date" ? new Date(e.ts).toISOString() : (e as unknown as Record<string, unknown>)[column])
      ).join(";") + "\n"
    );
  }
}

/* По об'єкту на рядок: це той самий валідний JSON-масив, тільки без
   відступів — і його не треба збирати цілим, щоб віддати. */
function* jsonChunks(events: Awaited<ReturnType<typeof store.read>>) {
  yield "[\n";
  let first = true;
  for (const e of events) {
    yield (first ? "" : ",\n") + JSON.stringify(e);
    first = false;
  }
  yield "\n]\n";
}
