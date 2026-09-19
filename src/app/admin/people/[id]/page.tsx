import Link from "next/link";
import { notFound } from "next/navigation";
import { findEvents } from "@/lib/analytics/lookup";
import { buildSessions } from "@/lib/analytics/report";
import { ago, duration, fullOf, shortId } from "@/lib/analytics/format";
import Timeline from "@/components/admin/timeline";
import { Card, Pill, Stat } from "@/components/admin/ui";

/* Історія однієї людини: усі візити, і в кожному — кроки. */

export const dynamic = "force-dynamic";

export default async function AdminPerson({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { id } = await params;
  const { range } = await searchParams;
  /* Історію людини дивляться саме заради «а коли він був уперше» —
     тому беремо весь архів, а не вибраний період. */
  const events = await findEvents((e) => e.visitor === id, "all");
  if (!events.length) notFound();

  const sessions = [...buildSessions(events).values()].sort((a, b) => b.start - a.start);
  const first = sessions[sessions.length - 1];
  const last = sessions[0];
  const leads = sessions.filter((s) => s.lead).length;
  const seconds = sessions.reduce((sum, s) => sum + s.seconds, 0);
  const byId = new Map(sessions.map((s) => [s.id, events.filter((e) => e.session === s.id)]));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-lg font-semibold">{shortId(id)}</h1>
          <p className="text-sm text-ink-3">
            Уперше {ago(first.start)} · востаннє {ago(last.start)}
          </p>
        </div>
        <Link href={`/admin/people?range=${range ?? "7d"}`} className="text-sm text-brand hover:underline">
          ← до списку
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Візитів" value={sessions.length} hint={`лічильник браузера: ${last.visit}`} />
        <Stat label="Переглядів" value={sessions.reduce((sum, s) => sum + s.pageviews, 0)} />
        <Stat label="Загальний час" value={duration(seconds)} />
        <Stat label="Заявок" value={leads} />
        <Stat label="Перше джерело" value={<span className="text-base">{first.source}</span>} hint={first.ref || "прямий захід"} />
        <Stat
          label="Пристрій"
          value={<span className="text-base">{last.device}</span>}
          hint={[last.browser, last.os, last.country].filter(Boolean).join(" · ")}
        />
      </div>

      {sessions.map((s) => (
        <Card
          key={s.id}
          title={`Візит #${s.visit} · ${fullOf(s.start)}`}
          hint={`${duration(s.seconds)} · ${s.pageviews} сторінок · глибина ${s.depth}% · ${s.source}`}
          action={
            <div className="flex items-center gap-2">
              {s.lead && <Pill tone="warm">заявка</Pill>}
              <Link href={`/admin/sessions/${s.id}`} className="text-xs text-brand hover:underline">
                окремо →
              </Link>
            </div>
          }
        >
          <details>
            <summary className="cursor-pointer text-sm text-ink-2 hover:text-ink">
              Показати кроки ({byId.get(s.id)?.length ?? 0})
            </summary>
            <div className="mt-3">
              <Timeline events={byId.get(s.id) ?? []} />
            </div>
          </details>
        </Card>
      ))}
    </div>
  );
}
