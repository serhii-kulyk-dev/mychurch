"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { flush, isOptedOut, setOptOut, startSession, track } from "@/lib/analytics/client";
import { rememberLeadSource } from "@/lib/lead";

/* Трекер кроків відвідувача. Стоїть у корені layout і працює сам:

     • перегляд сторінки і перехід між сторінками;
     • які блоки людина реально побачила (IntersectionObserver);
     • глибина прокрутки — 25 / 50 / 75 / 90%;
     • кліки: усе з `data-track`, посилання, кнопки (пишемо підпис, не вміст полів);
     • вихід зі сторінки: скільки секунд читав і доки догорнув.

   Форми додають свої кроки самі, через track() — див. demo-modal і church-brief. */

interface PageState {
  path: string;
  start: number;
  depth: number;
  marks: Set<number>;
  sections: Set<string>;
  closed: boolean;
}

const DEPTH_MARKS = [25, 50, 75, 90];
const LABEL_MAX = 60;

function isExternal(href: string) {
  try {
    return new URL(href, location.href).host !== location.host;
  } catch {
    /* Не адреса (тільки якір, javascript: тощо) — точно не перехід назовні. */
    return false;
  }
}

function label(el: Element) {
  const text = (el as HTMLElement).innerText || el.getAttribute("aria-label") || "";
  return text.replace(/\s+/g, " ").trim().slice(0, LABEL_MAX);
}

export default function Analytics() {
  const pathname = usePathname();
  /* Стан сторінки народжується в ефекті, а не під час рендера:
     Date.now() у тілі компонента робить рендер недетермінованим. */
  const page = useRef<PageState | null>(null);

  /* ── Один раз: перемикач «не рахувати мене» і глобальні слухачі ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("notrack")) setOptOut(params.get("notrack") !== "0");
    if (isOptedOut()) return;

    const exit = (reason: string) => {
      const p = page.current;
      if (!p || p.closed) return;
      p.closed = true;
      track("page_exit", {
        seconds: Math.round((Date.now() - p.start) / 1000),
        depth: p.depth,
        blocks: p.sections.size,
        reason,
      });
    };

    /* Через requestAnimationFrame, як у навбарі: подія прокрутки може
       прилітати частіше за кадр, а глибину досить рахувати раз на кадр. */
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const total = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const depth = Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / total) * 100));
      const p = page.current;
      if (!p || depth <= p.depth) return;
      p.depth = depth;
      for (const mark of DEPTH_MARKS) {
        if (depth >= mark && !p.marks.has(mark)) {
          p.marks.add(mark);
          track("scroll", { depth: mark });
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onClick = (event: MouseEvent) => {
      /* Демо на сторінках самі «клікають» по своїх макетах, щоб показати
         сценарій. Такі кліки синтетичні — рахуємо лише людські. */
      if (!event.isTrusted) return;
      const target = event.target as Element | null;
      if (!target?.closest) return;

      /* Явна розмітка сильніша за здогадки: data-track={назва}. */
      const marked = target.closest<HTMLElement>("[data-track]");
      if (marked) {
        const { track: name, ...rest } = marked.dataset;
        track(name || "click", { label: label(marked), ...rest });
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (link) {
        const href = link.getAttribute("href") ?? "";
        if (/^(tel:|mailto:)/.test(href)) {
          track("copy", { kind: href.startsWith("tel:") ? "телефон" : "пошта", label: label(link) });
          return;
        }
        /* Саме host, а не пошук підрядка: інакше "notmychurch.com.ua" і
           "evil.example/?ref=mychurch.com.ua" рахувались би своїми. */
        const external = isExternal(href);
        track(external ? "outbound" : "link_click", {
          href: href.slice(0, 200),
          label: label(link),
        });
        return;
      }

      const button = target.closest<HTMLElement>("button,[role='button']");
      if (button) track("click", { label: label(button) });
    };

    const onHide = () => {
      exit("закрив вкладку");
      flush(true);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* ── На кожну сторінку: вихід із попередньої, перегляд нової, блоки ── */
  useEffect(() => {
    /* Мітки кампанії живуть лише в адресі першої сторінки — знімаємо їх до
       перевірки на відмову від аналітики: це не статистика, а те, звідки
       прийшла людина, яка сама надішле заявку (див. lib/lead.ts). */
    rememberLeadSource();

    if (isOptedOut()) return;

    const previous = page.current;
    if (previous && previous.path !== pathname && !previous.closed) {
      previous.closed = true;
      track("page_exit", {
        seconds: Math.round((Date.now() - previous.start) / 1000),
        depth: previous.depth,
        blocks: previous.sections.size,
        reason: "пішов далі сайтом",
      });
    }

    const state: PageState = { path: pathname, start: Date.now(), depth: 0, marks: new Set(), sections: new Set(), closed: false };
    page.current = state;

    startSession();
    track("pageview", { title: document.title.slice(0, 120), query: location.search.slice(0, 200) });

    /* Блоки лендінгу з'являються одразу після навігації, але дамо
       кадр на рендер — інакше спостерігати ще нема за чим. */
    let observer: IntersectionObserver | null = null;
    const frame = requestAnimationFrame(() => {
      const blocks = document.querySelectorAll<HTMLElement>("section[id], [data-block]");
      if (!blocks.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const name = el.dataset.block || el.id;
            if (!name || state.sections.has(name)) continue;
            state.sections.add(name);
            track("section_view", { block: name, order: state.sections.size });
            observer?.unobserve(el);
          }
        },
        { threshold: 0.35 }
      );
      blocks.forEach((b) => observer?.observe(b));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
