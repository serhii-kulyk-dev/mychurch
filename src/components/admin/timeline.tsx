import { KEY_EVENTS, eventLabel } from "@/lib/analytics/events";
import { duration, timeOf } from "@/lib/analytics/format";
import type { StoredEvent } from "@/lib/analytics/types";

/* Стрічка кроків: усе, що людина робила, по порядку.
   Саме сюди дивляться, коли питають «а що воно тиснуло?». */

const PROP_LABELS: Record<string, string> = {
  label: "підпис",
  block: "блок",
  depth: "глибина",
  seconds: "секунд",
  href: "посилання",
  title: "заголовок",
  reason: "причина",
  visit: "візит №",
  order: "порядок",
  blocks: "блоків",
  query: "мітки",
  kind: "що саме",
  tz: "часовий пояс",
  viewport: "екран",
  ref: "звідки",
  field: "поле",
  step: "крок",
  source: "форма",
  error: "помилка",
  value: "значення",
};

function describe(event: StoredEvent) {
  const props = event.props ?? {};
  const parts: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (key === "label" || value === "" || value === undefined) continue;
    const label = PROP_LABELS[key] ?? key;
    if (key === "depth") parts.push(`${label}: ${value}%`);
    else if (key === "seconds") parts.push(duration(Number(value)));
    else parts.push(`${label}: ${value}`);
  }
  return parts;
}

export default function Timeline({ events, showPath = true }: { events: StoredEvent[]; showPath?: boolean }) {
  if (!events.length) return <p className="text-sm text-ink-3">Кроків немає.</p>;

  return (
    <ol className="relative space-y-0 border-l border-hairline pl-4">
      {events.map((event, i) => {
        const key = KEY_EVENTS.has(event.name);
        const title = String(event.props?.label ?? "");
        const gap = i > 0 ? Math.round((event.ts - events[i - 1].ts) / 1000) : 0;
        return (
          <li key={`${event.ts}-${i}`} className="relative py-1.5">
            <span
              className={`absolute -left-[21px] top-3 size-2 rounded-full ring-2 ring-surface ${key ? "bg-amber-500" : "bg-brand/60"}`}
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
              <span className="w-12 shrink-0 tabular-nums text-xs text-ink-3">{timeOf(event.ts)}</span>
              <span className={key ? "font-semibold text-ink" : "text-ink"}>{eventLabel(event.name)}</span>
              {title && <span className="text-ink-2">«{title}»</span>}
              {showPath && <span className="font-mono text-xs text-ink-3">{event.path}</span>}
              {gap >= 5 && <span className="text-xs text-ink-3">+{duration(gap)}</span>}
            </div>
            {describe(event).length > 0 && (
              <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 pl-14 text-xs text-ink-3">
                {describe(event).map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
