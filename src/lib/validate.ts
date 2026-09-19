import type { Dict } from "@/lib/i18n";

type Errors = Dict["modal"]["errors"];

/* Shared by the demo modal and the church-brief form. */

export function validateName(value: string, e: Errors): string | null {
  const v = value.trim();
  if (!v) return e.nameRequired;
  if (/\d/.test(v)) return e.nameLetters;
  if (v.length < 2) return e.nameShort;
  if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ''\-\s]+$/.test(v)) return e.nameLetters;
  return null;
}

export function validatePhone(value: string, e: Errors): string | null {
  const v = value.trim();
  if (!v) return e.phoneRequired;
  const digits = v.replace(/\D/g, "");
  const hasPlus = v.startsWith("+");
  if (!hasPlus && digits.length < 8) return e.phoneShortNoCode;
  if (!hasPlus) return e.phoneNoCode;
  if (digits.length < 10) return e.phoneShort;
  if (!/^\+[\d\s\-().]{9,20}$/.test(v)) return e.phoneInvalid;
  return null;
}
