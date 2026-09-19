import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/analytics/auth";

/* Охорона кабінету аналітики. Перевірка тут дешева (тільки підпис
   куки) — вона відсікає чужих ще до рендера сторінок зі звітом.   */

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const OPEN = new Set(["/admin/login", "/api/admin/login"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!OPEN.has(pathname) && !(await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  /* Кабінет не має світитись у пошуку навіть випадково. */
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  return response;
}
