"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { IMPORT_COPY } from "@/content/import";
import { useLang } from "@/lib/lang";

/* Нитка модулів, які наповнились самі. Не сітка однакових карток:
   один вертикальний рейс із переходом у кожен модуль. */

export default function ImportAfter() {
  const { lang } = useLang();
  const c = IMPORT_COPY[lang].after;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />

        <div className="relative max-w-[860px]">
          {/* Нитка, що з'єднує іконки модулів */}
          <span aria-hidden className="absolute left-[21px] top-6 bottom-6 w-px bg-hairline-strong" />

          <div className="flex flex-col">
            {c.items.map((item, i) => {
              const id = item.href.split("/").pop() ?? "people";
              const Icon = MODULE_ICONS[id];
              const accent = moduleAccent(id);
              return (
                <FadeIn key={item.href} delay={i}>
                  <Link
                    href={item.href}
                    className="group relative flex items-center gap-4 py-4 -mx-3 px-3 rounded-2xl transition-colors duration-200 hover:bg-surface-2"
                  >
                    <span
                      className="relative z-10 w-[43px] h-[43px] rounded-full flex items-center justify-center shrink-0 text-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.5)]"
                      style={{ background: accent }}
                    >
                      {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={2.1} />}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 min-w-0 flex-1">
                      <span className="text-[17px] font-semibold text-ink leading-[1.3] tracking-[-0.3px] shrink-0">
                        {item.module}
                      </span>
                      <span className="text-[15px] text-ink-2 leading-[1.5] min-w-0">{item.text}</span>
                    </div>
                    <ArrowRight
                      className="w-[18px] h-[18px] text-ink-3 shrink-0 transition-all duration-200 group-hover:text-brand group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>

        <FadeIn delay={2}>
          <p className="text-[14.5px] text-ink-3 leading-[1.55] max-w-[720px] pl-4 border-l-2 border-brand/40">{c.note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
