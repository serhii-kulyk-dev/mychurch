"use client";

import { useId } from "react";
import { User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/* Which field this is — decides the icon, the autofill hint and the keyboard
   a phone opens. Placeholder alone is not a label: the input carries a real
   <label>, visually hidden so the layout stays the same. */
type FieldKind = "name" | "tel";

interface FieldProps {
  kind: FieldKind;
  /** Both the visible placeholder and the accessible name. */
  placeholder: string;
  value: string;
  error: string | null;
  onChange: (v: string) => void;
  /** Опційно: підпис для скрінрідера, якщо він має відрізнятись від плейсхолдера. */
  label?: string;
}

const KIND = {
  name: { Icon: User, type: "text", autoComplete: "name", inputMode: undefined },
  tel: { Icon: Phone, type: "tel", autoComplete: "tel", inputMode: "tel" as const },
} satisfies Record<FieldKind, { Icon: typeof User; type: string; autoComplete: string; inputMode?: "tel" }>;

/* One-line text input, used by the demo modal and the church-brief form.
   Назву церкви тут не питаємо: вона є лише у формі знайомства, першим
   питанням — «як називається церква та трохи про себе». */
export function Field({ kind, placeholder, value, error, onChange, label }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const { Icon, type, autoComplete, inputMode } = KIND[kind];

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          "field-shell flex items-center gap-4 h-[52px] px-5 rounded-[14px] bg-surface border transition-[border-color,box-shadow] duration-150 cursor-text",
          "[&:hover:not(:focus-within)]:border-hairline-strong [&:hover:not(:focus-within)]:shadow-[0px_1px_2px_rgba(0,0,0,0.06)]",
          "focus-within:border-[#007aff] focus-within:shadow-[0px_2px_4px_rgba(0,122,255,0.12)]",
          error ? "border-[#c76a00]" : "border-hairline"
        )}
      >
        <Icon aria-hidden className="w-[18px] h-[18px] shrink-0 text-ink-3" strokeWidth={2} />
        <span className="sr-only">{label ?? placeholder}</span>
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          /* Код країни ставимо самі: людина дотикається поля — і вже має «+380»,
             далі набирає тільки свій номер. Валідатор і лід бачать повний
             номер, як і раніше. */
          onFocus={kind === "tel" && !value ? () => onChange("+380") : undefined}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="flex-1 min-w-0 text-[16px] text-ink/[0.88] placeholder:text-[#6f6f75] bg-transparent outline-none leading-[1.4] cursor-text"
        />
      </label>
      {/* role="alert" — помилку має почути й той, хто не бачить поля. */}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-[#c76a00] leading-[1.4]">
          {error}
        </p>
      )}
    </div>
  );
}
