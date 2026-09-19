"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { MODULE_ICONS, GROUP_ICONS, GROUP_ACCENTS, moduleAccent } from "@/components/shared/module-icons";
import { hasModulePage } from "@/content/modules";
import { useT } from "@/lib/lang";

/* Icons and accents live in module-icons.ts (shared with the module pages); copy lives in the dictionary.
   The group header wears the group accent; every card wears its own module colour. */
/* A card is a link when the module has its own page, a plain article otherwise. */
function Card({ href, className, style, children }: { href: string | null; className: string; style?: React.CSSProperties; children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <article className={className} style={style}>
      {children}
    </article>
  );
}

export default function ModulesGrid() {
  const t = useT().modules;

  return (
    <section className="w-full flex flex-col items-center py-12 md:py-16">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-14 md:gap-20">
        {t.groups.map((group) => {
          const GroupIcon = GROUP_ICONS[group.id] ?? LayoutGrid;
          const accent = GROUP_ACCENTS[group.id] ?? "#007aff";
          return (
            <div key={group.id} id={`m-${group.id}`} className="scroll-mt-28 flex flex-col gap-6 md:gap-8">
              <FadeIn className="flex items-start gap-4">
                <span
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-hairline"
                  style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                >
                  <GroupIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                </span>
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-semibold text-ink text-[24px] md:text-[30px] leading-[1.15] tracking-[-0.7px]">{group.title}</h2>
                    <span className="rounded-full bg-surface-3 border border-hairline px-2 py-0.5 text-[12px] font-medium text-ink-3 tabular-nums leading-none">
                      {group.items.length}
                    </span>
                  </div>
                  <p className="text-[15.5px] text-ink-2 leading-[1.5] max-w-[620px]">{group.text}</p>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {group.items.map((item, i) => {
                  const Icon = MODULE_ICONS[item.id] ?? LayoutGrid;
                  const tone = moduleAccent(item.id, group.id);
                  const href = hasModulePage(item.id) ? `/modules/${item.id}` : null;
                  const wide = group.items.length === 1;
                  return (
                    <FadeIn key={item.id} delay={i % 3} variant="scale" className={wide ? "h-full sm:col-span-2 lg:col-span-3" : "h-full"}>
                      <Card
                        href={href}
                        className={[
                          "hover-lift group relative h-full rounded-[20px] bg-surface border border-hairline p-6 flex gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                          wide ? "flex-col sm:flex-row sm:items-center sm:gap-6 md:p-8" : "flex-col",
                        ].join(" ")}
                        style={wide ? { background: `linear-gradient(120deg, color-mix(in oklab, ${tone} 8%, var(--surface)), var(--surface) 60%)` } : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={[
                              "rounded-xl flex items-center justify-center transition-colors duration-300 shrink-0",
                              wide ? "w-14 h-14 rounded-2xl" : "w-11 h-11",
                            ].join(" ")}
                            style={{ background: `color-mix(in oklab, ${tone} 12%, var(--surface))`, color: tone }}
                          >
                            <Icon className={wide ? "w-[26px] h-[26px]" : "w-[20px] h-[20px]"} strokeWidth={2} />
                          </span>
                          {item.soon && (
                            <span className={["rounded-full border border-dashed border-hairline-strong px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none", href ? "mr-7" : ""].join(" ")}>
                              {t.soon}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <h3 className={["font-semibold text-ink leading-[1.3] tracking-[-0.2px]", wide ? "text-[19px] md:text-[21px]" : "text-[17px]"].join(" ")}>{item.name}</h3>
                          <p className={["text-ink-2 leading-[1.5]", wide ? "text-[15.5px] max-w-[720px]" : "text-[14.5px]"].join(" ")}>{item.text}</p>
                        </div>
                        {href && (
                          <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-ink-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                        )}
                      </Card>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
