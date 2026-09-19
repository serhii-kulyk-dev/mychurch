/* Клієнтська частина відправки ліда. Один шлях для модалки демо і для брифу,
   щоб стан кнопки й обробка помилок були однакові в обох формах. */

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
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        page: typeof location !== "undefined" ? location.pathname : undefined,
        lang: typeof document !== "undefined" ? document.documentElement.dataset.lang : undefined,
      }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return res.ok && data?.ok === true;
  } catch {
    return false;
  }
}
