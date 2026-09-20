"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Check, ChevronDown, Plug, QrCode, Send, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Розгортка підключень: зліва сервіси церкви, справа ядро системи,
   між ними — кабелі. Вмикаєш сервіс, кабель протягується до порту,
   яким він годує систему, і по ньому починають іти пакети.
   ──────────────────────────────────────────────────────────────── */

/* Viber не має PNG у /public — невеликий вбудований знак у його фіолетовому. */
function ViberMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden className="rounded-[10px] shrink-0">
      <rect width="36" height="36" rx="8" fill="#7360f2" />
      <path
        d="M18 8.5c-5.6 0-9.5 3.4-9.5 8.4 0 2.9 1.4 5.2 3.6 6.6v3.9l3.5-1.9c.8.1 1.6.2 2.4.2 5.6 0 9.5-3.4 9.5-8.4S23.6 8.5 18 8.5Z"
        fill="#fff"
      />
      <path
        d="M14.6 13.3c.3-.3.8-.3 1.1 0l1.2 1.4c.3.3.2.8-.1 1.1l-.6.5c.5 1.1 1.3 2 2.4 2.5l.5-.6c.3-.3.8-.4 1.1-.1l1.4 1.1c.3.3.4.8.1 1.1l-.6.7c-.5.5-1.3.7-2 .4-2.5-1-4.3-2.9-5.2-5.3-.3-.7-.1-1.5.4-2l.3-.8Z"
        fill="#7360f2"
      />
    </svg>
  );
}

type Logo = { src: string } | { viber: true };
const LOGOS: Logo[] = [
  { src: "/telegram.png" },
  { viber: true },
  { src: "/twilio.png" },
  { src: "/turbo-sms.png" },
  { src: "/google-sheets.png" },
  { src: "/google-calendar.png" },
];

function LogoImg({ logo, size, alt }: { logo: Logo; size: number; alt: string }) {
  if ("viber" in logo) return <ViberMark size={size} />;
  return (
    <Image src={logo.src} alt={alt} width={size} height={size} sizes={`${size}px`} loading="lazy" className="rounded-[10px] shrink-0" />
  );
}

/* Порти ядра — що саме вмикає підключений сервіс. Порядок портів повторює
   порядок сервісів, тому жоден провід не перетинає інший. */
const PORT_ICONS: LucideIcon[] = [QrCode, Send, Users, CalendarDays];
/* Один сервіс — один провід в один порт. */
const WIRES: number[][] = [[0], [1], [1], [1], [2], [3]];

/* Геометрія розгортки. Класи нижче (lg:h-[…]) мусять збігатися з цими числами. */
const HEAD = 64; // шапка колонки
const CARD = 68; // окрема картка сервісу (lg:h-[68px] у розмітці — те саме число)
const GAP = 24; // повітря між картками — сервіси стоять окремо один від одного
const ROW = CARD + GAP; // крок сервісів   6 × 92 − 24 = 528
const PORT = 132; // порт ядра             4 × 132 = 528
const LANE = 300; // ширина смуги з кабелями
const BOARD_H = HEAD + LOGOS.length * ROW - GAP; // 592

/* Залізо на кінцях: гніздо в корпусі ядра і вилка на кінці проводу.
   Провід лежить завжди — вмикання це вилка, що входить у гніздо. */
const SOCKET_W = 26;
const SOCKET_H = 26;
const PLUG_W = 20;
const PLUG_H = 22;
const PIN_LEN = 15; // штирі дістають до контактів у глибині гнізда
const PIN_GAP = 5.5; // відстань між штирями
const PIN_PITCH = 32; // крок гнізд усередині порту — корпуси не злипаються
const PLUG_SHIFT = 20; // наскільки вилка виймається
const PLUG_X = LANE - SOCKET_W - PLUG_W; // ліва грань корпусу вилки
const CABLE_END = PLUG_X - PLUG_SHIFT; // де кінчається нерухома частина проводу
const TAIL = 58; // хвіст, що їде разом із вилкою і ховає стик

