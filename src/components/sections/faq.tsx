"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Mail } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { SITE_TELEGRAM } from "@/lib/seo";

function FaqCard({ item }: { item: { id: string; question: string; answer: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="w-full text-left rounded-[16px] border border-hairline bg-surface px-5 py-4 md:px-6 md:py-5 flex flex-col gap-0 transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-ink text-[16.5px] md:text-[17px] leading-[1.36] tracking-[-0.17px] text-left">
          {item.question}
        </span>
        <span
          className="shrink-0 w-6 h-6 rounded-full bg-surface-3 border border-hairline flex items-center justify-center text-ink-2 mt-[1px] transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      {/* CSS grid trick: animates height without knowing it */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p className="mt-3 text-[15.5px] font-normal text-ink-2 leading-[1.55] text-left">{item.answer}</p>
        </div>
      </div>
    </button>
  );
}

export default function Faq() {
  const t = useT().faq;
  const common = useT().common;

  return (
    <div className="w-full bg-page">
      {/* Hero */}
      <section className="relative w-full bg-surface pt-14 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
          />
        </div>
        <div className="relative z-10 w-full max-w-[1120px] mx-auto px-5 md:px-8 flex flex-col items-center gap-8 text-center">
          <FadeIn className="flex flex-col items-center gap-4">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
            <h1 className="font-semibold text-ink text-[36px] md:text-[56px] leading-[1.1] tracking-[-1.1px] md:tracking-[-1.8px]">{t.title}</h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{t.text}</p>
          </FadeIn>
          <FadeIn delay={1} className="flex flex-wrap justify-center gap-2">
            {t.categories.map((c) => (
              <a
                key={c.title}
                href={`#faq-${c.title}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`faq-${c.title}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-full border border-hairline bg-surface px-4 py-2 text-[13.5px] font-medium text-ink-2 hover:text-ink hover:border-hairline-strong hover:bg-surface-2 transition-colors"
              >
                {c.title}
                <span className="ml-1.5 text-ink-3 tabular-nums">{c.items.length}</span>
              </a>
            ))}
          </FadeIn>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-page pointer-events-none" />
      </section>

      {/* Categories */}
      <div className="w-full max-w-[1120px] mx-auto px-5 md:px-8 py-12 md:py-16 flex flex-col gap-12 md:gap-16">
        {t.categories.map((category, ci) => (
          <section
            key={category.title}
            id={`faq-${category.title}`}
            className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-14"
          >
            <FadeIn className="lg:sticky lg:top-28 lg:self-start">
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">0{ci + 1}</span>
              <h2 className="mt-2 text-[24px] md:text-[30px] font-semibold text-ink leading-[1.15] tracking-[-0.7px]">{category.title}</h2>
            </FadeIn>
            <div className="flex flex-col gap-3">
              {category.items.map((item, i) => (
                <FadeIn key={item.id} delay={i}>
                  <FaqCard item={item} />
                </FadeIn>
              ))}
            </div>
          </section>
        ))}

        {/* Still have questions */}
        <FadeIn variant="scale">
          <div className="rounded-[24px] border border-hairline bg-surface p-7 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.5px]">{t.stillQuestions}</h3>
              <p className="text-[15.5px] text-ink-2 leading-[1.5]">{t.stillQuestionsText}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={SITE_TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 px-6 rounded-full overflow-hidden"
              >
                <Send className="relative w-4 h-4 text-white" />
                <span className="relative text-white font-semibold text-[15px] tracking-[-0.3px] whitespace-nowrap">{common.telegram}</span>
              </Link>
              <a
                href="mailto:team@mychurch.com.ua"
                className="btn-secondary relative flex items-center justify-center gap-2 h-12 px-6 rounded-full overflow-hidden border border-hairline-strong"
              >
                <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
                <Mail className="relative w-4 h-4 text-ink-2" />
                <span className="relative text-ink-2 font-medium text-[15px] tracking-[-0.3px] whitespace-nowrap">team@mychurch.com.ua</span>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
