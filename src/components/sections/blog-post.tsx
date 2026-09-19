"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Info, Quote, Search } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { BLOG_CATEGORIES, BLOG_COPY, getPost, getRelated } from "@/content/blog";
import type { BlogBlock } from "@/content/blog";
import { BLOG_CATEGORY_ACCENTS, BLOG_CATEGORY_ICONS } from "@/components/shared/blog-icons";
import { useDemoModal } from "@/context/demo-modal-context";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Сторінка однієї статті. Текст — зі src/content/blog/posts,
   службові підписи — з BLOG_COPY.
   ──────────────────────────────────────────────────────────────── */

function formatDate(date: string, lang: "ua" | "en") {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "ua" ? "uk-UA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function sectionId(index: number) {
  return `r-${index + 1}`;
}

function Block({ block, accent }: { block: BlogBlock; accent: string }) {
  switch (block.kind) {
    case "text":
      return <p className="text-[16.5px] md:text-[17.5px] text-ink-2 leading-[1.7]">{block.text}</p>;

    case "list":
      return (
        <div className="flex flex-col gap-3">
          {block.title && <p className="text-[15.5px] font-semibold text-ink leading-[1.4]">{block.title}</p>}
          <ul className="flex flex-col gap-2.5">
            {block.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-[3px] w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
                >
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span className="text-[16px] md:text-[16.5px] text-ink-2 leading-[1.6]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "steps":
      return (
        <ol className="flex flex-col gap-4">
          {block.items.map((item, i) => (
            <li key={item.title} className="flex gap-4">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[14px] font-semibold tabular-nums"
                style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
              >
                {i + 1}
              </span>
              <span className="flex flex-col gap-1 pt-0.5">
                <span className="text-[16.5px] font-semibold text-ink leading-[1.35]">{item.title}</span>
                <span className="text-[16px] text-ink-2 leading-[1.6]">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      );

    case "callout":
      return (
        <div
          className="rounded-[20px] border border-hairline p-5 md:p-6 flex gap-4"
          style={{ background: `color-mix(in oklab, ${accent} 7%, var(--surface))` }}
        >
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
          >
            <Info className="w-[18px] h-[18px]" strokeWidth={2} />
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[16px] font-semibold text-ink leading-[1.35]">{block.title}</span>
            <span className="text-[16px] text-ink-2 leading-[1.6]">{block.text}</span>
          </span>
        </div>
      );

    case "quote":
      return (
        <blockquote className="relative rounded-[20px] border border-hairline bg-surface-2 p-5 md:p-7 flex gap-4">
          <Quote className="w-6 h-6 shrink-0" strokeWidth={2} style={{ color: accent }} />
          <p className="text-[18px] md:text-[21px] font-medium text-ink leading-[1.45] tracking-[-0.3px]">{block.text}</p>
        </blockquote>
      );

    case "table":
      return (
        <div className="-mx-5 px-5 md:mx-0 md:px-0 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-hairline-strong pb-2.5 pr-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-3"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={[
                        "border-b border-hairline py-3 pr-4 align-top text-[15.5px] leading-[1.5]",
                        i === 0 ? "font-medium text-ink" : "text-ink-2",
                      ].join(" ")}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { open } = useDemoModal();
  const post = getPost(slug);
  if (!post) return null;

  const t = BLOG_COPY[lang];
  const copy = post.copy[lang];
  const accent = BLOG_CATEGORY_ACCENTS[post.category];
  const Icon = BLOG_CATEGORY_ICONS[post.category];
  const category = BLOG_CATEGORIES[lang].find((c) => c.id === post.category);
  const related = getRelated(post);

  return (
    <>
      {/* ── Шапка статті ─────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-8 md:pt-12 pb-10 md:pb-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-a absolute -top-[320px] left-[25%] w-[820px] h-[560px] rounded-full opacity-60"
            style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 18%, transparent), transparent 100%)` }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[820px] px-5 md:px-8 flex flex-col gap-6">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
              <Link href="/" className="hover:text-ink transition-colors">
                {t.post.breadcrumbHome}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/blog" className="hover:text-ink transition-colors">
                {t.post.breadcrumbBlog}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-ink-2 font-medium">{category?.title}</span>
            </nav>
          </FadeIn>

          <FadeIn className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-2xl flex items-center justify-center border border-hairline shrink-0"
                style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <Link
                href={`/blog#t-${post.category}`}
                className="text-[12.5px] font-semibold uppercase tracking-[0.14em] hover:underline"
                style={{ color: accent }}
              >
                {category?.title}
              </Link>
            </div>

            <h1 className="font-semibold text-ink leading-[1.1] tracking-[-1.1px] md:tracking-[-1.6px] text-[32px] sm:text-[38px] md:text-[46px]">
              {copy.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55]">{copy.lead}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13.5px] text-ink-3">
              <span>{t.post.author}</span>
              <span className="w-1 h-1 rounded-full bg-ink-3/50" />
              <span>
                {t.post.published} {formatDate(post.date, lang)}
              </span>
              {post.updated && (
                <>
                  <span className="w-1 h-1 rounded-full bg-ink-3/50" />
                  <span>
                    {t.post.updated} {formatDate(post.updated, lang)}
                  </span>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-ink-3/50" />
              <span className="tabular-nums">
                {post.minutes} {t.minutes}
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Тіло статті ──────────────────────────────────────── */}
      <article className="w-full flex flex-col items-center bg-page pb-4">
        <div className="w-full max-w-[820px] px-5 md:px-8 flex flex-col gap-10 md:gap-14 py-10 md:py-14">
          {/* Проблема */}
          <FadeIn>
            <div className="rounded-[22px] border-l-4 border border-hairline bg-surface p-5 md:p-7 flex flex-col gap-2" style={{ borderLeftColor: accent }}>
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">{t.post.problemLabel}</span>
              <h2 className="text-[19px] md:text-[22px] font-semibold text-ink leading-[1.3] tracking-[-0.4px]">{copy.problem.title}</h2>
              <p className="text-[16px] md:text-[16.5px] text-ink-2 leading-[1.65]">{copy.problem.text}</p>
            </div>
          </FadeIn>

          {/* Зміст */}
          <FadeIn>
            <nav aria-label={t.post.contents} className="rounded-[20px] border border-hairline bg-surface-2 p-5 md:p-6 flex flex-col gap-3">
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">{t.post.contents}</span>
              <ol className="flex flex-col gap-2">
                {copy.sections.map((section, i) => (
                  <li key={section.heading} className="flex gap-3">
                    <span className="text-[13px] tabular-nums text-ink-3 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <a href={`#${sectionId(i)}`} className="text-[15.5px] text-ink-2 hover:text-brand transition-colors leading-[1.45]">
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </FadeIn>

          {/* Розділи */}
          {copy.sections.map((section, i) => (
            <FadeIn key={section.heading} className="flex flex-col gap-5 scroll-mt-28" style={{ scrollMarginTop: "7rem" }}>
              <h2 id={sectionId(i)} className="scroll-mt-28 font-semibold text-ink text-[24px] md:text-[30px] leading-[1.2] tracking-[-0.7px]">
                {section.heading}
              </h2>
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} accent={accent} />
              ))}
            </FadeIn>
          ))}

          {/* Коротко */}
          <FadeIn>
            <div className="rounded-[22px] border border-hairline bg-surface p-6 md:p-8 flex flex-col gap-4">
              <h2 className="font-semibold text-ink text-[20px] md:text-[24px] leading-[1.25] tracking-[-0.5px]">{t.post.takeaways}</h2>
              <ul className="flex flex-col gap-3">
                {copy.takeaways.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-[3px] w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span className="text-[16px] text-ink leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Питання та відповіді — видимі, бо саме вони йдуть у розмітку FAQ */}
          <FadeIn className="flex flex-col gap-5">
            <h2 className="font-semibold text-ink text-[24px] md:text-[30px] leading-[1.2] tracking-[-0.7px]">{t.post.faqTitle}</h2>
            <div className="flex flex-col gap-4">
              {copy.faq.map((item) => (
                <div key={item.q} className="rounded-[18px] border border-hairline bg-surface p-5 md:p-6 flex flex-col gap-2">
                  <h3 className="text-[17px] font-semibold text-ink leading-[1.35]">{item.q}</h3>
                  <p className="text-[16px] text-ink-2 leading-[1.6]">{item.a}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Пошукові запити теми */}
          <FadeIn>
            <div className="rounded-[20px] border border-dashed border-hairline-strong p-5 md:p-6 flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-ink-3" strokeWidth={2} />
                <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-3">{t.post.keywordsTitle}</span>
              </div>
              <p className="text-[14.5px] text-ink-3 leading-[1.5]">{t.post.keywordsText}</p>
              <div className="flex flex-wrap gap-2">
                {copy.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-hairline bg-surface-2 px-3 py-1.5 text-[13px] text-ink-2 leading-none">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Куди далі в продукті */}
          <FadeIn variant="scale">
            <div
              className="rounded-[24px] border border-hairline p-6 md:p-8 flex flex-col gap-4"
              style={{ background: `linear-gradient(140deg, color-mix(in oklab, ${accent} 10%, var(--surface)), var(--surface) 65%)` }}
            >
              <h2 className="font-semibold text-ink text-[21px] md:text-[26px] leading-[1.25] tracking-[-0.5px]">{copy.cta.title}</h2>
              <p className="text-[16px] text-ink-2 leading-[1.6] max-w-[560px]">{copy.cta.text}</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  href={copy.cta.href}
                  className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-hairline-strong bg-surface text-ink font-medium text-[15.5px] hover:bg-surface-2 transition-colors"
                >
                  {copy.cta.label}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => open()}
                  className="btn-primary btn-brand inline-flex items-center justify-center h-12 px-6 rounded-full overflow-hidden"
                >
                  <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.2px]">{t.post.demoLabel}</span>
                </button>
              </div>
              <p className="text-[13.5px] text-ink-3 leading-[1.5]">{t.post.shareText}</p>
            </div>
          </FadeIn>
        </div>
      </article>

      {/* ── Читати далі ──────────────────────────────────────── */}
      <section className="w-full flex flex-col items-center bg-page pb-14 md:pb-20">
        <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-ink text-[22px] md:text-[28px] leading-[1.2] tracking-[-0.6px]">{t.post.relatedTitle}</h2>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[15px] text-ink-2 hover:text-ink transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.post.back}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {related.map((other, i) => {
              const otherAccent = BLOG_CATEGORY_ACCENTS[other.category];
              const otherCopy = other.copy[lang];
              return (
                <FadeIn key={other.slug} delay={i} variant="scale" className="h-full">
                  <Link
                    href={`/blog/${other.slug}`}
                    className="hover-lift group h-full flex flex-col gap-2.5 rounded-[20px] border border-hairline bg-surface p-5 md:p-6"
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: otherAccent }}>
                      {BLOG_CATEGORIES[lang].find((c) => c.id === other.category)?.title}
                    </span>
                    <span className="font-semibold text-ink text-[17.5px] leading-[1.3] tracking-[-0.3px] group-hover:text-brand transition-colors">
                      {otherCopy.title}
                    </span>
                    <span className="text-[14.5px] text-ink-2 leading-[1.55] line-clamp-3">{otherCopy.lead}</span>
                    <span className="mt-auto pt-2 inline-flex items-center gap-1.5 text-[13.5px] font-medium" style={{ color: otherAccent }}>
                      {t.readLabel}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
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
