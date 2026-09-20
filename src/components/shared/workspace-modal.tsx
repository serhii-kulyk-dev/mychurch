"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LayoutGrid, X } from "lucide-react";
import ModuleMock from "@/components/shared/module-mock";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { ROLE_ICONS, ROLE_ACCENTS } from "@/components/shared/role-icons";
import type { ModuleDetail, RoleId } from "@/content/modules/types";
import { hasModulePage } from "@/content/modules/ids";
import { ROLE_MODULES } from "@/content/role-modules";
import { useWorkspace } from "@/context/workspace-context";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/components/shared/use-focus-trap";

/* ────────────────────────────────────────────────────────────────
   "My space": the product itself, not a pitch. A sidebar of every
   module that has an authored screen, and that screen in the main
   pane — the same mocks the module pages use.

   Pick a role and the space narrows to what that role opens: the
   pastor gets the whole church, the visitor the two screens they
   ever touch. The choice is never remembered — it's a tour, so
   every open starts again as the whole church.
   ──────────────────────────────────────────────────────────────── */

export default function WorkspaceModal() {
  const t = useT();
  const { lang } = useLang();
  const copy = t.workspace;
  const { isOpen, moduleId, select, close } = useWorkspace();

  const [role, setRole] = useState<RoleId | null>(null);

  /* Тексти всіх сорока модулів двома мовами — це пів мегабайта, і вони
     потрібні лише тому, хто відкрив «Мій простір». Модалка живе в
     layout, тож без лінивого імпорту цей вантаж їхав би на кожну
     сторінку сайту. Вантажимо на першому відкритті. */
  const [catalog, setCatalog] = useState<ModuleDetail[] | null>(null);
  useEffect(() => {
    if (!isOpen || catalog) return;
    let alive = true;
    void import("@/content/modules").then((m) => {
      if (alive) setCatalog(m.MODULE_DETAILS);
    });
    return () => {
      alive = false;
    };
  }, [isOpen, catalog]);

  const windowRef = useRef<HTMLDivElement>(null);
  const scrollbarWidthRef = useRef(0);

  /* Фокус переходить у панель і повертається на кнопку, що її відкрила. */
  useFocusTrap(windowRef, isOpen);

  /* Only modules with an authored screen can be shown — and only the ones
     the chosen role actually works in. */
  const groups = useMemo(() => {
    const allowed = role ? new Set(ROLE_MODULES[role]) : null;
    return t.modules.groups
      .map((g) => ({ ...g, items: g.items.filter((i) => hasModulePage(i.id) && (!allowed || allowed.has(i.id))) }))
      .filter((g) => g.items.length > 0);
  }, [t, role]);

  /* The picked module if this role can open it, else the screen the role starts
     its day in — so switching roles never leaves the main pane on a screen the
     role has no access to, and never on an incidental one. */
  const flat = useMemo(() => groups.flatMap((g) => g.items.map((i) => ({ g, i }))), [groups]);
  const home = role ? ROLE_MODULES[role].find((id) => flat.some((x) => x.i.id === id)) : undefined;
  const found = flat.find((x) => x.i.id === moduleId) ?? flat.find((x) => x.i.id === home) ?? flat[0];
  const current = found?.i.id ?? null;
  const detail = current ? catalog?.find((m) => m.id === current) : undefined;

  /* What this module gives this role — authored per module, not generated. */
  const roleLine = role && detail ? detail.copy[lang].audience.find((a) => a.role === role)?.text : undefined;
  const RoleIcon = role ? ROLE_ICONS[role] : undefined;

  /* Leaving the space forgets the role: it's a tour, not a saved persona —
     the next visitor always starts on the whole church. */
  const dismiss = useCallback(() => {
    setRole(null);
    close();
  }, [close]);

  /* Escape closes. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, dismiss]);

  /* Body scroll lock, compensating for the scrollbar so nothing shifts. */
  useEffect(() => {
    if (isOpen) {
      scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflowY = "hidden";
      document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;
    } else {
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const onBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(e.target as Node)) dismiss();
    },
    [dismiss]
  );

  const accent = found ? moduleAccent(found.i.id, found.g.id) : "#007aff";
  const Icon = current ? MODULE_ICONS[current] ?? LayoutGrid : LayoutGrid;

  return (
    <div
      aria-hidden={!isOpen}
      onClick={onBackdrop}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45",
        "transition-[opacity,visibility] duration-200",
        isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      )}
    >
      <div
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        style={{ willChange: "opacity, transform" }}
        className={cn(
          "relative w-full max-w-[1080px] h-[min(90dvh,760px)] rounded-[20px] bg-surface border border-hairline-strong overflow-hidden flex flex-col",
          "shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-200",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Window chrome */}
        <div className="h-11 shrink-0 bg-surface-2 border-b border-hairline flex items-center px-4 gap-3">
          <div className="hidden sm:flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-6 min-w-[200px] rounded-md bg-surface-3 flex items-center justify-center gap-2 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12a150]" />
              <span className="text-[11.5px] text-ink-3 leading-none">{copy.url}</span>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label={copy.close}
            className="w-9 h-9 sm:w-8 sm:h-8 -mr-1 sm:mr-0 flex items-center justify-center rounded-full text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* What the space holds — the promise and the count, over the product itself */}
        <div className="shrink-0 border-b border-hairline bg-surface px-4 md:px-5 py-2.5 flex items-center justify-between gap-5">
          <h2 className="text-[13.5px] md:text-[15.5px] font-semibold text-ink leading-[1.3] tracking-[-0.3px]">{copy.headline}</h2>
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 text-[12.5px] text-ink-3">
            {copy.stats.map((s, i) => (
              <span key={s.label} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="w-1 h-1 rounded-full bg-hairline-strong" />}
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-semibold text-ink tabular-nums leading-none tracking-[-0.2px]">{s.value}</span>
                  {s.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Who is looking: the space narrows to that role's modules */}
        <div className="shrink-0 border-b border-hairline bg-surface-2 flex items-center gap-2.5 px-3 md:px-4 py-2">
          <span className="hidden md:block shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{copy.viewAs}</span>
          <div className="relative min-w-0 flex-1">
            <div
              role="tablist"
              aria-label={copy.viewAs}
              className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                type="button"
                role="tab"
                aria-selected={role === null}
                onClick={() => setRole(null)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-medium leading-none whitespace-nowrap transition-colors duration-150",
                  role === null
                    ? "border-hairline-strong bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    : "border-transparent text-ink-3 hover:bg-surface hover:text-ink"
                )}
              >
                {copy.allRoles}
              </button>
              {t.audience.roles.map((r) => {
                const ChipIcon = ROLE_ICONS[r.id];
                const a = ROLE_ACCENTS[r.id];
                const on = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setRole(r.id as RoleId)}
                    className={cn(
                      "shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12.5px] font-medium leading-none whitespace-nowrap transition-colors duration-150",
                      on ? "shadow-[0_1px_2px_rgba(0,0,0,0.04)]" : "border-transparent text-ink-3 hover:bg-surface hover:text-ink"
                    )}
                    style={on ? { background: `color-mix(in oklab, ${a} 12%, var(--surface))`, borderColor: `color-mix(in oklab, ${a} 40%, transparent)`, color: a } : undefined}
                  >
                    <ChipIcon className="w-[14px] h-[14px] shrink-0" strokeWidth={2.2} style={{ color: on ? a : undefined }} />
                    {r.short}
                  </button>
                );
              })}
            </div>
            {/* The strip scrolls on narrow windows — show that it continues */}
            <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--surface-2)] to-transparent" />
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          {/* Sidebar: the modules this role opens */}
          <aside className="shrink-0 md:w-[228px] md:h-full md:overflow-y-auto border-b md:border-b-0 md:border-r border-hairline bg-surface-2">
            <div className="flex md:flex-col gap-1 md:gap-3 p-2 md:p-3 overflow-x-auto md:overflow-x-visible">
              {groups.map((g) => (
                <div key={g.id} className="flex md:flex-col gap-1 shrink-0">
                  <span className="hidden md:block px-2 pt-1 pb-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                    {g.title}
                  </span>
                  {g.items.map((item) => {
                    const ItemIcon = MODULE_ICONS[item.id] ?? LayoutGrid;
                    const c = moduleAccent(item.id, g.id);
                    const on = item.id === current;
                    return (
                      <button
                        key={item.id}
                        onClick={() => select(item.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-left whitespace-nowrap transition-colors duration-150",
                          on ? "bg-surface text-ink font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "text-ink-2 hover:bg-surface hover:text-ink"
                        )}
                      >
                        <ItemIcon className="w-[15px] h-[15px] shrink-0" strokeWidth={2} style={{ color: on ? c : undefined }} />
                        <span className="text-[13px] leading-none truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>

          {/* Main: the module's own screen */}
          <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
            {detail && found && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-hairline shrink-0"
                      style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: accent }}>
                        {found.g.title}
                      </span>
                      <span className="font-semibold text-ink text-[18px] leading-none tracking-[-0.3px] truncate">{found.i.name}</span>
                    </div>
                  </div>
                  <Link
                    href={`/modules/${current}`}
                    onClick={dismiss}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-2 text-[13px] font-medium text-ink-2 hover:text-ink hover:border-hairline-strong transition-colors"
                  >
                    {copy.more}
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                  </Link>
                </div>

                {roleLine && role && RoleIcon && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ background: ROLE_ACCENTS[role] }}
                    >
                      <RoleIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </span>
                    <p className="text-[13px] text-ink-2 leading-[1.45]">{roleLine}</p>
                  </div>
                )}

                <div key={current} className="flex-1 flex items-center justify-center py-2">
                  <ModuleMock spec={detail.copy[lang].mock} accent={accent} Icon={Icon} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {detail.copy[lang].highlights.map((h) => (
                    <span key={h} className="rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-[12px] text-ink-2 leading-none">
                      {h}
                    </span>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
