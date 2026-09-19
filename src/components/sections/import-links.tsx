"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Table2 } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { IMPORT_COPY } from "@/content/import";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Той самий приклад, що в модулі «Сім'я»: Ковальчуки. Зліва — п'ять
   безіменних рядків таблиці, справа — родина, яку система з них
   зібрала. Під ними — підстави, з яких вона це зробила.
   ──────────────────────────────────────────────────────────────── */

const AVATAR = ["#5b8af0", "#f07b5b", "#8b5bf0", "#12a150", "#f0c45b"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export default function ImportLinks() {
  const { lang } = useLang();
  const c = IMPORT_COPY[lang].links;

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
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page border-b border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />

        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,1fr)] gap-6 lg:gap-5 items-center",
            on && "mock-on"
          )}
        >
          {/* Сирі рядки файлу */}
          <FadeIn className="min-w-0">
            <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
              <div className="flex items-center gap-2 px-4 h-11 bg-surface-2 border-b border-hairline">
                <Table2 className="w-[15px] h-[15px] text-ink-3 shrink-0" strokeWidth={1.9} />
                <span className="text-[12.5px] font-semibold text-ink leading-none">{c.rawLabel}</span>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead>
                    <tr>
                      {c.rawHead.map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 px-3 py-2 border-b border-hairline whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.rows.map((row, i) => (
                      <tr key={i} className="mock-row" style={{ animationDelay: `${200 + i * 110}ms` }}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "px-3 py-3 border-b border-hairline text-[12.5px] leading-[1.3] whitespace-nowrap",
                              ci === 0 ? "font-medium text-ink" : "text-ink-2"
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          {/* Стрілка переходу */}
          <div className="flex lg:flex-col items-center justify-center gap-2 py-1">
            <span className="w-10 h-10 rounded-full bg-surface border border-hairline-strong flex items-center justify-center text-brand shadow-[0_8px_20px_-14px_rgba(0,0,0,0.4)]">
              <ArrowRight className="w-[18px] h-[18px] rotate-90 lg:rotate-0" strokeWidth={2.1} />
            </span>
          </div>

          {/* Родина, зібрана системою */}
          <FadeIn variant="scale" delay={1} className="min-w-0">
            <div className="rounded-2xl border border-hairline bg-surface overflow-hidden shadow-[0_30px_60px_-45px_rgba(0,50,120,0.5)]">
              <div className="flex items-center gap-3 px-4 py-3 bg-surface-2 border-b border-hairline">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: "#ec4899" }}>
                  <Heart className="w-4 h-4" strokeWidth={2.2} />
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-ink leading-none truncate">{c.family.title}</span>
                  <span className="text-[11.5px] text-ink-3 leading-none mt-1.5 truncate">{c.family.sub}</span>
                </div>
              </div>
              <div className="p-2 flex flex-col">
                {c.family.members.map((m, i) => (
                  <div
                    key={m.name}
                    className="mock-row flex items-center gap-3 rounded-xl px-2.5 py-2.5 border-b border-hairline last:border-b-0"
                    style={{ animationDelay: `${520 + i * 110}ms` }}
                  >
                    <span
                      className="w-8 h-8 rounded-full text-white text-[12px] font-semibold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: AVATAR[i % AVATAR.length] }}
                    >
                      {initials(m.name)}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                      <span className="text-[13.5px] font-medium text-ink leading-none truncate">{m.name}</span>
                      <span className="text-[11.5px] text-ink-3 leading-none truncate">{m.sub}</span>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0 bg-brand-soft text-brand">
                      {m.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Підстави */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
          {c.evidence.map((e, i) => (
            <FadeIn key={e.title} delay={i} className="flex gap-4">
              <span className="text-[12px] font-semibold text-brand tabular-nums tracking-[0.1em] pt-1 shrink-0">
                0{i + 1}
              </span>
              <div className="flex flex-col gap-1.5 min-w-0">
                <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.3px]">{e.title}</h3>
                <p className="text-[15px] text-ink-2 leading-[1.55]">{e.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={2}>
          <p className="text-[14.5px] text-ink-3 leading-[1.55] max-w-[760px] pl-4 border-l-2 border-brand/40">{c.note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
