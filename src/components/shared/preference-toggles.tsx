"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/lang";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Theme switch + UA/EN switch, shared by the desktop bar and the mobile drawer. */
export default function PreferenceToggles({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useLang();
  const t = i18n[lang].common;

  const h = size === "sm" ? "h-8" : "h-9";
  const pad = size === "sm" ? "px-2" : "px-2.5";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Language */}
      <div
        className={cn(
          "flex items-center rounded-full border border-hairline bg-surface-2 p-0.5",
          h
        )}
        role="group"
        aria-label={t.langLabel}
      >
        {(["ua", "en"] as const).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={cn(
              "h-full rounded-full text-[12.5px] font-semibold uppercase leading-none transition-colors duration-200",
              pad,
              lang === code
                /* Заливка під білим текстом має свій, темніший відтінок:
                   на світло-блакитному білий дає 2.86:1. */
                ? "bg-[var(--cta-default)] text-white"
                : "text-ink-3 hover:text-ink-2"
            )}
          >
            {/* Рядок центрується за метриками шрифту, а не за висотою великих
                літер, тож «UA/EN» сідають на ~0.6px вище центру пігулки. */}
            <span className="inline-block translate-y-[0.5px]">{code}</span>
          </button>
        ))}
      </div>

      {/* Theme */}
      <button
        onClick={toggle}
        aria-label={theme === "dark" ? t.toLight : t.toDark}
        title={theme === "dark" ? t.toLight : t.toDark}
        className={cn(
          "relative flex items-center justify-center aspect-square rounded-full border border-hairline bg-surface-2 text-ink-2 transition-colors duration-200 hover:text-ink hover:bg-surface-3 overflow-hidden",
          h
        )}
      >
        <Sun
          className={cn(
            "absolute w-[17px] h-[17px] transition-all duration-300",
            theme === "dark" ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          )}
          strokeWidth={2}
        />
        <Moon
          className={cn(
            "absolute w-[16px] h-[16px] transition-all duration-300",
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          )}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}
