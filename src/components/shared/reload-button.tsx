"use client";

import { useT } from "@/lib/lang";

export default function ReloadButton({ className }: { className?: string }) {
  const t = useT();
  return (
    <button onClick={() => window.location.reload()} className={className}>
      <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
      <span className="relative text-ink-2 font-medium text-base tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
        {t.notFound.reload}
      </span>
    </button>
  );
}
