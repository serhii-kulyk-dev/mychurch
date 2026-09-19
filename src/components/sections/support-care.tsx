"use client";

import { DatabaseBackup, ShieldCheck, RefreshCw, Download } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useLang } from "@/lib/lang";
import { SUPPORT_COPY } from "@/content/support";

const CARE_ICONS = [DatabaseBackup, ShieldCheck, RefreshCw, Download];

export default function SupportCare() {
  const { lang } = useLang();
  const c = SUPPORT_COPY[lang].care;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-start">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} className="lg:sticky lg:top-28" />

        {/* A spec sheet, not cards: hairline-divided rows inside one panel. */}
        <FadeIn variant="right" delay={1}>
          <div className="rounded-[22px] border border-hairline bg-surface overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {c.items.map((item, i) => {
              const Icon = CARE_ICONS[i] ?? ShieldCheck;
              return (
                <div
                  key={item.title}
                  className={[
                    "flex items-start gap-4 p-6 md:px-8 md:py-7",
                    i === c.items.length - 1 ? "" : "border-b border-hairline",
                  ].join(" ")}
                >
                  <span className="mt-0.5 w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center shrink-0 text-brand">
                    <Icon className="w-[17px] h-[17px]" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.3px]">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-ink-2 leading-[1.55]">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
