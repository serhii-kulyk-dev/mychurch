import Link from "next/link";
import type { ReactNode } from "react";
import { percent } from "@/lib/analytics/format";

/* Дрібні цеглинки кабінету: картка, показник, смужка, таблиця.
   Свідомо без бібліотек — кабінет має важити нуль і виглядати
   як частина сайту, а не як чужа адмінка.                      */

export function Card({
  title,
  hint,
  action,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-hairline bg-surface ${className}`}>
      {(title || action) && (
        <header className="flex items-baseline justify-between gap-3 border-b border-hairline px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
            {hint && <p className="mt-0.5 text-xs text-ink-3">{hint}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface px-4 py-3">
      <div className="text-xs text-ink-3">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-3">{hint}</div>}
    </div>
  );
}

/** Горизонтальна смужка з підписом — для джерел, сторінок, блоків. */
export function BarRow({
  label,
  value,
  max,
  suffix,
  href,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  href?: string;
}) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  const text = (
    <span className="relative z-10 truncate pr-3" title={label}>
      {label}
    </span>
  );
  return (
    <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-2 py-1.5 text-sm">
      <span className="absolute inset-y-0 left-0 rounded-lg bg-brand-soft" style={{ width: `${width}%` }} aria-hidden />
      {href ? (
        <Link href={href} className="relative z-10 truncate pr-3 hover:text-brand">
          {label}
        </Link>
      ) : (
        text
      )}
      <span className="relative z-10 shrink-0 tabular-nums text-ink-2">
        {value.toLocaleString("uk-UA")}
        {suffix}
      </span>
    </div>
  );
}

export function BarList({ rows, empty = "Поки порожньо", href }: { rows: Array<{ name: string; count: number }>; empty?: string; href?: (name: string) => string }) {
  if (!rows.length) return <p className="text-sm text-ink-3">{empty}</p>;
  const max = rows[0]?.count ?? 1;
  return (
    <div className="space-y-0.5">
      {rows.map((row) => (
        <BarRow key={row.name} label={row.name || "—"} value={row.count} max={max} href={href?.(row.name)} />
      ))}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs text-ink-3">
            {head.map((cell) => (
              <th key={cell} className="border-b border-hairline pb-2 pr-4 font-medium last:pr-0">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Cell({ children, className = "", title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <td title={title} className={`border-b border-hairline py-2 pr-4 align-top text-ink-2 last:pr-0 ${className}`}>
      {children}
    </td>
  );
}

export function Pill({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "brand" | "warm" }) {
  const tones = {
    plain: "bg-surface-3 text-ink-2",
    brand: "bg-brand-soft text-brand-deep",
    warm: "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

/** Стовпчики по днях. Висота — від найбільшого дня періоду. */
export function DayChart({ data }: { data: Array<{ day: string; visitors: number; sessions: number; pageviews: number; leads: number }> }) {
  if (!data.length) return <p className="text-sm text-ink-3">Даних ще немає.</p>;
  const max = Math.max(...data.map((d) => d.sessions), 1);
  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d) => {
        const height = Math.max(3, (d.sessions / max) * 100);
        const share = percent(d.leads, d.sessions);
        return (
          <div key={d.day} className="group relative flex flex-1 flex-col items-center justify-end">
            <div
              className="w-full rounded-t-sm bg-brand/80 transition-colors group-hover:bg-brand"
              style={{ height: `${height}%` }}
            />
            {d.leads > 0 && <span className="absolute -top-1.5 size-1.5 rounded-full bg-amber-500" aria-hidden />}
            <span className="pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg border border-hairline bg-surface px-2 py-1 text-xs text-ink shadow-lg group-hover:block">
              {d.day}: {d.sessions} візитів · {d.visitors} людей · {d.pageviews} переглядів
              {d.leads > 0 && ` · ${d.leads} заявок (${share}%)`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