/* RUN мусить бути не коротшим за TAIL: вийнята вилка відводить хвіст рівно
   на PLUG_SHIFT, а його лівий край (PLUG_X − TAIL − PLUG_SHIFT) має лишитися
   всередині рівної ділянки (BEND). Інакше горизонтальний хвіст ляже на ще
   зігнутий провід — і на стику видно сходинку. */
const RUN = 64;
const BEND = CABLE_END - RUN; // де закінчується вигин


/* Провід, а не доріжка на платі: виходить із гнізда сервісу, провисає
   під власною вагою, вирівнюється і входить у вилку рівною ділянкою. */
function wire(y0: number, y1: number, slack: number) {
  return `M0 ${y0} C ${Math.round(BEND * 0.42)} ${y0 + slack} ${Math.round(BEND * 0.7)} ${y1} ${BEND} ${y1} H ${CABLE_END}`;
}

type Cable = { i: number; p: number; d: string; flow: string; y0: number; y1: number };

const CABLES: Cable[] = (() => {
  const perPort = PORT_ICONS.map(() => [] as number[]);
  WIRES.forEach((ports, i) => ports.forEach((p) => perPort[p].push(i)));

  const list: Cable[] = [];
  WIRES.forEach((ports, i) =>
    ports.forEach((p) => {
      const k = perPort[p].indexOf(i);
      const n = perPort[p].length;
      /* Провід виходить із ядра своїм контактом у порті… */
      const y0 = HEAD + PORT * p + PORT / 2 + (k - (n - 1) / 2) * PIN_PITCH;
      /* …і закінчується вилкою біля гнізда свого сервісу. */
      const y1 = HEAD + ROW * i + CARD / 2;
      /* Довгий перегін натягується, короткий провисає — тому й не злипаються. */
      const slack = 36 - Math.min(18, Math.abs(y1 - y0) * 0.075);
      const d = wire(y0, y1, slack);
      list.push({ i, p, y0, y1, d, flow: `${d} H ${LANE - 14}` });
    })
  );
  return list;
})();

type St = "off" | "in" | "on" | "out";
const IN_MS = 840;
const OUT_MS = 640;
const TRAFFIC_MS = 1700;

