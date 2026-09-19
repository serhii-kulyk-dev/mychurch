/* Horizontal rails (role strips, view switchers) have to keep the active chip
   in sight on small screens. Element.scrollIntoView() cannot do that job: it
   walks *every* scrollable ancestor, so on a phone it drags the whole document
   down to the section — the page then "opens in the middle". These helpers
   move the rail and nothing else. */

/** Scroll `rail` (and only `rail`) so its nth child sits in the middle. */
export function centerInRail(rail: HTMLElement | null, index: number, smooth = true) {
  if (!rail) return;
  const item = rail.children[index] as HTMLElement | undefined;
  if (!item) return;
  const max = rail.scrollWidth - rail.clientWidth;
  if (max <= 1) return; // the rail is not scrolling — nothing to centre
  const offset = item.getBoundingClientRect().left - rail.getBoundingClientRect().left;
  const target = rail.scrollLeft + offset - (rail.clientWidth - item.offsetWidth) / 2;
  rail.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: smooth ? "smooth" : "auto" });
}
