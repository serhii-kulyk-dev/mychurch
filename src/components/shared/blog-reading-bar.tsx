"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDemoModal } from "@/context/demo-modal-context";

/* ────────────────────────────────────────────────────────────────
   Смуга читання внизу статті: скільки лишилось і одна дія.

   Статті довгі, а замовити демо можна було тільки в самому кінці —
   тепер кнопка їде разом із читачем. Смуга з'являється після першого
   екрана й ховається, щойно видно фінальний блок статті: дві однакові
   кнопки поруч не потрібні.

   Поки смуга на екрані, кнопка «нагору» піднімається над нею — через
   `--float-lift` на <html>.
   ──────────────────────────────────────────────────────────────── */

const LIFT = 82;

export default function BlogReadingBar({
  title,
  demoLabel,
  linkLabel,
  linkHref,
}: {
  title: string;
  demoLabel: string;
  linkLabel: string;
  linkHref: string;
}) {
  const { open } = useDemoModal();
  const [progress, setProgress] = useState(0);
  const [past, setPast] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0);
      setPast(scrolled > window.innerHeight * 0.75);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Фінальний блок статті сам гасить смугу. */
  useEffect(() => {
    const end = document.querySelector("[data-post-cta]");
    if (!end) return;
    const io = new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting), {
      rootMargin: "0px 0px -15% 0px",
    });
    io.observe(end);
    return () => io.disconnect();
    /* Перехід між статтями не перемонтовує сторінку — заголовок міняється,
       і спостерігача треба перевісити на новий фінальний блок. */
  }, [title]);

  const shown = past && !atEnd;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--float-lift", shown ? `${LIFT}px` : "0px");
    return () => {
      root.style.removeProperty("--float-lift");
    };
  }, [shown]);

  return (
    <div
      data-on={shown ? "1" : "0"}
      aria-hidden={!shown}
      className="read-bar fixed inset-x-0 bottom-0 z-30 px-3 md:px-6 pointer-events-none"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-[1120px] overflow-hidden rounded-[18px] border border-hairline-strong bg-surface/85 backdrop-blur-xl shadow-[0_18px_44px_-24px_rgba(0,0,0,0.6)]">
        <span aria-hidden className="block h-[3px] bg-surface-3">
          <span
            className="block h-full origin-left bg-brand transition-transform duration-150 ease-linear"
            style={{ transform: `scaleX(${progress})` }}
          />
        </span>
        <div className="flex items-center gap-3 px-3.5 py-2.5 md:px-5 md:py-3">
          <span className="flex-1 min-w-0 truncate text-[13.5px] md:text-[15px] font-medium text-ink-2">{title}</span>
          <Link
            href={linkHref}
            tabIndex={shown ? 0 : -1}
            className="hidden md:inline-flex items-center gap-1.5 text-[14.5px] text-ink-3 hover:text-ink transition-colors whitespace-nowrap"
          >
            {linkLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={open}
            tabIndex={shown ? 0 : -1}
            data-track="cta"
            data-place="смуга читання статті"
            className="btn-primary btn-brand inline-flex items-center justify-center h-10 md:h-11 px-4 md:px-6 rounded-full shrink-0"
          >
            <span className="text-white font-semibold text-[14px] md:text-[15px] tracking-[-0.2px] whitespace-nowrap">{demoLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
