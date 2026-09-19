import Link from "next/link";
import { store } from "@/lib/analytics/store";
import { buildReport } from "@/lib/analytics/report";
import { resolveRange } from "@/lib/analytics/range";
import { duration, fullOf, shortId } from "@/lib/analytics/format";
import RangeBar from "@/components/admin/range-bar";
import { Card, Cell, Pill, Table } from "@/components/admin/ui";

/* Усі візити періоду. Звідси — в стрічку кроків конкретного візиту. */

export const dynamic = "force-dynamic";

const FILTERS = [
  { id: "all", label: "Усі" },
  { id: "leads", label: "Із заявкою" },
  { id: "form", label: "Дійшли до форми" },
  { id: "engaged", label: "Читали" },
];

export default async function AdminSessions({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; filter?: string }>;
}) {
  const { range: rangeParam, filter = "all" } = await searchParams;
  const range = resolveRange(rangeParam);
  const events = await store.read(range.from, range.to);
  const report = buildReport(events, range.from, range.to);

  const sessions = report.sessions.filter((s) =>
    filter === "leads" ? s.lead : filter === "form" ? s.form : filter === "engaged" ? s.engaged : true
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Візити · {range.label.toLowerCase()}</h1>
        <RangeBar range={range.id} path="/admin/sessions" />
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-hairline bg-surface p-1 text-xs">
        {FILTERS.map((f) => (
          <Link
            key={f.id}
            href={`/admin/sessions?range=${range.id}&filter=${f.id}`}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              f.id === filter ? "bg-brand text-white" : "text-ink-2 hover:bg-surface-3"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Card title={`${sessions.length} візитів`} hint="Один рядок — один візит. «Кроки» показують усе, що людина робила.">
        <Table head={["Коли", "Людина", "№", "Сторінок", "Час", "Глибина", "Шлях", "Джерело", "Пристрій", ""]}>
          {sessions.slice(0, 300).map((s) => (
            <tr key={s.id}>
              <Cell className="whitespace-nowrap">{fullOf(s.start)}</Cell>
              <Cell>
                <Link href={`/admin/people/${s.visitor}?range=${range.id}`} className="font-mono text-xs text-ink hover:text-brand">
                  {shortId(s.visitor)}
                </Link>
              </Cell>
              <Cell className="tabular-nums">#{s.visit}</Cell>
              <Cell className="tabular-nums">{s.pageviews}</Cell>
              <Cell className="whitespace-nowrap tabular-nums">{duration(s.seconds)}</Cell>
              <Cell className="tabular-nums">{s.depth}%</Cell>
              <Cell className="max-w-[260px] truncate font-mono text-xs" title={s.pages.join(" → ")}>
                {s.pages.join(" → ") || s.entry}
              </Cell>
              <Cell>
                {s.source}
                {s.campaign && <span className="text-ink-3"> / {s.campaign}</span>}
              </Cell>
              <Cell className="whitespace-nowrap">
                {s.device}
                {s.country && <span className="text-ink-3"> · {s.country}</span>}
              </Cell>
              <Cell>
                <div className="flex items-center gap-1">
                  {s.lead && <Pill tone="warm">заявка</Pill>}
                  {!s.lead && s.form && <Pill tone="brand">форма</Pill>}
                  <Link href={`/admin/sessions/${s.id}?range=${range.id}`} className="whitespace-nowrap text-xs text-brand hover:underline">
                    кроки →
                  </Link>
                </div>
              </Cell>
            </tr>
          ))}
        </Table>
        {sessions.length > 300 && <p className="mt-3 text-xs text-ink-3">Показано перші 300. Решта — у вивантаженні CSV.</p>}
      </Card>
    </div>
  );
}
