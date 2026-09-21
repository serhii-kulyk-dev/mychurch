"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { BLOG_CATEGORIES, BLOG_COPY, BLOG_POSTS, starterPosts } from "@/content/blog";
import type { BlogPost } from "@/content/blog";
import { BLOG_CATEGORY_ACCENTS, BLOG_CATEGORY_ICONS } from "@/components/shared/blog-icons";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   /blog — сім статей, кожна великим блоком. Не сітка однакових
   карток: перший і останній блоки широкі, решта — вужчі, тому
   мозаїка читається в порядку «з чого почати».
   ──────────────────────────────────────────────────────────────── */

function formatDate(date: string, lang: "ua" | "en") {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "ua" ? "uk-UA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  const { lang } = useLang();
  const t = BLOG_COPY[lang];
  const categories = BLOG_CATEGORIES[lang];
  const starter = starterPosts(lang);

  const categoryTitle = (post: BlogPost) => categories.find((c) => c.id === post.category)?.title ?? "";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-10 md:pt-16 pb-14 md:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-a absolute -top-[300px] left-[15%] w-[880px] h-[600px] rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 18%, transparent), transparent 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 30% 10%, black 10%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 10%, black 10%, transparent 75%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
          <FadeIn className="flex flex-col gap-5 max-w-[760px]">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.hero.eyebrow}</span>
            <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-1.8px] text-[36px] sm:text-[44px] md:text-[54px]">
              {t.hero.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[620px]">{t.hero.lead}</p>
            <div className="flex items-center gap-5 pt-1">
              <span className="flex items-baseline gap-2">
                <span className="text-[22px] font-semibold text-ink tabular-nums">{BLOG_POSTS.length}</span>
                <span className="text-[14px] text-ink-3">{t.stats.posts}</span>
              </span>
              <span className="w-px h-5 bg-hairline-strong" />
              <span className="flex items-baseline gap-2">
                <span className="text-[22px] font-semibold text-ink tabular-nums">{categories.length}</span>
                <span className="text-[14px] text-ink-3">{t.stats.topics}</span>
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Сім статей великими блоками ──────────────────────── */}
      <section className="w-full flex flex-col items-center pb-12 md:pb-16 bg-page">
        <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-7 md:gap-9 -mt-8 md:-mt-10">
          <FadeIn className="flex flex-col gap-2.5 max-w-[720px]">
            <h2 className="font-semibold text-ink text-[26px] md:text-[34px] leading-[1.12] tracking-[-0.9px]">{t.starterTitle}</h2>
            <p className="text-[15.5px] md:text-[17px] text-ink-2 leading-[1.55]">{t.starterText}</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
            {starter.map(({ post, why }, i) => {
              const accent = BLOG_CATEGORY_ACCENTS[post.category];
              const Icon = BLOG_CATEGORY_ICONS[post.category];
              const copy = post.copy[lang];
              const wide = i === 0 || i === starter.length - 1;
              return (
                <FadeIn
                  key={post.slug}
                  delay={Math.min(i, 4)}
                  variant="scale"
                  className={["h-full", wide ? "sm:col-span-2 lg:col-span-4" : "lg:col-span-2"].join(" ")}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover-lift group h-full flex flex-col gap-3.5 rounded-[24px] border border-hairline bg-surface p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    style={{ background: `linear-gradient(140deg, color-mix(in oklab, ${accent} 9%, var(--surface)), var(--surface) 62%)` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                      >
                        <Icon className="w-[19px] h-[19px]" strokeWidth={2} />
                      </span>
                      <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
                        <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> · {categoryTitle(post)}
                      </span>
                    </div>
                    <h3
                      className={[
                        "font-semibold text-ink leading-[1.14] tracking-[-0.7px] group-hover:text-brand transition-colors",
                        wide ? "text-[26px] md:text-[34px]" : "text-[21px] md:text-[25px]",
                      ].join(" ")}
                    >
                      {copy.title}
                    </h3>
                    <p className={["text-ink-2 leading-[1.55]", wide ? "text-[16px] md:text-[17.5px] max-w-[620px]" : "text-[15.5px]"].join(" ")}>
                      {why}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-4 text-[13px] text-ink-3">
                      <span>{formatDate(post.date, lang)}</span>
                      <span className="w-1 h-1 rounded-full bg-ink-3/50" />
                      <span className="tabular-nums">
                        {post.minutes} {t.minutes}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 font-medium" style={{ color: accent }}>
                        {t.readLabel}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
