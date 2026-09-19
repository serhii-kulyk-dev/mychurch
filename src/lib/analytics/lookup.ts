import { store } from "./store";
import { resolveRange } from "./range";
import type { StoredEvent } from "./types";

/* Пошук подій однієї людини або одного візиту.

   Спершу дивимось у вибраний період — це дешево. Якщо там порожньо
   (перейшли за старим посиланням), піднімаємо весь архів.          */

export async function findEvents(match: (e: StoredEvent) => boolean, rangeId = "30d") {
  const near = resolveRange(rangeId);
  const found = (await store.read(near.from, near.to)).filter(match);
  if (found.length) return found;

  const all = resolveRange("all");
  return (await store.read(all.from, all.to)).filter(match);
}
