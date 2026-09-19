import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "@/components/admin/nav";

/* Кабінет аналітики. Живе поза лендінгом: без навбару сайту,
   без футера, без трекера — себе ми не рахуємо.               */

export const metadata: Metadata = {
  title: "Аналітика — Моя Церква",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-page text-ink">
      <header className="sticky top-0 z-30 border-b border-hairline bg-page/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-brand text-base font-extrabold tracking-tight">
              <span className="text-brand">Моя</span> Церква
            </span>
            <span className="text-sm text-ink-3">аналітика</span>
          </Link>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-5 py-6">{children}</main>
    </div>
  );
}
