import Link from "next/link";
import { notFound } from "next/navigation";
import { findEvents } from "@/lib/analytics/lookup";
import { buildSessions } from "@/lib/analytics/report";
import { duration, fullOf, shortId } from "@/lib/analytics/format";
import Timeline from "@/components/admin/timeline";
import { Card, Pill, Stat } from "@/components/admin/ui";

/* Один візит — усі кроки по порядку. */

export const dynamic = "force-dynamic";

export default async function AdminSession({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { id } = await params;
  const { range } = await searchParams;
  const events = await findEvents((e) => e.session === id, range);
  if (!events.length) notFound();

  const session = buildSessions(events).get(id);
  if (!session) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Візит #{session.visit}</h1>
          <p className="text-sm text-ink-3">
            {fullOf(session.start)} · людина{" "}
            <Link href={`/admin/people/${session.visitor}`} className="font-mono text-ink-2 hover:text-brand">
              {shortId(session.visitor)}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {session.lead && <Pill tone="warm">залишив заявку</Pill>}
          <Link href="/admin/sessions" className="text-sm text-brand hover:underline">
            ← до списку
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Тривалість" value={duration(session.seconds)} />
        <Stat label="Сторінок" value={session.pageviews} hint={`${session.pages.length} унікальних`} />
        <Stat label="Глибина" value={`${session.depth}%`} hint={`${session.blocks} блоків`} />
        <Stat label="Джерело" value={<span className="text-base">{session.source}</span>} hint={session.ref || session.campaign || "прямий захід"} />
        <Stat label="Пристрій" value={<span className="text-base">{session.device}</span>} hint={[session.browser, session.os].filter(Boolean).join(" · ")} />
        <Stat
          label="Де"
          value={<span className="text-base">{session.country ?? "—"}</span>}
          hint={[session.city, session.lang && `мова: ${session.lang}`].filter(Boolean).join(" · ")}
        />
      </div>

      <Card title="Кроки" hint={`${events.length} подій · вхід ${session.entry} · вихід ${session.exit}`}>
        <Timeline events={events} />
      </Card>
    </div>
  );
}
