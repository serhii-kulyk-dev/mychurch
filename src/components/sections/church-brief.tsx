"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { track } from "@/lib/analytics/client";
import { useDemoModal } from "@/context/demo-modal-context";
import { ALL_GOALS, findGoal } from "@/content/builder";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Знайомство: людина каже, яка в неї церква і що хоче спростити, а ім'я
   й телефон лишає вже в модалці — одна форма контактів на весь сайт. */

/* ── Toggle chip ─────────────────────────────────────────────────── */
function Chip({
  active,
  onClick,
  icon: Icon,
  iconColor,
  className,
  children,
}: {
  active: boolean;
  onClick: () => void;
  /* Іконка бажання; без неї (розмір церкви) позначкою лишається галочка. */
  icon?: LucideIcon;
  /* Колір бажання: ним світиться іконка і ободок чипа. */
  iconColor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={
        iconColor
          ? {
              /* Яскраво, але не заливкою: колір тримають ободок, тло і сам
                 напис, а обране нижче навпаки — сіре. */
              borderColor: `color-mix(in oklab, ${iconColor} 62%, var(--surface))`,
              background: `color-mix(in oklab, ${iconColor} 13%, var(--surface))`,
              color: `color-mix(in oklab, ${iconColor} 78%, var(--ink))`,
            }
          : undefined
      }
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[13.5px] font-medium leading-none transition-colors duration-150",
        active
          ? "border-brand bg-brand-soft text-brand"
          : "border-hairline bg-surface text-ink-2 hover:text-ink hover:border-hairline-strong hover:bg-surface-2",
        className
      )}
    >
      {Icon ? (
        <Icon className="w-4 h-4 shrink-0" strokeWidth={2.2} style={iconColor ? { color: iconColor } : undefined} />
      ) : (
        active && <Check className="w-3.5 h-3.5" strokeWidth={3} />
      )}
      {children}
    </button>
  );
}

/* Один крок брифу: номер, підпис і те, що в ньому роблять. */
function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 pb-5 border-b border-hairline last:border-b-0 last:pb-0">
      <span className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full border border-hairline-strong flex items-center justify-center text-[12px] font-semibold text-ink-3 tabular-nums shrink-0">
          {n}
        </span>
        <span className="text-[16px] md:text-[17px] font-semibold text-ink leading-tight">{label}</span>
      </span>
      {children}
    </div>
  );
}

const FIELD_SHELL = cn(
  "field-shell flex flex-col gap-1.5 px-5 py-4 rounded-[14px] bg-surface border border-hairline transition-[border-color,box-shadow] duration-150 cursor-text",
  "[&:hover:not(:focus-within)]:border-hairline-strong [&:hover:not(:focus-within)]:shadow-[0px_1px_2px_rgba(0,0,0,0.06)]",
  "focus-within:border-[#007aff] focus-within:shadow-[0px_2px_4px_rgba(0,122,255,0.12)]"
);

/* Усі бажання конструктора: ярлики — у словнику, іконка й колір — від
   модуля, який це бажання вмикає. Список не вигаданий тут, він той самий,
   що й у каталозі модулів. */
/* «Новенькі» прибрано з пропозицій на прохання користувача. */
const BRIEF_GOALS = ALL_GOALS.filter((g) => g.id !== "newcomers");

/* Скільки бажань видно за раз: обрав одне — воно стає піном унизу, а на
   його місце підкидається наступне. */
