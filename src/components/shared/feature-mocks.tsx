"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { User, Users, Check } from "lucide-react";
import { useT } from "@/lib/lang";

/* Each mock starts its own animations when scrolled into view (same `mock-on`
   convention as the hero dashboard). */
function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

function Frame({ children, on, className = "", maxW = "max-w-[420px]" }: { children: ReactNode; on: boolean; className?: string; maxW?: string }) {
  return (
    <div className={["relative w-full", maxW, on ? "mock-on" : "", className].join(" ")}>{children}</div>
  );
}

/* ── Groups: list with a highlighted handover ────────────────── */
const GROUP_COLORS = ["#f07b5b", "#007aff", "#f0c45b", "#f05b8b"];
export function GroupsMock() {
  const t = useT().features.mocks.groups;
  const { ref, on } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="w-full flex justify-center">
      <Frame on={on} className="pb-10">
        <div className="mock-pop rounded-[20px] bg-surface border border-hairline shadow-[0_30px_60px_-30px_rgba(0,50,120,0.35)] p-3 flex flex-col gap-1.5" style={{ animationDelay: "60ms" }}>
          <span className="px-2 pt-1 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.title}</span>
          {t.items.map((g, i) => {
            const active = i === 1;
            return (
              <div
                key={g.name}
                className={["mock-row flex items-center gap-3 rounded-xl px-3 py-2.5 border", active ? "bg-brand-soft border-brand/30" : "border-transparent"].join(" ")}
                style={{ animationDelay: `${250 + i * 120}ms` }}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${GROUP_COLORS[i]} 16%, var(--surface))`, color: GROUP_COLORS[i] }}>
                  <Users className="w-4 h-4" strokeWidth={2.2} />
                </span>
                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                  <span className="text-[13.5px] font-medium text-ink leading-none truncate">{g.name}</span>
                  <span className="text-[11.5px] text-ink-3 leading-none">{g.meta}</span>
                </div>
                <span className="flex items-center gap-1 text-[12px] text-ink-2 tabular-nums shrink-0"><User className="w-3.5 h-3.5 text-ink-3" />{g.count}</span>
              </div>
            );
          })}
        </div>
        <div className="mock-pop absolute -bottom-3 left-4 right-4 sm:left-auto sm:right-[-8px] sm:w-[260px] rounded-[14px] bg-surface border border-hairline shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)] px-3.5 py-3 flex items-center gap-3" style={{ animationDelay: "1000ms" }}>
          <span className="w-8 h-8 rounded-full bg-[#12a150] flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-white" strokeWidth={3} /></span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[13px] font-semibold text-ink leading-none truncate">{t.badge}</span>
            <span className="text-[11.5px] text-ink-3 leading-[1.3]">{t.leader}</span>
          </div>
        </div>
      </Frame>
    </div>
  );
}
