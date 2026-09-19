"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import Link from "next/link";
import { useDemoModal } from "@/context/demo-modal-context";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/lang";
import { Field } from "@/components/shared/form-field";
import { useFocusTrap } from "@/components/shared/use-focus-trap";
import { validateName, validatePhone } from "@/lib/validate";
import { sendLead, type LeadState } from "@/lib/lead";
import { track } from "@/lib/analytics/client";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/seo";

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function DemoModal() {
  const dict = useT();
  const t = dict.modal;
  const { isOpen, goals, close } = useDemoModal();
  /* Що відвідувач позначив у фінальному блоці — показуємо, щоб він бачив,
     з чим саме надсилає заявку. */
  const goalLabels = dict.builder.goals as Record<string, { label: string }>;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  /* Пастка для ботів: поле приховане від людей, але не від скриптів. */
  const [company, setCompany] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [state, setState] = useState<LeadState>("idle");

  /* Для аналітики: чи модалка вже була відкрита і чи почали писати. */
  const wasOpenRef = useRef(false);
  const startedRef = useRef(false);
  /* Засув від подвійної відправки. Стану `sending` тут замало: подвійний
     клік (або Enter разом із кліком) встигає обидва рази до перемальовки,
     і в обох обробників `state` ще "idle" — на сервер летіли два ліди. */
  const sendingRef = useRef(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollbarWidthRef = useRef(0);
  const titleId = useId();

  /* Фокус переходить у діалог і повертається на кнопку, що його відкрила. */
  useFocusTrap(windowRef, isOpen, closeRef);

  /* Кроки форми в аналітику: відкрив → почав писати → надіслав. */
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      startedRef.current = false;
      track("modal_open", { source: "demo" });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      track("modal_close", { source: "demo" });
    }
  }, [isOpen]);

  const markStart = useCallback((field: string) => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("form_start", { source: "demo", field });
  }, []);

  // Reset form after close animation completes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        sendingRef.current = false;
        setName("");
        setPhone("");
        setCompany("");
        setNameError(null);
        setPhoneError(null);
        setState("idle");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Body scroll lock with scrollbar compensation to prevent layout shift
  useEffect(() => {
    if (isOpen) {
      scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;
      // overflowY only: the shorthand would drop the body's own overflow-x: clip
      document.body.style.overflowY = "hidden";
      document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;
    } else {
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (sendingRef.current || state === "sending") return;
      const ne = validateName(name, t.errors);
      const pe = validatePhone(phone, t.errors);
      setNameError(ne);
      setPhoneError(pe);
      /* Фокус — на перше поле з помилкою, інакше клавіатурний користувач
         не дізнається, що саме не так. */
      if (ne || pe) {
        track("form_error", { source: "demo", field: ne ? "ім'я" : "телефон", error: (ne ?? pe) ?? "" });
        const form = (e.currentTarget as HTMLFormElement);
        form.querySelector<HTMLInputElement>(ne ? 'input[type="text"]' : 'input[type="tel"]')?.focus();
        return;
      }
      sendingRef.current = true;
      setState("sending");
      track("form_submit", { source: "demo" });
      try {
        const ok = await sendLead({ name, phone, company, goals, source: "demo" });
        track(ok ? "lead" : "lead_failed", { source: "demo", goals: goals.join(",") });
        setState(ok ? "sent" : "failed");
      } finally {
        /* Засув знімаємо і після невдачі — повторити спробу має бути можна. */
        sendingRef.current = false;
      }
    },
    [name, phone, company, goals, state, t.errors]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(e.target as Node)) {
        close();
      }
    },
    [close]
  );

  return (
    // Backdrop — invisible when closed so backdrop-blur is not computed by GPU
    <div
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
      className={cn(
        /* A phone in landscape (or with the keyboard up) makes this taller than
           the screen — the backdrop scrolls so the submit button stays reachable. */
        "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain px-5 py-6",
        "bg-black/40",
        "transition-[opacity,visibility] duration-200",
        isOpen
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      )}
    >
      {/* Window — will-change promotes GPU layer before animation starts */}
      <div
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ willChange: "opacity, transform" }}
        className={cn(
          "relative bg-surface rounded-[24px] border border-hairline-strong",
          "shadow-[0px_2px_2px_0px_rgba(0,0,0,0.06)]",
          "w-full max-w-[472px] my-auto shrink-0",
          "px-5 sm:px-[44px] py-8 sm:py-[48px]",
          "flex flex-col gap-[36px]",
          // transition-[opacity,transform] instead of transition-all — only what moves
          "transition-[opacity,transform] duration-200",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={close}
          aria-label={t.close}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {state === "sent" ? (
          /* Success state */
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-[#0063d1] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                <path d="M7 16.5L13 22.5L25 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h2 id={titleId} className="font-semibold text-ink text-[28px] sm:text-[34px] leading-[1.2] tracking-[-0.84px] sm:tracking-[-1.02px]">
                {t.successTitle}
              </h2>
              <p className="text-base text-ink-2 leading-[1.5]">
                {t.successText}
              </p>
            </div>
            <button
              onClick={close}
              className="mt-2 btn-primary btn-brand group relative flex items-center justify-center h-12 px-9 rounded-full overflow-hidden"
            >
              <span className="relative text-white font-semibold text-base tracking-[-0.32px] leading-[1.4]">
                {t.close}
              </span>
            </button>
          </div>
        ) : (
          <>
            {/* Header text */}
            <div className="flex flex-col gap-3 text-center">
              <h2 id={titleId} className="font-semibold text-ink text-[28px] sm:text-[34px] leading-[1.28] tracking-[-0.84px] sm:tracking-[-1.02px]">
                {t.title}
              </h2>
              <p className="text-base text-ink-2 leading-[1.5]">
                {t.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
              {goals.length > 0 && (
                <div className="flex flex-col gap-2 -mt-3">
                  <span className="text-[13px] font-medium text-ink-2">{t.goalsLabel}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {goals.map((id) => (
                      <span
                        key={id}
                        className="inline-flex items-center rounded-full border border-hairline bg-surface-2 px-2.5 py-1.5 text-[12.5px] font-medium leading-none text-ink"
                      >
                        {goalLabels[id]?.label ?? id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-4">
                <Field
                  kind="name"
                  placeholder={t.namePlaceholder}
                  value={name}
                  error={nameError}
                  onChange={(v) => {
                    setName(v);
                    markStart("ім'я");
                    if (nameError) setNameError(validateName(v, t.errors));
                  }}
                />
                <Field
                  kind="tel"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  error={phoneError}
                  onChange={(v) => {
                    setPhone(v);
                    markStart("телефон");
                    if (phoneError) setPhoneError(validatePhone(v, t.errors));
                  }}
                />
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
              </div>

              <div className="flex flex-col gap-8">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="btn-primary btn-brand group relative flex items-center justify-center h-12 w-full rounded-full overflow-hidden disabled:opacity-70"
                >
                  <span className="relative text-white font-semibold text-base tracking-[-0.32px] leading-[1.4]">
                    {state === "sending" ? t.sending : t.submit}
                  </span>
                </button>

                {/* Нічого не доїхало — показуємо запасні канали, а не «дякуємо». */}
                {state === "failed" && (
                  <div role="alert" className="flex flex-col gap-1 text-center">
                    <span className="text-[14px] font-semibold text-[#c76a00]">{t.failedTitle}</span>
                    <span className="text-[13.5px] text-ink-2 leading-[1.5]">
                      {t.failedText}{" "}
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

                {/* Legal */}
                <p className="text-[12px] text-ink-2 leading-[1.5] text-center">
                  {t.consentPrefix}{" "}
                  <Link href="/terms" className="font-medium text-ink-2 hover:underline underline-offset-2">{t.consentTerms}</Link>
                  {" "}{t.consentAnd}{" "}
                  <Link href="/privacy" className="font-medium text-ink-2 hover:underline underline-offset-2">{t.consentPrivacy}</Link>.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