const POOL = 6;

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/* ── Section ─────────────────────────────────────────────────────── */
export default function ChurchBrief() {
  const t = useT();
  const b = t.brief;
  const f = b.form;
  const { openWith } = useDemoModal();
  /* Ярлик бажання зі словника: ключі збігаються з id у конструкторі. */
  const labels = t.builder.goals as Record<string, { label: string; short?: string }>;
  /* Своє бажання: людина вписала його сама — id несе сам текст. */
  const label = (id: string) => labels[id]?.label ?? id.replace(/^own:/, "");
  /* На чипах і пінах — коротке слово, у листі лишається ціле речення. */
  const short = (id: string) => labels[id]?.short ?? label(id);

  const [size, setSize] = useState<number | null>(null);
  const [about, setAbout] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [own, setOwn] = useState("");
  const [aboutError, setAboutError] = useState<string | null>(null);
  /* Для аналітики: чи людина вже почала заповнювати бриф. */
  const startedRef = useRef(false);

  /* Видно лише кілька бажань: обране їде вниз пінами, звільняючи місце. */
  const pool = BRIEF_GOALS.filter((g) => !goals.includes(g.id)).slice(0, POOL);

  const wishes = useMemo(
    () =>
      goals.length
        ? t.builder.fromBuilder.prefix +
          goals.map((id) => lower(labels[id]?.label ?? id)).join("; ") +
          "."
        : "",
    [goals, t, labels]
  );

  /* Досить або описати церкву, або позначити бажання чипами. */
  const validateAbout = useCallback(
    (v: string, other: string) => {
      const s = v.trim();
      if (!s) return other.trim() ? null : f.errors.aboutRequired;
      if (s.length < 10) return f.errors.aboutShort;
      return null;
    },
    [f.errors]
  );

  /* Перший дотик до брифу — окремий крок у аналітиці. */
  const markStart = useCallback((field: string) => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("form_start", { source: "brief", field });
  }, []);

  const toggleGoal = (id: string) => {
    markStart("бажання");
    track("brief_goal", { label: id });
    setGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  /* Кнопка не надсилає лід, а відкриває модалку: ПІБ і телефон людина
     лишає там, разом із тим, що вже розказала тут. */
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const ae = validateAbout(about, wishes);
    setAboutError(ae);
    if (ae) {
      track("form_error", { source: "brief", field: "про церкву" });
      (ev.currentTarget as HTMLFormElement).querySelector("textarea")?.focus();
      return;
    }
    track("brief_submit", { size: size === null ? "" : f.sizes[size], goals: goals.length });
    openWith(goals, {
      about: [about.trim(), wishes].filter(Boolean).join("\n") || undefined,
      size: size === null ? undefined : f.sizes[size],
    });
  };

  return (
    <section id="brief" className="w-full flex flex-col items-center pt-12 md:pt-16 pb-16 md:pb-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          {/* Дві половини: ліворуч заголовок, праворуч — розмір, бажання
              й кілька слів про церкву. Контакти питає модалка. */}
          <div className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline bg-surface grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div
              className="relative flex items-center p-7 md:p-10 border-b lg:border-b-0 lg:border-r border-hairline overflow-hidden"
              style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--brand) 9%, var(--surface)) 0%, var(--surface-2) 100%)" }}
            >
              <div
                aria-hidden
                className="aurora-a absolute -top-32 -left-24 w-[380px] h-[320px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
              />
              <h2 className="relative font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
                {b.title} <span className="text-brand">{b.titleAccent}</span>
              </h2>
            </div>

            {/* min-w-0: рядок пінів не переносить слова, тож без цього він
                розсуває колонку і з'їдає половину із заголовком. */}
            <div className="min-w-0 p-7 md:p-10 flex flex-col justify-center">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <Step n={1} label={f.aboutLabel}>
                <div className="flex flex-col gap-2">
                  <label className={FIELD_SHELL}>
                    <textarea
                      rows={2}
                      placeholder={f.aboutPlaceholder}
                      value={about}
                      onChange={(e) => {
                        markStart("про церкву");
                        setAbout(e.target.value);
                        if (aboutError) setAboutError(validateAbout(e.target.value, wishes));
                      }}
                      className="w-full resize-none text-[16px] text-ink/[0.88] placeholder:text-[#818186] bg-transparent outline-none leading-[1.5]"
                    />
                  </label>
                  {aboutError && (
                    <p role="alert" className="text-[13px] font-medium text-[#c76a00] leading-[1.4]">
                      {aboutError}
                    </p>
                  )}
                </div>

                </Step>

                <Step n={2} label={f.sizeLabel}>
                  <div role="group" aria-label={f.sizeLabel} className="flex flex-wrap gap-2">
                  {f.sizes.map((s, i) => (
                    <Chip
                      key={s}
                      active={size === i}
                      onClick={() => {
                        markStart("розмір церкви");
                        track("brief_size", { label: s });
                        setSize(size === i ? null : i);
                      }}
                    >
                      {s}
                    </Chip>
                  ))}
                  </div>
                </Step>

                <Step n={3} label={t.builder.pickLabel}>
                  {/* Поле, у яке складаються піни: порожнє — з підказкою,
                      повне — сірими пінами з хрестиком. Самі пропозиції
                      стоять під ним двома рядами, що гортаються вбік. */}
                  <label className={cn(FIELD_SHELL, "min-h-[60px] flex-row flex-wrap items-center gap-2 py-3")}>
                    {goals.map((id) => {
                        const Icon = findGoal(id)?.Icon;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleGoal(id)}
                            aria-pressed
                            aria-label={`${label(id)} — ${f.dropHint}`}
                            className="perk-in inline-flex shrink-0 items-center gap-1.5 h-9 pl-3.5 pr-2.5 rounded-full border border-hairline bg-surface-2 text-ink-2 text-[13.5px] font-medium leading-none whitespace-nowrap transition-colors duration-150 hover:text-ink hover:border-hairline-strong"
                          >
                            {Icon && <Icon className="w-4 h-4 shrink-0 text-ink-3" strokeWidth={2.2} />}
                            {short(id)}
                            <X className="w-3.5 h-3.5 shrink-0 opacity-70" strokeWidth={2.6} />
                          </button>
                        );
                    })}
                    {/* Тут-таки можна вписати своє — Enter кладе його піном. */}
                    <input
                      type="text"
                      value={own}
                      placeholder={goals.length === 0 ? f.pickedPlaceholder : ""}
                      onChange={(e) => setOwn(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        const v = own.trim();
                        if (!v) return;
                        markStart("своє бажання");
                        setGoals((prev) => [...prev, `own:${v}`]);
                        setOwn("");
                      }}
                      className="flex-1 min-w-[160px] h-9 text-[15px] text-ink/[0.88] placeholder:text-[#818186] bg-transparent outline-none leading-none"
                    />
                  </label>

                  <div
                    role="group"
                    aria-label={t.builder.pickLabel}
                    /* Обгортаємо, а не гортаємо: короткі назви влазять у два
                       ряди, і жоден чип не вилазить за край картки. */
                    className="flex flex-wrap gap-2"
                  >
                    {pool.map((g) => (
                      <Chip
                        key={g.id}
                        active={false}
                        icon={g.Icon}
                        className="perk-in"
                        onClick={() => toggleGoal(g.id)}
                      >
                        {short(g.id)}
                      </Chip>
                    ))}
                  </div>
                </Step>

                <button
                  type="submit"
                  className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 w-full rounded-full overflow-hidden"
                >
                  <span className="relative font-semibold text-base tracking-[-0.32px] leading-[1.4] text-white">{f.submit}</span>
                  <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