export default function Integrations() {
  const all = useT();
  const t = all.integrations;
  const { open } = useDemoModal();

  const [st, setSt] = useState<St[]>(() => LOGOS.map(() => "off"));
  const [hover, setHover] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const stRef = useRef(st);
  const [drag, setDrag] = useState<{ i: number; dx: number } | null>(null);
  const dragRef = useRef<{ i: number; startX: number; dx: number; plugged: boolean; span: number } | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    stRef.current = st;
  }, [st]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const set = useCallback((i: number, s: St) => setSt((prev) => prev.map((v, k) => (k === i ? s : v))), []);

  const connect = useCallback(
    (i: number, reduced: boolean) => {
      if (reduced) return set(i, "on");
      set(i, "in");
      later(() => setSt((prev) => (prev[i] === "in" ? prev.map((v, k) => (k === i ? "on" : v)) : prev)), IN_MS);
    },
    [later, set]
  );

  const disconnect = useCallback(
    (i: number, reduced: boolean) => {
      if (reduced) return set(i, "off");
      set(i, "out");
      later(() => setSt((prev) => (prev[i] === "out" ? prev.map((v, k) => (k === i ? "off" : v)) : prev)), OUT_MS);
    },
    [later, set]
  );

  const toggle = useCallback(
    (i: number) => {
      setTouched(true);
      const cur = stRef.current[i];
      if (cur === "in" || cur === "out") return; // хай доїде вилка
      const reduced = prefersReducedMotion();
      if (cur === "on") disconnect(i, reduced);
      else connect(i, reduced);
    },
    [connect, disconnect]
  );

  /* Вмикає користувач руками: тягнемо за провід або за вилку. */
  const onPlugDown = useCallback((e: React.PointerEvent<SVGElement>, i: number, span = PLUG_SHIFT) => {
    const cur = stRef.current[i];
    if (cur === "in" || cur === "out") return;
    e.preventDefault(); // тягнемо вилку, а не виділяємо текст
    setTouched(true);
    dragRef.current = { i, startX: e.clientX, dx: 0, plugged: cur === "on", span };
    setDrag({ i, dx: 0 });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPlugMove = useCallback((e: React.PointerEvent<SVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const raw = e.clientX - d.startX;
    /* Встромлена вилка ходить лише назовні, вийнята — лише в розетку. */
    d.dx = d.plugged ? Math.max(-d.span, Math.min(0, raw)) : Math.min(d.span, Math.max(0, raw));
    setDrag({ i: d.i, dx: d.dx });
  }, []);

  const onPlugUp = useCallback(
    (e?: React.PointerEvent<SVGElement>) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      if (!d) return;
      /* Швидкий ривок може не дати жодного pointermove — беремо зсув із самого відпускання. */
      const raw = e ? e.clientX - d.startX : d.dx;
      const moved = Math.abs(raw) > Math.abs(d.dx) ? raw : d.dx;
      const reduced = prefersReducedMotion();
      const tap = Math.abs(moved) < 4; // просто клацнули по вилці
      const enough = d.span / 3;
      if (!d.plugged && (tap || moved > enough)) connect(d.i, reduced);
      else if (d.plugged && (tap || moved < -enough)) disconnect(d.i, reduced);
    },
    [connect, disconnect]
  );

  /* Підключеними лініями по черзі йде пакет — видно, що канал живий. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setTick((v) => v + 1), TRAFFIC_MS);
    return () => clearInterval(id);
  }, []);

  const live = st.map((s, i) => (s === "on" ? i : -1)).filter((i) => i >= 0);
  const traffic = live.length ? live[tick % live.length] : -1;
  const count = live.length;
  const allOn = count === LOGOS.length;

  const toggleAll = () => {
    setTouched(true);
    const reduced = prefersReducedMotion();
    LOGOS.forEach((_, i) =>
      later(() => {
        if (allOn) disconnect(i, reduced);
        else if (stRef.current[i] !== "on") connect(i, reduced);
      }, i * 90)
    );
  };

  const flowing = (i: number) => st[i] === "on" && (hover === i || (hover === null && traffic === i));
  /* Вилка і хвіст проводу мусять їхати одним рухом — звідси спільний зсув. */
  const plugSlide = (i: number, s: St) => ({
    transform: `translateX(${(s === "on" || s === "in" ? 0 : -PLUG_SHIFT) + (drag?.i === i ? drag.dx : 0)}px)`,
    transitionDelay: s === "out" ? "0.26s" : "0s",
  });
  /* Наведення на сервіс гасить чужі проводи — видно, куди йде саме цей. */
  const dim = (i: number) => ({
    opacity: hover !== null && hover !== i ? 0.22 : 1,
    transition: "opacity 0.25s ease",
  });

  return (
    <section id="integrations" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-9 md:gap-11">
        <SectionHeading align="left" eyebrow={t.eyebrow} title={t.title} text={t.text} />

        {/* ── Розгортка ────────────────────────────────── */}
        <FadeIn variant="scale" delay={1} className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[44px] -z-10 blur-3xl opacity-60"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
          />

          <div
            ref={boardRef}
            className="rounded-[30px] border border-hairline bg-surface-2 shadow-[0_40px_80px_-48px_rgba(0,50,120,0.5)] overflow-hidden"
          >
            {/* Шапка панелі */}
            <div className="flex items-center gap-3 px-4 md:px-6 h-[56px] md:h-[62px] border-b border-hairline bg-surface">
              <Plug className="w-[18px] h-[18px] text-brand shrink-0" strokeWidth={2.2} />
              <span className="text-[14px] font-semibold text-ink tabular-nums whitespace-nowrap">
                {t.boardCount.replace("{n}", String(count)).replace("{total}", String(LOGOS.length))}
              </span>
              <button
                onClick={toggleAll}
                className="ml-auto shrink-0 rounded-full border border-hairline bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-ink-2 leading-none transition-colors hover:text-ink hover:border-hairline-strong"
              >
                {allOn ? t.disconnectAll : t.connectAll}
              </button>
            </div>

            {/* Тіло: ядро · проводи · сервіси — «Моя Церква» під’єднується до них */}
            <div className="p-3 md:p-5 flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-0">
              {/* Ядро */}
              <div className="order-3 lg:order-1 flex-1 min-w-0 rounded-[22px] border border-hairline bg-surface overflow-hidden lg:h-[592px]">
                <div className="h-[46px] lg:h-[64px] px-4 md:px-5 flex items-center gap-3 border-b border-hairline">
                  <span className="font-brand font-extrabold tracking-[-0.03em] text-[16px] leading-none text-ink">
                    {all.common.brand.split(" ").map((word, wi) => (
                      <span key={word} className={wi === 0 ? "text-brand" : undefined}>
                        {wi > 0 ? " " : ""}
                        {word}
                      </span>
                    ))}
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">{t.boardCore}</span>
                </div>

                {t.ports.map((port, p) => {
                  const Icon = PORT_ICONS[p];
                  const sources = WIRES.map((ports, i) => (ports.includes(p) && st[i] === "on" ? i : -1)).filter((i) => i >= 0);
                  const on = sources.length > 0;
                  const hot = hover !== null && WIRES[hover].includes(p);
                  const pulse = traffic >= 0 && hover === null && WIRES[traffic]?.includes(p) && st[traffic] === "on";
                  return (
                    <div
                      key={port}
                      className={cn(
                        "flex items-center gap-3.5 px-4 md:px-5 py-3.5 lg:py-0 lg:h-[132px] border-b border-hairline last:border-b-0 transition-colors duration-300",
                        hot && "bg-brand-soft/45"
                      )}
                    >
                      <span
                        className={cn(
                          "w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-300",
                          on ? "bg-brand-soft text-brand" : "bg-surface-3 text-ink-3",
                          pulse && "port-pulse"
                        )}
                      >
                        <Icon className="w-[19px] h-[19px]" strokeWidth={2.2} />
                      </span>
                      <span className="flex flex-col gap-1.5 min-w-0">
                        <span className={cn("font-semibold text-[16px] leading-[1.25] tracking-[-0.2px] transition-colors", on ? "text-ink" : "text-ink-3")}>
                          {port}
                        </span>
                        {/* Найцікавіше — що почало робитися саме, щойно вилка зайшла в розетку. */}
                        {on && (
                          <span className="port-src max-lg:!hidden items-start gap-1.5 text-[13.5px] text-ink-2 leading-[1.35]">
                            <Check className="w-3.5 h-3.5 mt-[3px] shrink-0 text-brand" strokeWidth={3} />
                            {t.results[p]}
                          </span>
                        )}
                        {/* Джерела порту — самі знаки сервісів, без підписів. */}
                        <span className="flex items-center gap-2 h-[24px]">
                          {sources.map((i) => (
                            <span key={i} className="port-src">
                              <LogoImg logo={LOGOS[i]} size={22} alt={t.cards[i].title} />
                            </span>
                          ))}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Кабелі */}
              <div className="hidden lg:block lg:order-2 shrink-0 relative select-none" style={{ width: LANE, height: BOARD_H }}>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "radial-gradient(var(--grid-line) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                    maskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)",
                    WebkitMaskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)",
                  }}
                />
                {!touched && count === 0 && (
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 whitespace-nowrap shadow-[0_8px_20px_-14px_rgba(0,50,120,0.5)]">
                    {t.hintDrag}
                  </span>
                )}
                <svg
                  role="presentation"
                  width={LANE}
                  height={BOARD_H}
                  viewBox={`0 0 ${LANE} ${BOARD_H}`}
                  className="absolute inset-0 overflow-visible"
                >
                  {/* Джгут: кожен провід має темну окантовку — на перетинах
                      видно, який над яким лежить, як у справжньому джгуті. */}
                  <g className="wire-bundle">
                    {CABLES.map((c, ci) => {
                      const s = st[c.i];
                      const drawn = cn("cable-live", s === "in" && "cable-draw", s === "out" && "cable-undraw");
                      const lit = { opacity: s === "off" ? 0 : 1 };
                      return (
                        <g key={ci} style={dim(c.i)}>
                          <path d={c.d} fill="none" stroke="var(--wire-edge)" strokeWidth={7.6} strokeLinecap="round" />
                          <path d={c.d} fill="none" stroke="var(--wire)" strokeWidth={5.4} strokeLinecap="round" />
                          <path d={c.d} fill="none" stroke="var(--wire-core)" strokeWidth={1.8} strokeLinecap="round" />
                          <path d={c.d} fill="none" pathLength={1} strokeLinecap="round" stroke="var(--brand)" strokeWidth={5.4} className={drawn} style={lit} />
                          <path d={c.d} fill="none" pathLength={1} strokeLinecap="round" stroke="var(--wire-hot)" strokeWidth={1.8} className={drawn} style={lit} />
                          {/* Хвіст їде з вилкою, але лежить у джгуті: одна тінь на весь
                              провід, тож стик із нерухомою частиною не видно. */}
                          <g className={cn("plug", drag?.i === c.i && "is-dragging")} style={plugSlide(c.i, s)}>
                            <g className={cn(!touched && s === "off" && "plug-nudge")}>
                              <line x1={PLUG_X - TAIL} y1={c.y1} x2={PLUG_X + 4} y2={c.y1} stroke="var(--wire-edge)" strokeWidth={7.6} strokeLinecap="round" />
                              <line x1={PLUG_X - TAIL} y1={c.y1} x2={PLUG_X + 4} y2={c.y1} stroke="var(--wire)" strokeWidth={5.4} strokeLinecap="round" />
                              <line x1={PLUG_X - TAIL} y1={c.y1} x2={PLUG_X + 4} y2={c.y1} stroke="var(--wire-core)" strokeWidth={1.8} strokeLinecap="round" />
                              <line
                                x1={PLUG_X - TAIL}
                                y1={c.y1}
                                x2={PLUG_X + 4}
                                y2={c.y1}
                                stroke="var(--brand)"
                                strokeWidth={5.4}
                                strokeLinecap="round"
                                className="cable"
                                style={{ opacity: s === "off" || s === "out" ? 0 : 1, transitionDelay: s === "in" ? "0.32s" : "0s" }}
                              />
                              <line
                                x1={PLUG_X - TAIL}
                                y1={c.y1}
                                x2={PLUG_X + 4}
                                y2={c.y1}
                                stroke="var(--wire-hot)"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                className="cable"
                                style={{ opacity: s === "off" || s === "out" ? 0 : 1, transitionDelay: s === "in" ? "0.32s" : "0s" }}
                              />
                            </g>
                          </g>
                          {flowing(c.i) && (
                            <circle r="3.6" fill="var(--wire-hot)" className="cable-dot">
                              <animateMotion dur="1.2s" repeatCount="indefinite" path={c.flow} />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* Залізо: вихід із ядра зліва, вилка й розетка сервісу справа. */}
                  <g>
                    {CABLES.map((c, ci) => {
                      const s = st[c.i];
                      const on = s === "on" || s === "in";
                      const pins = [c.y1 - PIN_GAP, c.y1 + PIN_GAP];
                      return (
                        <g key={ci} style={dim(c.i)}>
                          {/* Вихід із ядра — звідти провід і виходить. */}
                          <circle cx={0} cy={c.y0} r={5.5} fill="var(--surface-3)" stroke="var(--hairline-strong)" strokeWidth={1.4} />
                          <circle cx={0} cy={c.y0} r={on ? 3 : 2} fill={on ? "var(--brand)" : "var(--ink-3)"} opacity={on ? 1 : 0.45} className="cable" />

                          {/* Увесь провід — ручка: тягни будь-де по ньому. */}
                          <path
                            d={c.d}
                            fill="none"
                            stroke="transparent"
                            strokeWidth={26}
                            strokeLinecap="round"
                            style={{ cursor: drag?.i === c.i ? "grabbing" : "grab", pointerEvents: "stroke", touchAction: "none" }}
                            onPointerDown={(e) => onPlugDown(e, c.i)}
                            onPointerMove={onPlugMove}
                            onPointerUp={onPlugUp}
                            onPointerCancel={onPlugUp}
                            onMouseEnter={() => setHover(c.i)}
                            onMouseLeave={() => setHover(null)}
                          />

                          {/* Вилка: користувач тягне її в розетку і виймає назад. */}
                          <g
                            className={cn("plug", drag?.i === c.i && "is-dragging")}
                            style={plugSlide(c.i, s)}
                          >
                            <g className={cn(!touched && s === "off" && "plug-nudge")}>
                              {/* Муфта — там, де провід входить у корпус вилки. */}
                              <rect x={PLUG_X - 9} y={c.y1 - 7} width={14} height={14} rx={4.5} fill="var(--wire)" />
                              {/* Штирі — під корпусом видно лише те, що стирчить. */}
                              {pins.map((y, k) => (
                                <rect
                                  key={k}
                                  x={PLUG_X + PLUG_W - 4}
                                  y={y - 1.7}
                                  width={PIN_LEN + 4}
                                  height={3.4}
                                  rx={1.7}
                                  fill={on ? "var(--brand)" : "var(--hairline-strong)"}
                                  className="cable"
                                />
                              ))}
                              {/* Защіпка на корпусі. */}
                              <rect
                                x={PLUG_X + 5}
                                y={c.y1 - PLUG_H / 2 - 4}
                                width={10}
                                height={6}
                                rx={2}
                                fill="var(--surface)"
                                stroke={on ? "var(--brand)" : "var(--hairline-strong)"}
                                strokeWidth={1.4}
                                className="cable"
                              />
                              <rect
                                x={PLUG_X}
                                y={c.y1 - PLUG_H / 2}
                                width={PLUG_W}
                                height={PLUG_H}
                                rx={6}
                                fill="var(--surface)"
                                stroke={on ? "var(--brand)" : "var(--hairline-strong)"}
                                strokeWidth={1.6}
                                className="cable"
                              />
                            </g>
                            {/* Зона захвату — за неї вилку можна взяти й потягнути. */}
                            <rect
                              x={PLUG_X - TAIL - 60}
                              y={c.y1 - PIN_PITCH / 2}
                              width={TAIL + PLUG_W + 68}
                              height={PIN_PITCH}
                              fill="transparent"
                              style={{ cursor: drag?.i === c.i ? "grabbing" : "grab", pointerEvents: "all", touchAction: "none" }}
                              onPointerDown={(e) => onPlugDown(e, c.i)}
                              onPointerMove={onPlugMove}
                              onPointerUp={onPlugUp}
                              onPointerCancel={onPlugUp}
                              onMouseEnter={() => setHover(c.i)}
                              onMouseLeave={() => setHover(null)}
                            />
                          </g>

                          {/* Розетка на корпусі сервісу — штирі ховаються під нею. */}
                          <rect
                            x={LANE - SOCKET_W}
                            y={c.y1 - SOCKET_H / 2}
                            width={SOCKET_W}
                            height={SOCKET_H}
                            rx={7}
                            fill="var(--surface-3)"
                            stroke={s === "on" ? "var(--brand)" : "var(--hairline-strong)"}
                            strokeWidth={1.4}
                            className={cn("socket", s === "on" && "is-live")}
                          />
                          {pins.map((y, k) => (
                            <circle
                              key={k}
                              cx={LANE - 14}
                              cy={y}
                              r={2.6}
                              fill={s === "on" ? "var(--brand)" : "var(--ink-3)"}
                              opacity={s === "on" ? 1 : 0.4}
                              className="cable"
                            />
                          ))}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Провід уже в картці — стрілка лише веде погляд від сервісів до ядра. */}
              <div aria-hidden className="order-2 lg:hidden flex flex-col items-center gap-1 py-0.5">
                <span className={cn("w-px h-4 transition-colors", count > 0 ? "bg-brand" : "bg-hairline-strong")} />
                <ChevronDown className={cn("w-4 h-4 transition-colors", count > 0 ? "text-brand" : "text-ink-3")} strokeWidth={2.4} />
              </div>

              {/* Сервіси: кожен — окремий прилад, а не рядок у списку. */}
              <div
                className="order-1 lg:order-3 flex-1 lg:flex-[1.1] min-w-0 flex flex-col lg:h-[592px]"
                onMouseLeave={() => setHover(null)}
              >
                <div className="h-[34px] lg:h-[64px] flex items-center gap-3">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">{t.boardServices}</span>
                  {/* Підказки в смузі на телефоні не видно — кажемо тут. */}
                  {!touched && count === 0 && (
                    <span className="lg:hidden ml-auto text-[12px] font-medium text-ink-3 whitespace-nowrap">{t.hintDrag}</span>
                  )}
                </div>
                <div className="flex flex-col" style={{ gap: GAP }}>
                  {t.cards.map((card, i) => {
                    const s = st[i];
                    const on = s === "on" || s === "in";
                    return (
                      <button
                        key={card.title}
                        role="switch"
                        aria-checked={on}
                        aria-label={card.title}
                        onClick={() => toggle(i)}
                        onMouseEnter={() => setHover(i)}
                        onFocus={() => setHover(i)}
                        onBlur={() => setHover(null)}
                        className={cn(
                          "w-full text-left flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3.5 px-3.5 lg:px-4 py-3 lg:py-0 lg:h-[68px] rounded-[18px] border bg-surface transition-all duration-300",
                          "shadow-[0_10px_24px_-20px_rgba(0,50,120,0.55)]",
                          on ? "border-brand/45 bg-brand-soft/35" : "border-hairline hover:border-hairline-strong"
                        )}
                      >
                        <span className="flex items-center gap-3 lg:contents">
                          <LogoImg logo={LOGOS[i]} size={34} alt="" />
                          <span className="min-w-0 flex-1 font-semibold text-ink text-[15px] lg:text-[16px] leading-[1.25] tracking-[-0.2px] truncate">{card.title}</span>
                          {/* Перемикач: на телефоні це вся взаємодія, на великому екрані
                              він дублює провід і лишається для клавіатури. */}
                          <span
                            className={cn(
                              "ml-auto shrink-0 relative w-[44px] h-[26px] rounded-full border transition-colors duration-300",
                              on ? "bg-brand border-brand" : "bg-surface-3 border-hairline-strong"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all duration-300",
                                on ? "left-[21px]" : "left-[3px]"
                              )}
                            />
                          </span>
                        </span>
                        {/* Бонус: щойно сервіс увімкнено, під ним проступає те,
                            що система почала робити сама. На великому екрані те саме
                            пише порт ядра, тож там цей рядок не потрібен. */}
                        {on && (
                          <span className="port-src lg:!hidden items-start gap-1.5 pl-[46px] pr-1 text-[13.5px] text-ink-2 leading-[1.35]">
                            <Check className="w-3.5 h-3.5 mt-[3px] shrink-0 text-brand" strokeWidth={3} />
                            {t.results[WIRES[i][0]]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </FadeIn>

        {/* ── Підпис + «потрібна інша» ─────────────────── */}
        <FadeIn delay={2} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <span className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-ink-3">{t.hubCaption}</span>
          <span className="flex items-center gap-3">
            <span className="text-[15px] font-semibold text-ink">{t.customTitle}</span>
            <button onClick={open} className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand whitespace-nowrap">
              {t.customCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
            </button>
          </span>
        </FadeIn>
      </div>
    </section>
  );
}
