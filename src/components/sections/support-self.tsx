"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useLang } from "@/lib/lang";
import { SUPPORT_COPY } from "@/content/support";

export default function SupportSelf() {
  const { lang } = useLang();
  const c = SUPPORT_COPY[lang].self;

  return (
    <section className="w-full flex flex-col items-center pb-16 md:pb-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 rounded-[22px] border border-hairline bg-surface-2/60 px-6 md:px-8 py-7 md:py-8">
            <div className="flex flex-col gap-1.5 lg:max-w-[280px] shrink-0">
              <h2 className="font-semibold text-ink text-[20px] md:text-[22px] leading-[1.25] tracking-[-0.5px]">
                {c.title}
              </h2>
              <p className="text-[14.5px] text-ink-3 leading-[1.5]">{c.text}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
              {c.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex-1 flex items-start justify-between gap-3 rounded-2xl border border-hairline bg-surface px-5 py-4 hover:border-brand/40 hover:bg-surface-3 transition-colors"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-ink text-[15.5px] leading-[1.3] tracking-[-0.2px]">
                      {link.label}
                    </span>
                    <span className="text-[13px] text-ink-3 leading-[1.4]">{link.text}</span>
                  </span>
                  <ArrowRight className="mt-0.5 w-[15px] h-[15px] text-ink-3 shrink-0 transition-all duration-200 group-hover:text-brand group-hover:translate-x-0.5" strokeWidth={2.2} />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
