import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_DAYS, checkPassword, createToken, isConfigured } from "@/lib/analytics/auth";
import { clientIp, createLimiter } from "@/lib/rate-limit";

/* Вхід у кабінет. Звичайна HTML-форма: працює навіть якщо
   JavaScript не завантажився.                                */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Підбирати пароль неприємно: 10 спроб на адресу за 10 хвилин,
   і не більше 60 спроб на весь процес — щоб перебір з багатьох
   адрес теж упирався в стелю. Живих людей тут одиниці. */
const WINDOW_MS = 10 * 60 * 1000;
const byIp = createLimiter({ limit: 10, windowMs: WINDOW_MS, maxKeys: 5_000 });
const overall = createLimiter({ limit: 60, windowMs: WINDOW_MS });

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  const back = (error: string) => NextResponse.redirect(new URL(`/admin/login?e=${error}`, request.url), 303);

  if (!isConfigured()) return back("off");
  if (byIp.check(clientIp(request.headers) || "unknown")) return back("many");
  if (overall.check("all")) {
    console.error("[admin] забагато спроб входу загалом — схоже на перебір");
    return back("many");
  }
  if (!(await checkPassword(password))) return back("bad");

  /* За зворотним проксі (nginx, Caddy) до застосунку приходить http://,
     хоч зовні сайт працює по https — і кука входу поїхала б без Secure,
     тобто й відкритим каналом. Питаємо проксі, яка схема була назовні.
     Підробка цього заголовка вміє тільки додати Secure зайвий раз, тож
     у небезпечний бік вона не грає. */
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    new URL(request.url).protocol.replace(":", "");

  const response = NextResponse.redirect(new URL(next.startsWith("/admin") ? next : "/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, await createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return response;
}
