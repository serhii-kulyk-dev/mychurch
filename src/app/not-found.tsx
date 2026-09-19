"use client";

import Link from "next/link";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import ReloadButton from "@/components/shared/reload-button";
import { useT } from "@/lib/lang";

export default function NotFound() {
  const t = useT();
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 flex flex-col items-center justify-center bg-page gap-10 px-4 py-24">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.notFound.label}</p>
          <h1 className="font-semibold text-ink text-[36px] leading-[1.2] tracking-[-1.08px]">{t.notFound.title}</h1>
          <p className="text-base text-ink-2 leading-[1.5]">{t.notFound.text}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Link href="/" className="btn-primary btn-brand group relative flex items-center justify-center h-12 px-9 rounded-full overflow-hidden">
            <span className="relative text-white font-semibold text-base tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
              {t.common.backHome}
            </span>
          </Link>
          <ReloadButton className="btn-secondary relative flex items-center justify-center h-12 px-9 rounded-full overflow-hidden border border-hairline-strong" />
        </div>
      </main>
      <Footer />
    </>
  );
}
