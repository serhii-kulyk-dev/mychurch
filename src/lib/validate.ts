import type { Dict } from "@/lib/i18n";
import { UA_PREFIX, phoneDigits } from "@/lib/input-format";

type Errors = Dict["modal"]["errors"];

/* Одна перевірка на обидві форми — модалку демо і бриф на головній.
   Ім'я, назву церкви й розповідь про себе не перевіряємо взагалі: людина
   пише стільки, скільки хоче, а форма не сперечається. Номер — інша річ:
   без нього заявка нікуди не веде. */

/* Поле телефону тепер тримає маску «+380 XX XXX XX XX», тож лишається
   перевірити рівно два випадки: нічого не ввели і не добрали цифр. */
export function validatePhone(value: string, e: Errors): string | null {
  const v = value.trim();
  if (!v || v === UA_PREFIX) return e.phoneRequired;
  if (phoneDigits(v).length < 9) return e.phoneShort;
  return null;
}
