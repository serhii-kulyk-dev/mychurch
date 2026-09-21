"use client";

import Link from "next/link";
import { Send, Mail, Phone, Users, ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useLang } from "@/lib/lang";
import { SUPPORT_COPY } from "@/content/support";

const CHANNEL_ICONS: Record<string, typeof Send> = {
  telegram: Send,
  mail: Mail,
  phone: Phone,
  team: Users,
};

export default function SupportChannels() {
  const { lang } = useLang();
  const c = SUPPORT_COPY[lang].channels;

  return (
    <section id="channels" className="w-full flex flex-col items-center py-16 md:py-24 bg-page scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-12">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />

        {/* A ledger of channels rather than a card grid: one row each, the
            address on the left, what it is for in the middle, the answer
            window on the right. */}
        <div className="flex flex-col">
          <div className="hidden md:grid grid-cols-[300px_1fr_auto] gap-8 pb-3 border-b border-hairline">
            <span />
            <span />
            <span className="text-[11.5px] uppercase tracking-[0.1em] text-ink-3 leading-none text-right">
              {c.whenLabel}
            </span>
          </div>
          {c.items.map((item, i) => {
            const Icon = CHANNEL_ICONS[item.id] ?? Send;
            const internal = item.href?.startsWith("/");
            const external = item.href?.startsWith("http");

            const row = (
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] items-start gap-3 md:gap-8 py-5 md:py-6">
                {/* Channel + address */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="mt-0.5 w-9 h-9 rounded-xl bg-surface border border-hairline flex items-center justify-center shrink-0 text-brand">
                    <Icon className="w-[17px] h-[17px]" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-semibold text-ink text-[17px] md:text-[18px] leading-[1.3] tracking-[-0.3px]">
                      {item.name}
                    </span>
                    <span
                      className={[
                        "text-[14px] leading-[1.3] break-all sm:break-normal",
                        item.href ? "text-brand" : "text-ink-3",
                      ].join(" ")}
                    >
                      {item.handle}
                      {item.href && (
                        <ArrowUpRight
                          className="inline-block ml-0.5 w-[13px] h-[13px] align-[-1px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={2.5}
                        />
                      )}
                    </span>
                  </div>
                </div>

                {/* What it is for */}
                <p className="text-[15px] md:text-[16px] text-ink-2 leading-[1.55] md:pt-1 pl-[50px] md:pl-0 max-w-[560px]">
                  {item.text}
                </p>

                {/* Answer window */}
                <div className="flex flex-col gap-1 pl-[50px] md:pl-0 md:items-end md:text-right md:pt-1">
                  <span className="md:hidden text-[11.5px] uppercase tracking-[0.1em] text-ink-3 leading-none">
                    {c.whenLabel}
                  </span>
                  <span className="text-[14.5px] font-medium text-ink leading-[1.3] whitespace-nowrap">
                    {item.when}
                  </span>
                </div>
              </div>
            );

            return (
              <FadeIn key={item.id} delay={i} variant="left">
                <div className={i === c.items.length - 1 ? "" : "border-b border-hairline"}>
                  {item.href ? (
                    internal ? (
                      <Link
                        href={item.href}
                        className="group block -mx-3 px-3 rounded-2xl hover:bg-surface transition-colors"
                      >
                        {row}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group block -mx-3 px-3 rounded-2xl hover:bg-surface transition-colors"
                      >
                        {row}
                      </a>
                    )
                  ) : (
                    row
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
