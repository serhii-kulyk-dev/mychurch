"use client";

import { Ban, Check, Lock, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

function Card({
  icon: Icon,
  title,
  text,
  delay,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <FadeIn delay={delay} variant="scale" className="h-full">
      <article className="hover-lift h-full rounded-[20px] bg-surface border border-hairline p-6 md:p-7 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <span className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center">
          <Icon className="w-[22px] h-[22px] text-brand" strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-ink text-[18px] md:text-[19px] leading-[1.3] tracking-[-0.3px]">{title}</h3>
          <p className="text-[15.5px] text-ink-2 leading-[1.5]">{text}</p>
        </div>
        <div className="mt-auto rounded-xl border border-hairline bg-surface-2 p-3">{children}</div>
      </article>
    </FadeIn>
  );
}

export default function AiTrust() {
  const t = useT().ai.trust;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <Card icon={ShieldCheck} title={t.confirm.title} text={t.confirm.text} delay={0}>
            <div className="flex flex-col gap-2">
              <p className="text-[13.5px] text-ink leading-[1.4]">{t.confirm.question}</p>
              <div className="flex gap-1.5">
                <span className="btn-brand flex-1 h-8 rounded-[10px] flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-white">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  {t.confirm.yes}
                </span>
                <span className="h-8 px-3 rounded-[10px] border border-hairline-strong bg-surface flex items-center justify-center text-[12.5px] font-medium text-ink-2">
                  {t.confirm.no}
                </span>
              </div>
            </div>
          </Card>

          <Card icon={Lock} title={t.data.title} text={t.data.text} delay={1}>
            <div className="flex flex-wrap gap-1.5">
              {t.data.allowed.map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-hairline px-2.5 py-1.5 text-[12.5px] font-medium text-ink leading-none">
                  <Check className="w-3 h-3 text-[#0e7a3c] dark:text-[#3ddc97]" strokeWidth={3} />
                  {label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-hairline-strong px-2.5 py-1.5 text-[12.5px] font-medium text-ink-3 leading-none line-through decoration-[#f05b8b]/70">
                <Ban className="w-3 h-3 text-[#f05b8b]" strokeWidth={2.6} />
                {t.data.blocked}
              </span>
            </div>
          </Card>

          <Card icon={SlidersHorizontal} title={t.permissions.title} text={t.permissions.text} delay={2}>
            <ul className="flex flex-col gap-2">
              {t.permissions.rows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 text-[12.5px] leading-[1.3]">
                  <span className={cn("min-w-0 truncate", row.on ? "text-ink" : "text-ink-3")}>{row.label}</span>
                  <span
                    role="img"
                    aria-label={row.on ? "on" : "off"}
                    className={cn("relative w-8 h-[18px] rounded-full shrink-0 transition-colors", row.on ? "bg-brand" : "bg-surface-3 border border-hairline-strong")}
                  >
                    <span className={cn("absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)]", row.on ? "left-[15px]" : "left-[1px]")} />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
