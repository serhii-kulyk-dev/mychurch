"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, LayoutGrid, Sparkles } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { Field } from "@/components/shared/form-field";
import { MODULE_ICONS } from "@/components/shared/module-icons";
import { useBuilder } from "@/context/builder-context";
import { validateName, validatePhone } from "@/lib/validate";
import { sendLead, type LeadState } from "@/lib/lead";
import { track } from "@/lib/analytics/client";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/seo";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

/* Bottom of the modules page: the visitor describes their church and we propose
   a module set. Submission goes through the same sendLead() as the demo modal. */

function moduleName(t: Dict, id: string) {
  for (const g of t.modules.groups) {
    const item = g.items.find((i) => i.id === id);
    if (item) return item.name;
  }
  return id;
}

/* ── Toggle chip ─────────────────────────────────────────────────── */
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[13.5px] font-medium leading-none transition-colors duration-150",
        active
          ? "border-brand bg-brand-soft text-brand"
          : "border-hairline bg-surface text-ink-2 hover:text-ink hover:border-hairline-strong hover:bg-surface-2"
      )}
    >
      {active && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      {children}
    </button>
  );
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

/* ── What the visitor gets: a small mock of a proposed set ──────── */
function SetRow({ t, label, ids, muted }: { t: Dict; label: string; ids: string[]; muted?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const Icon = MODULE_ICONS[id] ?? LayoutGrid;
          return (
            <span
              key={id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12.5px] font-medium leading-none border",
                muted
                  ? "border-dashed border-hairline-strong text-ink-3"
                  : "border-hairline bg-surface-2 text-ink"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", muted ? "text-ink-3" : "text-brand")} strokeWidth={2.2} />
              {moduleName(t, id)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ExampleSet({ t }: { t: Dict }) {
  const b = t.brief.example;
  return (
    <div className="rounded-2xl bg-surface border border-hairline shadow-[0_12px_28px_-18px_rgba(0,0,0,0.35)] p-4 md:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{b.label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-medium text-brand leading-none">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
          {b.tag}
        </span>
      </div>
      <p className="text-[14.5px] text-ink leading-[1.4]">{b.church}</p>
      <SetRow t={t} label={b.start} ids={b.startItems} />
      <SetRow t={t} label={b.later} ids={b.laterItems} muted />
    </div>
  );
}

/* ── What the visitor actually built in the constructor above ───── */
function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function BuiltSet({ t, goals, start, later }: { t: Dict; goals: string[]; start: string[]; later: string[] }) {
  const fb = t.builder.fromBuilder;
  const e = t.brief.example;
  return (
    <div className="rounded-2xl bg-surface border border-hairline shadow-[0_12px_28px_-18px_rgba(0,0,0,0.35)] p-4 md:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{fb.label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-medium text-brand leading-none">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
          {fb.tag}
        </span>
      </div>
      <p className="text-[14.5px] text-ink leading-[1.4]">
        {goals.map((id) => lower(t.builder.goals[id as keyof typeof t.builder.goals].label)).join(" · ")}
      </p>
      <SetRow t={t} label={e.start} ids={start} />
      {later.length > 0 && <SetRow t={t} label={e.later} ids={later} muted />}
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export default function ChurchBrief() {
  const t = useT();
  const b = t.brief;
  const f = b.form;
  const modalErrors = t.modal.errors;

  const [size, setSize] = useState<number | null>(null);
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [state, setState] = useState<LeadState>("idle");
  const submitted = state === "sent";
  /* Для аналітики: чи людина вже почала заповнювати бриф. */
  const startedRef = useRef(false);
  /* Засув від подвійної відправки: `state` оновлюється до перемальовки,
     а два кліки поспіль встигають в один такт — і лід ішов двічі. */
  const sendingRef = useRef(false);

  /* A set assembled in the constructor above fills the brief in: the visitor
     sees their own set here, and the message starts written for them. */
  const { goals, set } = useBuilder();
  const [touched, setTouched] = useState(false);
  const wishes = useMemo(
    () =>
      goals.length
        ? t.builder.fromBuilder.prefix +
          goals.map((id) => lower(t.builder.goals[id as keyof typeof t.builder.goals].label)).join("; ") +
          "."
        : "",
    [goals, t]
  );

  /* Поки людина не почала правити текст, він іде за набором із конструктора.
     Підлаштовуємо під час рендера, а не в ефекті: інакше перший кадр показував
     би старий текст, і поле смикалось би на очах. Порожній початковий маркер
     збігається з порожнім `wishes` на монтуванні — тоді нічого не робимо. */
  const [syncedWishes, setSyncedWishes] = useState("");
  if (syncedWishes !== wishes) {
    setSyncedWishes(wishes);
    if (!touched) setAbout(wishes);
  }

  const validateAbout = useCallback(
    (v: string) => {
      const s = v.trim();
      if (!s) return f.errors.aboutRequired;
      if (s.length < 10) return f.errors.aboutShort;
      return null;
    },
    [f.errors]
  );

  const reset = () => {
    setSize(null);
    setAbout(wishes);
    setTouched(false);
    setName("");
    setPhone("");
    setAboutError(null);
    setNameError(null);
    setPhoneError(null);
    setCompany("");
    setState("idle");
    sendingRef.current = false;
  };

  /* Перший дотик до брифу — окремий крок у аналітиці: далі видно,
     скільки людей почали заповнювати й скільки дійшли до кінця. */
  const markStart = useCallback((field: string) => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("form_start", { source: "brief", field });
  }, []);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (sendingRef.current || state === "sending") return;
    const ae = validateAbout(about);
    const ne = validateName(name, modalErrors);
    const pe = validatePhone(phone, modalErrors);
    setAboutError(ae);
    setNameError(ne);
    setPhoneError(pe);
    /* Фокус — на перше поле з помилкою. */
    if (ae || ne || pe) {
      track("form_error", { source: "brief", field: ae ? "про церкву" : ne ? "ім'я" : "телефон" });
      const form = ev.currentTarget as HTMLFormElement;
      const selector = ae ? "textarea" : ne ? 'input[type="text"]' : 'input[type="tel"]';
      form.querySelector<HTMLTextAreaElement | HTMLInputElement>(selector)?.focus();
      return;
    }
    sendingRef.current = true;
    setState("sending");
    track("form_submit", { source: "brief", size: size === null ? "" : f.sizes[size], goals: goals.length });
    try {
      const ok = await sendLead({
        name,
        phone,
        company,
        source: "brief",
        about,
        size: size === null ? undefined : f.sizes[size],
      });
      track(ok ? "lead" : "lead_failed", { source: "brief" });
      setState(ok ? "sent" : "failed");
    } finally {
      /* Засув знімаємо і після невдачі — повторити спробу має бути можна. */
      sendingRef.current = false;
    }
  };

  return (
    <section id="brief" className="w-full flex flex-col items-center pt-12 md:pt-16 pb-16 md:pb-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          <div className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline bg-surface grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Copy + example */}
            <div
              className="relative flex flex-col gap-7 p-7 md:p-12 border-b lg:border-b-0 lg:border-r border-hairline overflow-hidden"
              style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--brand) 9%, var(--surface)) 0%, var(--surface-2) 100%)" }}
            >
              <div
                aria-hidden
                className="aurora-a absolute -top-32 -left-24 w-[380px] h-[320px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
              />

              <div className="relative flex flex-col gap-4">
                <h2 className="font-semibold text-ink text-[28px] md:text-[36px] leading-[1.12] tracking-[-0.9px] md:tracking-[-1.2px]">{b.title}</h2>
                <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.55]">{b.text}</p>
              </div>

              <FadeIn delay={1} variant="scale" className="relative">
                {goals.length > 0 ? <BuiltSet t={t} goals={goals} start={set.start} later={set.later} /> : <ExampleSet t={t} />}
              </FadeIn>

              <p className="relative text-[13px] text-ink-3 leading-[1.4]">{b.note}</p>
            </div>

            {/* Form */}
            <div className="p-7 md:p-12 flex flex-col justify-center">
              {submitted ? (
                <div className="flex flex-col items-center gap-6 py-6 text-center">
                  <div className="w-[72px] h-[72px] rounded-full bg-brand flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                      <path d="M7 16.5L13 22.5L25 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-ink text-[30px] leading-[1.2] tracking-[-0.9px]">{f.successTitle}</h3>
                    <p className="text-base text-ink-2 leading-[1.5] max-w-[380px]">{f.successText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="btn-secondary relative flex items-center justify-center h-11 px-6 rounded-full overflow-hidden border border-hairline-strong"
                  >
                    <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
                    <span className="relative text-ink-2 font-medium text-[15px] tracking-[-0.3px]">{f.again}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                  <ChipGroup label={f.sizeLabel}>
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
                  </ChipGroup>

                  <div className="flex flex-col gap-2">
                    <label
                      className={cn(
                        "flex flex-col gap-1.5 px-5 py-4 rounded-[14px] bg-surface border transition-[border-color,box-shadow] duration-150 cursor-text",
                        "[&:hover:not(:focus-within)]:border-hairline-strong [&:hover:not(:focus-within)]:shadow-[0px_1px_2px_rgba(0,0,0,0.06)]",
                        "focus-within:border-[#007aff] focus-within:shadow-[0px_2px_4px_rgba(0,122,255,0.12)]",
                        "border-hairline"
                      )}
                    >
                      <span className="text-[13px] font-medium text-ink-2">{f.aboutLabel}</span>
                      <textarea
                        rows={4}
                        placeholder={f.aboutPlaceholder}
                        value={about}
                        onChange={(e) => {
                          setTouched(true);
                          markStart("про церкву");
                          setAbout(e.target.value);
                          if (aboutError) setAboutError(validateAbout(e.target.value));
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      kind="name"
                      placeholder={f.namePlaceholder}
                      value={name}
                      error={nameError}
                      onChange={(v) => {
                        setName(v);
                        markStart("ім'я");
                        if (nameError) setNameError(validateName(v, modalErrors));
                      }}
                    />
                    <Field
                      kind="tel"
                      placeholder={f.phonePlaceholder}
                      value={phone}
                      error={phoneError}
                      onChange={(v) => {
                        setPhone(v);
                        markStart("телефон");
                        if (phoneError) setPhoneError(validatePhone(v, modalErrors));
                      }}
                    />
                  </div>

                  {/* Honeypot: поза потоком і поза табом, людина його не бачить. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="absolute w-px h-px -left-[9999px] opacity-0"
                  />

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 w-full rounded-full overflow-hidden disabled:opacity-70"
                    >
                      <span className="relative text-white font-semibold text-base tracking-[-0.32px] leading-[1.4]">
                        {state === "sending" ? f.sending : f.submit}
                      </span>
                      <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>

                    {/* Нічого не доїхало — показуємо запасні канали, а не «дякуємо». */}
                    {state === "failed" && (
                      <div role="alert" className="flex flex-col gap-1 text-center">
                        <span className="text-[14px] font-semibold text-[#c76a00]">{f.failedTitle}</span>
                        <span className="text-[13.5px] text-ink-2 leading-[1.5]">
                          {f.failedText}{" "}
                          <a href={`tel:${SITE_PHONE}`} className="font-medium text-ink underline underline-offset-2">
                            {SITE_PHONE}
                          </a>
                          {" · "}
                          <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-ink underline underline-offset-2">
                            {SITE_EMAIL}
                          </a>
                        </span>
                      </div>
                    )}
                    <p className="text-[12px] text-ink-3 leading-[1.5] text-center">
                      {f.consentPrefix}{" "}
                      <Link href="/terms" className="font-medium text-ink-2 hover:underline underline-offset-2">{t.modal.consentTerms}</Link>
                      {" "}{t.modal.consentAnd}{" "}
                      <Link href="/privacy" className="font-medium text-ink-2 hover:underline underline-offset-2">{t.modal.consentPrivacy}</Link>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
