"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FileSpreadsheet, FileJson, FileText, UploadCloud } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { IMPORT_COPY } from "@/content/import";
import { useDemoModal } from "@/context/demo-modal-context";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Іконка за розширенням — файли в макеті виглядають як у провіднику. */
function fileIcon(name: string) {
  if (name.endsWith(".json")) return FileJson;
  if (name.endsWith(".txt") || name.endsWith(".vcf")) return FileText;
  return FileSpreadsheet;
}

export default function ImportHero() {
  const { lang } = useLang();
  const t = IMPORT_COPY[lang].hero;
  const { open } = useDemoModal();

  /* Файли «прилітають» у зону, щойно вона з'явилась на екрані. */
  const zoneRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = zoneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-12 md:pt-20 pb-16 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[280px] left-[45%] -translate-x-1/2 w-[860px] h-[600px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 90%, transparent), transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 55% at 45% 25%, black 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 45% 25%, black 20%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-12 lg:gap-16 items-center">
        <FadeIn className="flex flex-col items-start gap-6 text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 backdrop-blur border border-hairline pl-2.5 pr-4 py-1.5">
            <UploadCloud className="w-[14px] h-[14px] text-brand" strokeWidth={2.2} />
            <span className="text-[13px] font-medium text-ink-2 leading-none">{t.eyebrow}</span>
          </span>

          <h1 className="font-semibold text-ink leading-[1.06] tracking-[-1.2px] md:tracking-[-2px] text-[38px] sm:text-[46px] md:text-[54px] max-w-[620px]">
            {t.title}
          </h1>

          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{t.lead}</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-1">
            <button
              onClick={open}
              className="btn-primary btn-brand flex items-center justify-center h-[52px] w-full sm:w-auto px-8 rounded-full"
            >
              <span className="text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">{t.cta}</span>
            </button>
            <Link
              href="/modules/people"
              className="btn-secondary relative flex items-center justify-center h-[52px] w-full sm:w-auto px-7 rounded-full overflow-hidden border border-hairline-strong"
            >
              <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
              <span className="relative text-ink-2 font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {t.ctaSecondary}
              </span>
            </Link>
          </div>

          <dl className="flex flex-wrap items-start gap-x-10 gap-y-5 pt-5 border-t border-hairline w-full max-w-[600px]">
            {t.facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <dt className="text-[17px] md:text-[18px] font-semibold text-ink leading-none tracking-[-0.4px]">{f.value}</dt>
                <dd className="text-[13px] text-ink-3 leading-[1.35] max-w-[170px]">{f.label}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        {/* Зона перетягування: файли падають, під ними — що система з них дістала */}
        <FadeIn variant="scale" delay={2} className="min-w-0">
          <div
            ref={zoneRef}
            className={cn(
              "rounded-[26px] border border-hairline bg-surface overflow-hidden shadow-[0_40px_80px_-50px_rgba(0,50,120,0.55)]",
              on && "mock-on"
            )}
          >
            <div className="m-3 rounded-[18px] border border-dashed border-hairline-strong bg-surface-2 px-4 py-5 flex flex-col items-center gap-1.5 text-center">
              <span className="w-10 h-10 rounded-full bg-brand-soft text-brand flex items-center justify-center">
                <UploadCloud className="w-[18px] h-[18px]" strokeWidth={2.1} />
              </span>
              <span className="text-[14.5px] font-semibold text-ink leading-none mt-1">{t.drop.title}</span>
              <span className="text-[12px] text-ink-3 leading-[1.4]">{t.drop.hint}</span>
            </div>

            <div className="px-3 pb-1 flex flex-col">
              {t.drop.files.map((f, i) => {
                const Icon = fileIcon(f.name);
                return (
                  <div
                    key={f.name}
                    className="mock-row flex items-center gap-3 px-2 py-2.5 border-b border-hairline last:border-b-0"
                    style={{ animationDelay: `${240 + i * 130}ms` }}
                  >
                    <span className="w-8 h-8 rounded-lg bg-surface-3 text-ink-2 flex items-center justify-center shrink-0">
                      <Icon className="w-[15px] h-[15px]" strokeWidth={1.9} />
                    </span>
                    <span className="text-[13px] font-medium text-ink leading-none truncate flex-1 min-w-0">{f.name}</span>
                    <span className="text-[11.5px] text-ink-3 leading-none tabular-nums shrink-0">{f.meta}</span>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-4 bg-surface-2 border-t border-hairline flex flex-col gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.seen.label}</span>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {t.seen.rows.map((r, i) => (
                  <div
                    key={r.label}
                    className="mock-pop flex items-baseline gap-1.5"
                    style={{ animationDelay: `${820 + i * 110}ms` }}
                  >
                    <span className="text-[19px] font-semibold text-ink leading-none tracking-[-0.5px] tabular-nums">{r.value}</span>
                    <span className="text-[12.5px] text-ink-3 leading-none">{r.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-ink-3 leading-[1.45] pt-1 border-t border-hairline">{t.seen.note}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
