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

  if (params.get("format") === "json") {
    return new Response(JSON.stringify(events, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="mychurch-analytics-${range.id}-${stamp}.json"`,
        "cache-control": "no-store",
      },
    });
  }

  const lines = [COLUMNS.join(";")];
  for (const e of events) {
    lines.push(
      COLUMNS.map((column) =>
        csvCell(column === "date" ? new Date(e.ts).toISOString() : (e as unknown as Record<string, unknown>)[column])
      ).join(";")
    );
  }

  /* BOM — щоб Excel не зіпсував українські літери. */
  return new Response("﻿" + lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="mychurch-analytics-${range.id}-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
