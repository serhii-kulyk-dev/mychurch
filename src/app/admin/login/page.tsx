import { isConfigured } from "@/lib/analytics/auth";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  bad: "Пароль не підійшов.",
  many: "Забагато спроб. Спробуйте за кілька хвилин.",
  off: "Кабінет вимкнено: не задано ANALYTICS_PASSWORD.",
};

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; next?: string }>;
}) {
  const { e, next } = await searchParams;
  const error = e ? ERRORS[e] ?? ERRORS.bad : null;

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-xl font-semibold text-ink">Вхід в аналітику</h1>
      <p className="mt-1 text-sm text-ink-3">Сторінка закрита паролем — сюди заходять тільки свої.</p>

      {!isConfigured() ? (
        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-4 text-sm text-ink-2">
          <p className="font-medium text-ink">Кабінет ще не налаштовано.</p>
          <p className="mt-2">
            Додайте у <code className="rounded bg-surface-3 px-1">.env.local</code> рядок{" "}
            <code className="rounded bg-surface-3 px-1">ANALYTICS_PASSWORD=…</code> і перезапустіть сервер.
          </p>
        </div>
      ) : (
        <form action="/api/admin/login" method="post" className="mt-6 space-y-3">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <label className="block text-sm text-ink-2" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 text-ink outline-none focus:border-brand"
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-deep"
          >
            Увійти
          </button>
        </form>
      )}
    </div>
  );
}
