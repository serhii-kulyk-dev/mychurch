"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Один плеєр для всіх демо-записів: сторінка модуля, сторінка
   амбасадора і блок амбасадора на головній мали по власній копії.

   Записи лежать у нас на хостингу (`/clips/<модуль>.mp4`) і грають
   рідним плеєром телефона: велика кнопка, фулскрін, перемотка
   пальцем, AirPlay, картинка в картинці. Дорогою сюди були ще два
   варіанти, обидва погані на телефоні:

   — Google Drive: чужий плеєр у рамці з дрібними контролами, а в
     кого інший Google-акаунт — «запросити доступ» замість відео;
   — YouTube: плеєр непоганий, але то чужа рамка, свої кнопки поверх
     кадру і другий тап, бо iOS не дає автоплей у чужому iframe.

   Прохід на YouTube лишився (`videoId`) — якщо колись вирішимо не
   роздавати відео зі свого хостингу, міняється лише джерело.

   До тапу не вантажиться жодного байта: `preload="none"`, на екрані
   тільки наш кадр. Сам кадр лишається на місці, доки не пішов перший
   кадр відео, — інакше між тапом і картинкою стоїть порожній
   прямокутник (а в темній темі він був ще й білий, бо підкладкою
   був `bg-ink`, а --ink у темній темі майже білий).
   ──────────────────────────────────────────────────────────────── */

/** Розігріваємо з'єднання з YouTube, коли палець торкнувся картки. */
let warmed = false;
function warm() {
  if (warmed || typeof document === "undefined") return;
  warmed = true;
  for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com"]) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function ClipPlayer({
  src,
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
  /** Запис у нас на хостингу — `/clips/people.mp4`. */
  src?: string;
  /** Запасний шлях: ролик на YouTube. Працює, лише якщо немає `src`. */
  videoId?: string;
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
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  /* Готовність = пішов перший кадр. Доки ні — тримаємо постер. */
  const [ready, setReady] = useState(false);

  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    /* Після ролика — тільки інші наші ж записи, а не чужий канал. */
    rel: "0",
    /* Без анотацій і карток поверх кадру: на телефоні вони з'їдають
       пів екрана і ловлять тапи замість самого відео. */
    iv_load_policy: "3",
    /* YouTube знає українську як «uk»; наш код локалі — «ua». */
    hl: lang === "ua" ? "uk" : lang,
  });

  const posterSrc = poster ?? (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : undefined);

  function start() {
    /* play() викликаємо просто в обробнику тапу: iOS дозволяє звук,
       лише поки триває жест, і чекати перемалювання React не можна.
       Якщо браузер усе ж відмовив — прибираємо кільце й лишаємо
       людині рідну кнопку плеєра, а не вічне очікування. */
    video.current?.play().catch(() => setReady(true));
    setPlaying(true);
    onPlay?.();
  }

  return (
    <div
      className={cn(
        /* Підкладка чорна в обох темах: це рамка відео, а не текст,
           і вона не має світлішати разом зі сторінкою. */
        "relative w-full aspect-video overflow-hidden bg-black",
        className
      )}
    >
      {src ? (
        <video
          ref={video}
          src={src}
          preload="none"
          playsInline
          controls={playing}
          controlsList="nodownload"
          /* Ховаємо кадр на першій декодованій кадрині, а не на події
             `playing`: та приходить із запізненням, і перші секунди
             відео грали під постером — чути голос, видно картинку. */
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          /* Файла немає або мережа впала — вертаємось до кадру з
             кнопкою, а не лишаємо чорний прямокутник. */
          onError={() => {
            setPlaying(false);
            setReady(false);
          }}
          className={cn("absolute inset-0 w-full h-full object-contain", !playing && "pointer-events-none")}
        />
      ) : (
        playing &&
        videoId && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            onLoad={() => setReady(true)}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )
      )}

      {posterSrc && (
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          unoptimized={!poster}
          className={cn(
            "object-cover transition-opacity duration-500",
            playing && ready && "opacity-0 pointer-events-none"
          )}
        />
      )}

      {playing && !ready && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="w-10 h-10 rounded-full border-[3px] border-white/25 border-t-white animate-spin" />
        </span>
      )}

      {!playing && (
        <button
          type="button"
          onClick={start}
          onPointerEnter={src ? undefined : warm}
          onTouchStart={src ? undefined : warm}
          aria-label={label ?? title}
          /* touch-manipulation прибирає пів секунди очікування подвійного
             тапу — без нього перше натискання на телефоні «не помічають». */
          className="group absolute inset-0 w-full h-full cursor-pointer touch-manipulation"
        >
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
