import { TZ } from "./format";

/* Періоди звіту. Доба рахується київська, тому «сьогодні» о 01:00
   не перетворюється на вчора через UTC.                          */

export const RANGES = [
  { id: "today", label: "Сьогодні" },
  { id: "yesterday", label: "Учора" },
  { id: "7d", label: "7 днів" },
  { id: "30d", label: "30 днів" },
  { id: "90d", label: "90 днів" },
  { id: "all", label: "Увесь час" },
] as const;

export type RangeId = (typeof RANGES)[number]["id"];

const DAY = 24 * 60 * 60 * 1000;
/** Стеля для «увесь час»: далі назад дані все одно прибирає ретенція. */
const MAX_DAYS = 400;

/** Початок київської доби, у якій живе `ts`. */
function startOfDay(ts: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(ts);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hour = get("hour") % 24;
  return ts - (hour * 60 * 60 * 1000 + get("minute") * 60 * 1000 + get("second") * 1000);
}

export function resolveRange(input: string | undefined) {
  const id = (RANGES.find((r) => r.id === input)?.id ?? "7d") as RangeId;
  const now = Date.now();
  const today = startOfDay(now);

  switch (id) {
    case "today":
      return { id, from: today, to: now, label: "Сьогодні" };
    case "yesterday":
      return { id, from: today - DAY, to: today - 1, label: "Учора" };
    case "30d":
      return { id, from: today - 29 * DAY, to: now, label: "30 днів" };
    case "90d":
      return { id, from: today - 89 * DAY, to: now, label: "90 днів" };
    case "all":
      return { id, from: today - MAX_DAYS * DAY, to: now, label: "Увесь час" };
    default:
      return { id: "7d" as RangeId, from: today - 6 * DAY, to: now, label: "7 днів" };
  }
}
