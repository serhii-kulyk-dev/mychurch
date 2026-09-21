"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Один плеєр для всіх демо-записів: сторінка модуля, сторінка
   амбасадора і блок амбасадора на головній мали по власній копії, і
   всі три вантажили Drive.

   Чому не Drive: його «preview» на телефоні — чужий плеєр у рамці з
   дрібними контролами, ще й з екраном «запросити доступ» у того, хто
   зайшов з іншого Google-акаунта. YouTube віддає рідний мобільний
   плеєр: велика кнопка, фулскрін, перемотка пальцем і якість під
   мережу.

   До тапу в сторінці немає жодного запиту до YouTube — лише наш
   постер. Тому й немає ні cookies, ні ваги чужого плеєра на кожному
   відкритті сторінки.
   ──────────────────────────────────────────────────────────────── */

/** Розігріваємо з'єднання, коли палець тільки торкнувся картки. */
let warmed = false;
function warm() {
  if (warmed || typeof document === "undefined") return;
  warmed = true;
  for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com", "https://fonts.gstatic.com"]) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function ClipPlayer({
  videoId,
  poster,
  title,
  label,
  accent,
  size = "lg",
  badge,
  cta,
  onPlay,
  className,
}: {
  videoId: string;
  poster?: string;
  title: string;
  /** Що промовляє скрінрідер на кнопці; за замовчуванням — назва запису. */
  label?: string;
  accent: string;
  size?: "md" | "lg";
  /** Напис у кутку постера — «Відео». */
  badge?: string;
  /** Текст на кнопці. З ним кнопка — таблетка на всю фразу, без нього — коло. */
  cta?: string;
  /** Головна перезапускає курсор-привид, коли запис почали дивитись. */
  onPlay?: () => void;
  className?: string;
}) {
  const { lang } = useLang();
  const [playing, setPlaying] = useState(false);

  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    /* Після ролика — тільки інші наші ж записи, а не чужий канал. */
    rel: "0",
    /* YouTube знає українську як «uk»; наш код локалі — «ua». */
    hl: lang === "ua" ? "uk" : lang,
  });

  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden bg-ink",
        className
      )}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            onPlay?.();
          }}
          onPointerEnter={warm}
          onTouchStart={warm}
          aria-label={label ?? title}
          /* touch-manipulation прибирає пів секунди очікування подвійного
             тапу — без нього перше натискання на телефоні «не помічають». */
          className="group absolute inset-0 w-full h-full cursor-pointer touch-manipulation"
        >
          {poster ? (
            <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" />
          ) : (
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              unoptimized
              className="object-cover"
            />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
          {badge && (
            <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white leading-none backdrop-blur">
              {badge}
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            {cta ? (
              /* data-demo — щоб курсор-привид знав, куди йти; поза
                 CursorDemo атрибут просто лежить без діла. */
              <span
                data-demo="hover"
                className="flex items-center gap-3 h-14 md:h-16 pl-3 pr-6 md:pl-3.5 md:pr-8 rounded-full text-white shadow-[0_14px_36px_-12px_rgba(0,0,0,0.65)] transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-95"
                style={{ background: accent }}
              >
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 md:w-[18px] md:h-[18px] fill-current translate-x-[1px]" strokeWidth={0} />
                </span>
                <span className="font-semibold text-[16px] md:text-[18px] tracking-[-0.3px] whitespace-nowrap">
                  {cta}
                </span>
              </span>
            ) : (
              <span
                data-demo="hover"
                className={cn(
                  "rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95",
                  size === "lg" ? "w-[72px] h-[72px] md:w-16 md:h-16" : "w-[68px] h-[68px] md:w-14 md:h-14"
                )}
                style={{ background: accent }}
              >
                <Play
                  className={cn(size === "lg" ? "w-7 h-7" : "w-6 h-6", "fill-current translate-x-[1px]")}
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
