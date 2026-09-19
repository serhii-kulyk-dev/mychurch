"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { BLOG_CATEGORIES, BLOG_COPY, BLOG_POSTS, postsByCategory, searchQueries } from "@/content/blog";
import type { BlogPost } from "@/content/blog";
import { BLOG_CATEGORY_ACCENTS, BLOG_CATEGORY_ICONS } from "@/components/shared/blog-icons";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   /blog — не сітка однакових карток, а редакційна сторінка:
   дві головні статті, блок пошукових запитів і списки по темах.
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
  const featured = BLOG_POSTS.filter((p) => p.featured).slice(0, 2);
  const queries = searchQueries(lang, 18);

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

          {/* Дві головні статті: перша велика, друга вужча */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-5 md:gap-6">
            {featured.map((post, i) => {
              const accent = BLOG_CATEGORY_ACCENTS[post.category];
              const Icon = BLOG_CATEGORY_ICONS[post.category];
              const copy = post.copy[lang];
              return (
                <FadeIn key={post.slug} delay={i} variant="scale" className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover-lift group h-full flex flex-col gap-4 rounded-[24px] border border-hairline bg-surface p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
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
                        {t.featuredLabel} · {categoryTitle(post)}
                      </span>
                    </div>
                    <h2
                      className={[
                        "font-semibold text-ink leading-[1.14] tracking-[-0.8px]",
                        i === 0 ? "text-[26px] md:text-[34px]" : "text-[22px] md:text-[26px]",
                      ].join(" ")}
                    >
                      {copy.title}
                    </h2>
                    <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.55]">{copy.lead}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3 text-[13px] text-ink-3">
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

      {/* ── За якими запитами шукають ────────────────────────── */}
      <section className="w-full flex flex-col items-center py-12 md:py-16 bg-page">
        <div className="w-full max-w-[1120px] px-5 md:px-8">
          <FadeIn className="rounded-[24px] border border-hairline bg-surface p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-start gap-3.5">
              <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0 dark:bg-brand/15">
                <Search className="w-[19px] h-[19px]" strokeWidth={2} />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-ink text-[20px] md:text-[24px] leading-[1.2] tracking-[-0.5px]">{t.queriesTitle}</h2>
                <p className="text-[15px] text-ink-2 leading-[1.5] max-w-[640px]">{t.queriesText}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {queries.map(({ query, slug }) => (
                <Link
                  key={query}
                  href={`/blog/${slug}`}
                  className="chip-module rounded-full border border-hairline-strong bg-surface-2 px-3.5 py-2 text-[13.5px] text-ink-2 hover:text-ink leading-none"
                >
                  {query}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Статті за темами ─────────────────────────────────── */}
      <section className="w-full flex flex-col items-center pb-12 md:pb-16 bg-page">
        <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-14 md:gap-20">
          {categories.map((category) => {
            const posts = postsByCategory(category.id);
            const accent = BLOG_CATEGORY_ACCENTS[category.id];
            const Icon = BLOG_CATEGORY_ICONS[category.id];
            return (
              <div key={category.id} id={`t-${category.id}`} className="scroll-mt-28 flex flex-col gap-6 md:gap-7">
                <FadeIn className="flex items-start gap-4">
                  <span
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-hairline"
                    style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                  >
                    <Icon className="w-[22px] h-[22px]" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-semibold text-ink text-[24px] md:text-[30px] leading-[1.15] tracking-[-0.7px]">{category.title}</h2>
                      <span className="rounded-full bg-surface-3 border border-hairline px-2 py-0.5 text-[12px] font-medium text-ink-3 tabular-nums leading-none">
                        {posts.length}
                      </span>
                    </div>
                    <p className="text-[15.5px] text-ink-2 leading-[1.5] max-w-[620px]">{category.text}</p>
                  </div>
                </FadeIn>

                <div className="flex flex-col">
                  {posts.map((post, i) => {
                    const copy = post.copy[lang];
                    return (
                      <FadeIn key={post.slug} delay={Math.min(i, 3)}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-t border-hairline py-5 md:py-6 transition-colors hover:bg-surface-2/60 -mx-3 px-3 rounded-xl"
                        >
                          <span className="shrink-0 w-8 text-[13px] font-semibold tabular-nums text-ink-3 pt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 flex flex-col gap-1.5">
                            <span className="flex items-start gap-2">
                              <span className="font-semibold text-ink text-[18px] md:text-[21px] leading-[1.25] tracking-[-0.4px] group-hover:text-brand transition-colors">
                                {copy.title}
                              </span>
                              <ArrowUpRight className="w-[17px] h-[17px] mt-1 shrink-0 text-ink-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                            </span>
                            <span className="text-[15px] text-ink-2 leading-[1.55] max-w-[680px]">{copy.lead}</span>
                            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-[12.5px] text-ink-3">
                              <span>{formatDate(post.date, lang)}</span>
                              <span className="w-1 h-1 rounded-full bg-ink-3/50" />
                              <span className="tabular-nums">
                                {post.minutes} {t.minutes}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-ink-3/50" />
                              <span>{copy.keywords[0]}</span>
                            </span>
                          </span>
                        </Link>
                      </FadeIn>
                    );
                  })}
                  {posts.length === 0 && <p className="text-[15px] text-ink-3 py-4">{t.emptyCategory}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
