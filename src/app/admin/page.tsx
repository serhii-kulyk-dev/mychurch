import Link from "next/link";
import { store } from "@/lib/analytics/store";
import { buildReport } from "@/lib/analytics/report";
import { resolveRange } from "@/lib/analytics/range";
import { ago, duration, shortId } from "@/lib/analytics/format";
import { eventLabel } from "@/lib/analytics/events";
import RangeBar from "@/components/admin/range-bar";
import { BarList, Card, Cell, DayChart, Pill, Stat, Table } from "@/components/admin/ui";

/* Огляд: скільки людей, звідки прийшли, що робили і де відвалились. */

export const dynamic = "force-dynamic";

export default async function AdminOverview({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = resolveRange((await searchParams).range);
  const events = await store.read(range.from, range.to);
  const report = buildReport(events, range.from, range.to);
  const { totals } = report;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Огляд · {range.label.toLowerCase()}</h1>
        <RangeBar range={range.id} path="/admin" />
      </div>

      {!events.length ? (
        <Card title="Подій ще немає">
          <div className="space-y-2 text-sm text-ink-2">
            <p>
              Лічильник уже стоїть на сайті — перші кроки з&apos;являться тут, щойно хтось відкриє сторінку.
              Себе не рахуємо: відкрийте <code className="rounded bg-surface-3 px-1">/?notrack=1</code>, щоб виключити свій браузер.
            </p>
            <p className="text-ink-3">Дані пишуться сюди: {store.where}.</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat
              label="Людей"
              value={totals.visitors.toLocaleString("uk-UA")}
              hint={`${totals.newVisitors} нових · ${totals.returning} повторних`}
            />
            <Stat label="Візитів" value={totals.sessions.toLocaleString("uk-UA")} hint={`${totals.perVisitor} на людину`} />
            <Stat label="Переглядів" value={totals.pageviews.toLocaleString("uk-UA")} hint={`${totals.events} подій усього`} />
            <Stat label="Середній візит" value={duration(totals.avgSeconds)} hint={`${totals.bounceRate}% пішли одразу`} />
            <Stat label="Заявок" value={totals.leads.toLocaleString("uk-UA")} hint="демо + бриф" />
            <Stat label="Конверсія" value={`${totals.conversion}%`} hint="візит → заявка" />
          </div>

          <Card title="Візити по днях" hint="Наведіть на стовпчик — побачите деталі дня. Крапка зверху означає заявку.">
            <DayChart data={report.byDay} />
          </Card>

          <Card title="Воронка" hint="Кожен крок — частка візитів, які до нього дійшли.">
            <div className="space-y-2">
              {report.funnel.map((step, i) => (
                <div key={step.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-ink">
                      {i + 1}. {step.label}
                    </span>
                    <span className="tabular-nums text-ink-2">
                      {step.sessions.toLocaleString("uk-UA")} · {step.share}%
                      {i > 0 && step.drop > 0 && <span className="ml-2 text-ink-3">−{step.drop}%</span>}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(step.share, 1)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-3">{step.hint}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Звідки приходять" hint="Джерело візиту: utm_source, реферер або прямий захід.">
              <BarList rows={report.sources} />
            </Card>
            <Card title="Сторінки" hint="Перегляди, унікальні люди й середній час на сторінці.">
              <Table head={["Сторінка", "Переглядів", "Людей", "Час", "Виходів"]}>
                {report.pages.slice(0, 12).map((page) => (
                  <tr key={page.path}>
                    <Cell className="text-ink">
                      <Link href={page.path} className="hover:text-brand" title={page.path}>
                        {page.path}
                      </Link>
                    </Cell>
                    <Cell className="tabular-nums">{page.views}</Cell>
                    <Cell className="tabular-nums">{page.visitors}</Cell>
                    <Cell className="tabular-nums">{duration(page.avgSeconds)}</Cell>
                    <Cell className="tabular-nums">{page.exits}</Cell>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Що натискали" hint="Підпис кнопки або посилання.">
              <BarList rows={report.clicks} empty="Кліків ще не було" />
            </Card>
            <Card title="Які блоки читали" hint="Блок зараховано, коли він побув на екрані.">
              <BarList rows={report.blocks} empty="Блоки ще не переглядали" />
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Пристрої">
              <BarList rows={report.devices} />
              <div className="mt-3 border-t border-hairline pt-3">
                <BarList rows={report.browsers} />
              </div>
            </Card>
            <Card title="Країни та реферери">
              <BarList rows={report.countries} empty="Країна невідома (хостинг не передає)" />
              <div className="mt-3 border-t border-hairline pt-3">
                <BarList rows={report.refs} empty="Прямі заходи" />
              </div>
            </Card>
            <Card title="Коли заходять" hint="Години за Києвом.">
              <div className="flex h-28 items-end gap-0.5">
                {report.byHour.map((h) => {
                  const max = Math.max(...report.byHour.map((x) => x.sessions), 1);
                  return (
                    <div
                      key={h.hour}
                      title={`${String(h.hour).padStart(2, "0")}:00 — ${h.sessions} візитів`}
                      className="flex-1 rounded-t-sm bg-brand/70"
                      style={{ height: `${Math.max(2, (h.sessions / max) * 100)}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-ink-3">
                <span>00</span>
                <span>06</span>
                <span>12</span>
                <span>18</span>
                <span>23</span>
              </div>
            </Card>
          </div>

          <Card
            title="Останні візити"
            hint="Натисніть на рядок — побачите всі кроки людини."
            action={
              <Link href={`/admin/sessions?range=${range.id}`} className="text-xs text-brand hover:underline">
                усі візити →
              </Link>
            }
          >
            <Table head={["Коли", "Людина", "Візит", "Сторінки", "Час", "Джерело", "Пристрій", ""]}>
              {report.sessions.slice(0, 12).map((s) => (
                <tr key={s.id}>
                  <Cell className="whitespace-nowrap">{ago(s.start)}</Cell>
                  <Cell>
                    <Link href={`/admin/people/${s.visitor}`} className="font-mono text-xs text-ink hover:text-brand">
                      {shortId(s.visitor)}
                    </Link>
                  </Cell>
                  <Cell className="tabular-nums">#{s.visit}</Cell>
                  <Cell className="tabular-nums">{s.pageviews}</Cell>
                  <Cell className="whitespace-nowrap tabular-nums">{duration(s.seconds)}</Cell>
                  <Cell>{s.source}</Cell>
                  <Cell>{s.device}</Cell>
                  <Cell>
                    <div className="flex items-center gap-1">
                      {s.lead && <Pill tone="warm">заявка</Pill>}
                      <Link href={`/admin/sessions/${s.id}`} className="text-xs text-brand hover:underline">
                        кроки →
                      </Link>
                    </div>
                  </Cell>
                </tr>
              ))}
            </Table>
          </Card>

          <Card title="Події" hint="Скільки разів сталася кожна дія.">
            <BarList rows={report.eventCounts.map((row) => ({ ...row, name: eventLabel(row.name) }))} />
          </Card>
        </>
      )}

      <p className="pb-6 text-center text-xs text-ink-3">
        Дані зберігаються на нашому боці ({store.where}). Жодних сторонніх лічильників.
      </p>
    </div>
  );
}
