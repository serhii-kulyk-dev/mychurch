import Link from "next/link";
import { RANGES, type RangeId } from "@/lib/analytics/range";
import Refresh from "@/components/admin/refresh";

/* Перемикач періоду + вивантаження. Період живе в адресі,
   тому посилання на «30 днів» можна просто комусь кинути. */

export default function RangeBar({ range, path, showExport = true }: { range: RangeId; path: string; showExport?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1 rounded-xl border border-hairline bg-surface p-1">
        {RANGES.map((r) => (
          <Link
            key={r.id}
            href={`${path}?range=${r.id}`}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              r.id === range ? "bg-brand text-white" : "text-ink-2 hover:bg-surface-3"
            }`}
          >
            {r.label}
          </Link>
        ))}
      </div>
      <Refresh />
      {showExport && (
        <div className="ml-auto flex items-center gap-2 text-xs">
          <a
            href={`/api/admin/export?range=${range}&format=csv`}
            className="rounded-lg border border-hairline px-2.5 py-1.5 text-ink-2 transition-colors hover:bg-surface-3"
          >
            CSV
          </a>
          <a
            href={`/api/admin/export?range=${range}&format=json`}
            className="rounded-lg border border-hairline px-2.5 py-1.5 text-ink-2 transition-colors hover:bg-surface-3"
          >
            JSON
          </a>
        </div>
      )}
    </div>
  );
}
