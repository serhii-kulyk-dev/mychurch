/* Клієнтська частина відправки ліда. Один шлях для модалки демо і для брифу,
   щоб стан кнопки й обробка помилок були однакові в обох формах.

   Сайт статичний, свого роуту /api/lead більше немає: токен бота нікуди
   покласти, крім сервера, а сервера в нас тут немає. Тому заявка йде на
   зовнішній приймач — це він тримає токен і пише в Telegram.

   ENV:
     NEXT_PUBLIC_LEAD_ENDPOINT — повна адреса приймача (POST, JSON)

   Поки адреса не задана, відправка чесно повертає false, і форма показує
   запасні контакти замість «дякуємо» — краще, ніж мовчазна порожнеча. */

export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "";

export interface LeadInput {
  name: string;
  phone: string;
  source: "demo" | "brief";
  about?: string;
  size?: string;
  tools?: string[];
  /** Ідентифікатори цілей, позначених у фінальному блоці. */
  goals?: string[];
  /** Пастка для ботів — має лишатись порожньою. */
  company?: string;
}

export type LeadState = "idle" | "sending" | "sent" | "failed";

export async function sendLead(input: LeadInput): Promise<boolean> {
  if (!LEAD_ENDPOINT) return false;
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        page: typeof location !== "undefined" ? location.pathname : undefined,
        lang: typeof document !== "undefined" ? document.documentElement.dataset.lang : undefined,
      }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    /* Свій приймач відповідає {ok:true}; сторонні сервіси часто просто
       віддають 200 — обом віримо, якщо статус успішний. */
    return res.ok && data?.ok !== false;
  } catch {
    return false;
  }
}
