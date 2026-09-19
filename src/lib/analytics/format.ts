/* Формат дат і чисел для кабінету. Час — завжди київський:
   звіт читають із Черкас, а сервер може стояти будь-де. */

export const TZ = process.env.ANALYTICS_TZ ?? "Europe/Kyiv";

const dayFmt = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("uk-UA", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const fullFmt = new Intl.DateTimeFormat("uk-UA", { timeZone: TZ, day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat("uk-UA", { timeZone: TZ, day: "2-digit", month: "short" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false });

/** YYYY-MM-DD у київському часі — ключ для групування по добах. */
export const localDay = (ts: number) => dayFmt.format(ts);
export const localHour = (ts: number) => Number(hourFmt.format(ts));
export const timeOf = (ts: number) => timeFmt.format(ts);
export const fullOf = (ts: number) => fullFmt.format(ts);
export const dateOf = (ts: number) => dateFmt.format(ts);

export function duration(seconds: number) {
  if (!seconds || seconds < 1) return "0 с";
  if (seconds < 60) return `${Math.round(seconds)} с`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return s ? `${m} хв ${s} с` : `${m} хв`;
  const h = Math.floor(m / 60);
  return `${h} год ${m % 60} хв`;
}

export function ago(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "щойно";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} хв тому`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} год тому`;
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) return "учора";
  if (days < 7) return `${days} дн тому`;
  return dateOf(ts);
}

export function percent(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

/** Короткий підпис відвідувача: «a4f2·91c7» читається краще за 16 символів поспіль. */
export function shortId(id: string) {
  return id.length > 8 ? `${id.slice(0, 4)}·${id.slice(4, 8)}` : id;
}

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
