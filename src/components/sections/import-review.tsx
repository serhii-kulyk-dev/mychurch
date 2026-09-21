"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Layers, RotateCcw, ShieldCheck, History } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { IMPORT_COPY } from "@/content/import";
import { LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Екран чернетки: цифри, спірні місця і дві кнопки. Поки не натиснуто
   «Імпортувати» — у базі церкви нічого немає. */

const TONE: Record<"amber" | "brand" | "red", string> = {
  amber: "#f59e0b",
  brand: "var(--brand)",
  red: "#f43f5e",
};

const SAFETY_ICONS: LucideIcon[] = [RotateCcw, History, ShieldCheck];

export default function ImportReview() {
  const { lang } = useLang();
  const c = IMPORT_COPY[lang].review;

  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-b border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
          {/* Чернетка імпорту */}
          <FadeIn className="min-w-0">
            <div
              ref={ref}
              className={cn(
                "rounded-[22px] border border-hairline bg-surface overflow-hidden shadow-[0_40px_80px_-55px_rgba(0,50,120,0.55)]",
                on && "mock-on"
              )}
            >
              <div className="flex items-center gap-3 px-4 py-3.5 bg-surface-2 border-b border-hairline">
                <span className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" strokeWidth={2.2} />
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-ink leading-none truncate">{c.screen.title}</span>
                  <span className="text-[12px] text-ink-3 leading-none mt-1.5 truncate">{c.screen.sub}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-hairline">
                {c.screen.kpis.map((k, i) => (
                  <div
                    key={k.label}
                    className={cn(
                      "mock-row flex flex-col gap-1.5 px-4 py-4 border-hairline",
                      /* дві колонки на телефоні, чотири від sm — межі рахуємо під обидві сітки */
                      i % 2 === 0 && "border-r",
                      i % 2 === 1 && i !== c.screen.kpis.length - 1 && "sm:border-r",
                      i < 2 && "border-b sm:border-b-0"
                    )}
                    style={{ animationDelay: `${180 + i * 90}ms` }}
                  >
                    <span className="text-[24px] font-semibold text-ink leading-none tracking-[-0.7px] tabular-nums">
                      {k.value}
                    </span>
                    <span className="text-[12px] text-ink-3 leading-none">{k.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                {c.screen.issues.map((it, i) => (
                  <div
                    key={it.title}
                    className="mock-row flex items-start gap-3 px-4 py-4 border-b border-hairline"
                    style={{ animationDelay: `${520 + i * 120}ms` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full mt-[7px] shrink-0"
                      style={{ background: TONE[it.tone] }}
                    />
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <span className="text-[14px] font-semibold text-ink leading-none">{it.title}</span>
                      <span className="text-[13px] text-ink-2 leading-[1.5]">{it.text}</span>
                    </div>
                    <span className="text-[12.5px] font-medium text-brand leading-none shrink-0 pt-0.5 hidden sm:inline">
                      {it.action}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 px-4 py-4 bg-surface-2">
                <span className="btn-primary btn-brand flex items-center justify-center h-11 px-5 rounded-full">
                  <span className="text-white font-semibold text-[14px] tracking-[-0.2px] leading-none whitespace-nowrap">
                    {c.screen.primary}
                  </span>
                </span>
                <span className="flex items-center justify-center h-11 px-5 rounded-full border border-hairline-strong bg-surface">
                  <span className="text-ink-2 font-medium text-[14px] tracking-[-0.2px] leading-none whitespace-nowrap">
                    {c.screen.secondary}
                  </span>
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Що охороняє базу + слово церкви, яка це вже пройшла */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col">
              {c.safety.map((s, i) => {
                const Icon = SAFETY_ICONS[i] ?? ShieldCheck;
                return (
                  <FadeIn
                    key={s.title}
                    delay={i}
                    className="flex gap-3.5 py-5 border-b border-hairline first:pt-0 last:border-b-0"
                  >
                    <span className="w-9 h-9 rounded-full bg-surface-3 text-ink-2 flex items-center justify-center shrink-0">
                      <Icon className="w-[16px] h-[16px]" strokeWidth={2} />
                    </span>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h3 className="font-semibold text-ink text-[16.5px] leading-[1.3] tracking-[-0.3px]">{s.title}</h3>
                      <p className="text-[14.5px] text-ink-2 leading-[1.55]">{s.text}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            <FadeIn delay={2} className="flex flex-col gap-3 pl-4 border-l-2 border-brand/40">
              {/* Це наш опис випадку, а не слова церкви: лапки прибрані
                  2026-09-21, бо цитати за церкву ми не пишемо. */}
              <p className="text-[16px] text-ink leading-[1.5] tracking-[-0.2px]">{c.quote.text}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[13px] text-ink-3 leading-none">{c.quote.author}</span>
                <Link
                  href={LEAD_AMBASSADOR_HREF}
                  className="link-underline inline-flex items-center gap-1 text-[13px] font-medium text-brand leading-none"
                >
                  {c.quote.link}
                  <ArrowRight className="w-[13px] h-[13px]" strokeWidth={2.2} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
