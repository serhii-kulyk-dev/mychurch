"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LayoutGrid, Search, X } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { MODULE_ICONS, GROUP_ICONS, GROUP_ACCENTS, moduleAccent } from "@/components/shared/module-icons";
import { hasModulePage } from "@/content/modules/ids";
import { useT } from "@/lib/lang";
import { centerInRail } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Каталог модулів. Тридцять дев'ять модулів у дев'яти групах ніхто не читає
   підряд — їх переглядають і шукають. Тому не стіна однакових
   карток, а довідник: рейка груп ліворуч (на телефоні — стрічка
   чипів під шапкою), пошук, і щільні рядки праворуч — назва плюс
   один рядок пояснення.

   Усі групи лишаються в DOM навіть під час пошуку-фільтра: на них
   ведуть глибокі посилання /modules#m-<group> з карти й зі сторінок
   модулів, а <AnchorGuard /> потім чистить адресу.
   ──────────────────────────────────────────────────────────────── */

/* Картка-рядок: посилання, якщо в модуля є своя сторінка, інакше просто блок. */
function Row({ href, className, children }: { href: string | null; className: string; children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <article className={className}>{children}</article>;
}

const norm = (s: string) => s.toLowerCase().replace(/[’'`]/g, "'");

export default function ModulesGrid() {
  const t = useT().modules;
  const c = t.catalog;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(t.groups[0]?.id ?? "");
  const railRef = useRef<HTMLDivElement>(null);

  const q = norm(query.trim());

  /* Пошук лишає групи на місці, але ховає рядки, що не збіглися. */
  const groups = useMemo(
    () =>
      t.groups.map((group) => ({
        ...group,
        matches: q ? group.items.filter((i) => norm(i.name).includes(q) || norm(i.text).includes(q)) : group.items,
      })),
    [t.groups, q]
  );

  const total = useMemo(() => t.groups.reduce((n, g) => n + g.items.length, 0), [t.groups]);
  const found = useMemo(() => groups.reduce((n, g) => n + g.matches.length, 0), [groups]);
  const visible = useMemo(() => groups.filter((g) => g.matches.length > 0), [groups]);

  /* Яка група зараз перед очима — підсвічуємо її в рейці. Рахуємо самі, а не
     через IntersectionObserver: після переходу за глибоким посиланням
     /modules#m-team сторінка стрибає ще до того, як спостерігач отримає
     перший кадр, і рейка лишалась би на першій групі. */
  useEffect(() => {
    let frame = 0;

    const pick = () => {
      frame = 0;
      /* Межа читання — одразу під шапкою: група, чий заголовок останнім її
         перетнув, і є та, яку зараз читають. */
      const line = 160;
      let best: string | null = null;
      for (const g of t.groups) {
        const el = document.getElementById(`m-${g.id}`);
        if (!el || el.offsetParent === null) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= line && bottom > line) best = g.id;
        else if (top > line && best === null) {
          best = g.id;
          break;
        }
      }
      if (best) setActive(best);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [t.groups]);

  /* Активний чип тримаємо в полі зору стрічки — і тільки стрічки. */
  useEffect(() => {
    const i = visible.findIndex((g) => g.id === active);
    if (i >= 0) centerInRail(railRef.current, i);
  }, [active, visible]);

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(`m-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full flex flex-col items-center py-12 md:py-16">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        {/* ── Шапка каталогу: що це і скільки його ── */}
        <FadeIn className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-2.5 max-w-[620px]">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{c.eyebrow}</span>
            <h2 className="font-semibold text-ink text-[28px] md:text-[38px] leading-[1.12] tracking-[-0.9px] md:tracking-[-1.3px]">
              {c.title}
            </h2>
            <p className="text-[15px] text-ink-3 tabular-nums">
              {c.count.replace("{n}", String(total)).replace("{g}", String(t.groups.length))}
            </p>
          </div>

          {/* ── Пошук ── */}
          <label className="relative flex items-center w-full md:w-[290px] shrink-0">
            <Search className="absolute left-3.5 w-[17px] h-[17px] text-ink-3 pointer-events-none" strokeWidth={2} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={c.search}
              aria-label={c.search}
              className="w-full h-11 rounded-full bg-surface border border-hairline pl-10 pr-10 text-[15px] text-ink placeholder:text-ink-3 outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand/50 focus:shadow-[0_0_0_3px_var(--brand-soft)] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={c.clear}
                className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2.2} />
              </button>
            )}
          </label>
        </FadeIn>

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
          {/* ── Рейка груп: колонка на десктопі ── */}
          <nav
            aria-label={c.eyebrow}
            className="hidden lg:flex lg:sticky lg:top-24 w-[212px] shrink-0 flex-col gap-0.5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1"
          >
            {groups.map((group) => {
              const Icon = GROUP_ICONS[group.id] ?? LayoutGrid;
              const accent = GROUP_ACCENTS[group.id] ?? "#007aff";
              const on = active === group.id;
              const muted = group.matches.length === 0;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => jump(group.id)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "group/nav flex items-center gap-2.5 h-10 px-2.5 rounded-xl text-left transition-colors duration-200",
                    on ? "bg-surface-2 text-ink" : "text-ink-2 hover:bg-surface-2/60 hover:text-ink",
                    muted && "opacity-40"
                  )}
                >
                  <Icon className="w-[17px] h-[17px] shrink-0" strokeWidth={2} style={{ color: accent }} />
                  <span className="text-[14px] font-medium leading-none truncate flex-1">{group.title}</span>
                  <span className="text-[12px] text-ink-3 tabular-nums leading-none">{group.matches.length}</span>
                </button>
              );
            })}
          </nav>

          {/* ── Стрічка чипів: телефон і планшет ── */}
          <div className="lg:hidden sticky top-16 md:top-20 z-30 -mx-5 md:-mx-8 px-5 md:px-8 py-2.5 bg-page/88 backdrop-blur-xl border-b border-hairline">
            <div ref={railRef} className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              {visible.map((group) => {
                const Icon = GROUP_ICONS[group.id] ?? LayoutGrid;
                const accent = GROUP_ACCENTS[group.id] ?? "#007aff";
                const on = active === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => jump(group.id)}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full border text-[13.5px] font-medium leading-none transition-colors duration-200",
                      on ? "border-brand/45 bg-brand-soft text-ink" : "border-hairline bg-surface text-ink-2"
                    )}
                  >
                    <Icon className="w-[15px] h-[15px]" strokeWidth={2.1} style={{ color: accent }} />
                    {group.title}
                    <span className="text-[11.5px] text-ink-3 tabular-nums">{group.matches.length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Самі модулі ── */}
          <div className="min-w-0 flex-1 flex flex-col gap-9 md:gap-11 pt-6 lg:pt-0">
            {q && (
              <p className="text-[14px] text-ink-3 tabular-nums" role="status" aria-live="polite">
                {found > 0 ? c.found.replace("{n}", String(found)) : c.empty}
              </p>
            )}

            {groups.map((group) => {
              const GroupIcon = GROUP_ICONS[group.id] ?? LayoutGrid;
              const accent = GROUP_ACCENTS[group.id] ?? "#007aff";
              const hidden = group.matches.length === 0;
              return (
                <div
                  key={group.id}
                  id={`m-${group.id}`}
                  className={cn("scroll-mt-32 flex flex-col gap-3", hidden && "hidden")}
                >
                  {/* Заголовок групи — знак, назва, лічильник, і волосяна лінія
                      під ними: групи мають читатись як розділи довідника. */}
                  <FadeIn className="flex items-baseline gap-2.5 min-w-0 border-b border-hairline pb-3">
                    <span
                      className="self-center shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center"
                      style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                    >
                      <GroupIcon className="w-[17px] h-[17px]" strokeWidth={2} />
                    </span>
                    <h3 className="shrink-0 font-semibold text-ink text-[19px] md:text-[21px] leading-[1.2] tracking-[-0.4px]">
                      {group.title}
                    </h3>
                    <span className="self-center shrink-0 rounded-full bg-surface-3 border border-hairline px-2 py-0.5 text-[11.5px] font-medium text-ink-3 tabular-nums leading-none">
                      {group.matches.length}
                    </span>
                  </FadeIn>

                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                    {group.matches.map((item) => {
                      const Icon = MODULE_ICONS[item.id] ?? LayoutGrid;
                      const tone = moduleAccent(item.id, group.id);
                      const href = hasModulePage(item.id) ? `/modules/${item.id}` : null;
                      return (
                        <Row
                          key={item.id}
                          href={href}
                          className={cn(
                            "group/row relative flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-xl bg-surface border border-hairline pl-2 pr-3 py-2 transition-[border-color,background-color] duration-200",
                            href && "hover:border-hairline-strong hover:bg-surface-2/60"
                          )}
                        >
                          <span
                            className="shrink-0 w-7 h-7 rounded-[9px] flex items-center justify-center"
                            style={{ background: `color-mix(in oklab, ${tone} 12%, var(--surface))`, color: tone }}
                          >
                            <Icon className="w-[15px] h-[15px]" strokeWidth={2.1} />
                          </span>
                          {/* Назва переноситься тільки між словами: «Організатор подій» не ріжеться навпіл. */}
                          <span className="min-w-0 flex-1 font-medium text-ink text-[13.5px] sm:text-[14.5px] leading-[1.25] tracking-[-0.1px] [overflow-wrap:normal]">
                            {item.name}
                          </span>
                          {/* «Скоро»: у вузькій комірці — окремим рядком під назвою, у широкій — пілюлею поруч. */}
                          {item.soon && (
                            <span className="shrink-0 basis-full lg:basis-auto text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-3 leading-none lg:rounded-full lg:border lg:border-dashed lg:border-hairline-strong lg:px-1.5 lg:py-0.5">
                              {t.soon}
                            </span>
                          )}
                          {href && (
                            <ArrowUpRight
                              /* Стрілка — підказка для миші: на дотик вона лише з'їдала б місце під назву. */
                              className="hidden lg:block shrink-0 w-[14px] h-[14px] text-ink-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/row:opacity-100 group-hover/row:translate-x-0"
                              strokeWidth={2.2}
                            />
                          )}
                          {/* Опис нікуди не дівся — він лишається в розмітці й спливає
                             під рядком на наведення, щоб каталог читався назвами. */}
                          <span className="hidden lg:block pointer-events-none absolute left-0 top-[calc(100%+6px)] z-20 w-[290px] max-w-[92vw] rounded-xl border border-hairline bg-surface px-3 py-2.5 text-[13px] leading-[1.45] text-ink-2 shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)] opacity-0 translate-y-1 transition-[opacity,transform] duration-150 group-hover/row:opacity-100 group-hover/row:translate-y-0">
                            {item.text}
                          </span>
                        </Row>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {found === 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="self-start rounded-full border border-hairline bg-surface px-4 h-10 text-[14px] font-medium text-ink hover:border-hairline-strong transition-colors"
              >
                {c.clear}
              </button>
            )}

            {/* Перенесення бази — не окремий розділ сайту, а вхід у модулі:
                рядок стоїть під каталогом, а не третім реченням у шапці. */}
            {!q && (
              <FadeIn className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-hairline pt-6 text-[15px] text-ink-3">
                {t.importLink.text}
                <Link
                  href="/import"
                  className="inline-flex items-center gap-1 font-medium text-brand hover:underline underline-offset-4"
                >
                  {t.importLink.cta}
                  <ArrowUpRight className="w-[15px] h-[15px]" strokeWidth={2} />
                </Link>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
