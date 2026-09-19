"use client";

import { FileSpreadsheet, FileJson, FileText } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { IMPORT_COPY } from "@/content/import";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Два зустрічні рядки з іменами реальних файлів — так виглядає
   «база церкви» до переходу в систему. Читається як безлад, який
   можна просто закинути, а не як перелік підтримуваних форматів.
   ──────────────────────────────────────────────────────────────── */

function icon(name: string) {
  if (name.endsWith(".json")) return FileJson;
  if (name.endsWith(".txt") || name.endsWith(".vcf")) return FileText;
  return FileSpreadsheet;
}

function Row({ files, reverse }: { files: string[]; reverse?: boolean }) {
  const track = [...files, ...files];
  return (
    <div className="marquee">
      <div className={reverse ? "marquee-track marquee-track--reverse" : "marquee-track"}>
        {track.map((name, i) => {
          const Icon = icon(name);
          return (
            <span
              key={`${name}-${i}`}
              aria-hidden={i >= files.length}
              className="chip-module inline-flex items-center gap-2.5 rounded-full bg-surface border border-hairline pl-2 pr-4 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <span className="w-7 h-7 rounded-full bg-surface-3 text-ink-2 flex items-center justify-center shrink-0">
                <Icon className="w-[14px] h-[14px]" strokeWidth={1.9} />
              </span>
              <span className="text-[13.5px] font-medium text-ink leading-none tracking-[-0.15px] whitespace-nowrap">
                {name}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ImportSources() {
  const { lang } = useLang();
  const c = IMPORT_COPY[lang].sources;
  const half = Math.ceil(c.files.length / 2);

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page border-y border-hairline overflow-hidden">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />
      </div>

      <FadeIn className="w-full flex flex-col gap-2.5 py-8 md:py-10">
        <Row files={c.files.slice(0, half)} />
        <Row files={c.files.slice(half)} reverse />
      </FadeIn>

      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {c.points.map((p, i) => (
            <FadeIn
              key={p.title}
              delay={i}
              className="flex flex-col gap-2 py-5 md:py-0 md:px-7 first:md:pl-0 last:md:pr-0 border-t md:border-t-0 md:border-l border-hairline first:border-t-0 first:md:border-l-0"
            >
              <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.3px]">{p.title}</h3>
              <p className="text-[15px] text-ink-2 leading-[1.55]">{p.text}</p>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={2}>
          <p className="text-[14.5px] text-ink-3 leading-[1.55] max-w-[720px] pl-4 border-l-2 border-brand/40">{c.note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
