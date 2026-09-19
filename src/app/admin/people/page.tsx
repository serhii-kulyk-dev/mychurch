import Link from "next/link";
import { store } from "@/lib/analytics/store";
import { buildReport } from "@/lib/analytics/report";
import { resolveRange } from "@/lib/analytics/range";
import { ago, duration, fullOf, shortId } from "@/lib/analytics/format";
import RangeBar from "@/components/admin/range-bar";
import { Card, Cell, Pill, Stat, Table } from "@/components/admin/ui";

/* Люди: хто скільки разів заходив. Ідентифікатор — випадковий рядок
   у браузері людини, жодних імен і адрес ми не знаємо.             */

export const dynamic = "force-dynamic";

export default async function AdminPeople({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = resolveRange((await searchParams).range);
  const events = await store.read(range.from, range.to);
  const report = buildReport(events, range.from, range.to);
  const repeat = report.visitors.filter((v) => v.visits > 1).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Люди · {range.label.toLowerCase()}</h1>
        <RangeBar range={range.id} path="/admin/people" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Усього людей" value={report.totals.visitors} />
        <Stat label="Приходили не вперше" value={repeat} hint={`${report.totals.returning} мають візити й до цього періоду`} />
        <Stat label="Візитів на людину" value={report.totals.perVisitor} />
        <Stat label="Із заявкою" value={report.visitors.filter((v) => v.leads > 0).length} />
      </div>

      <Card title="Хто скільки разів заходив" hint="Сортування — за кількістю візитів у періоді.">
        <Table head={["Людина", "Візитів", "За весь час", "Уперше", "Востаннє", "Сторінок", "Час", "Джерела", "Пристрій", ""]}>
          {report.visitors.slice(0, 300).map((v) => (
            <tr key={v.id}>
              <Cell className="font-mono text-xs text-ink">{shortId(v.id)}</Cell>
              <Cell className="tabular-nums font-medium text-ink">{v.visits}</Cell>
              <Cell className="tabular-nums">{v.allTimeVisits}</Cell>
              <Cell className="whitespace-nowrap" title={fullOf(v.first)}>
                {ago(v.first)}
              </Cell>
              <Cell className="whitespace-nowrap" title={fullOf(v.last)}>
                {ago(v.last)}
              </Cell>
              <Cell className="tabular-nums">{v.pageviews}</Cell>
              <Cell className="whitespace-nowrap tabular-nums">{duration(v.seconds)}</Cell>
              <Cell className="max-w-[180px] truncate" title={v.sources.join(", ")}>
                {v.sources.join(", ")}
              </Cell>
              <Cell className="whitespace-nowrap">
                {v.devices.join(", ")}
                {v.country && <span className="text-ink-3"> · {v.country}</span>}
              </Cell>
              <Cell>
                <div className="flex items-center gap-1">
                  {v.leads > 0 && <Pill tone="warm">заявка</Pill>}
                  <Link href={`/admin/people/${v.id}?range=${range.id}`} className="whitespace-nowrap text-xs text-brand hover:underline">
                    історія →
                  </Link>
                </div>
              </Cell>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
