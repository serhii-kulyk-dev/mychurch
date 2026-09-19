"use client";

import Link from "next/link";
import { ChevronDown, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import LogoLink from "@/components/shared/logo-link";
import PreferenceToggles from "@/components/shared/preference-toggles";
import { PRICING_COPY } from "@/content/pricing";
import { useLang, useT } from "@/lib/lang";
import { useDemoModal } from "@/context/demo-modal-context";
import { useWorkspace } from "@/context/workspace-context";
import { LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { TELEGRAM_COPY } from "@/content/telegram";
import { BLOG_COPY } from "@/content/blog";
import { COMPARE_COPY } from "@/content/compare";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { open: openModal } = useDemoModal();
  const { open: openSpace } = useWorkspace();
  const t = useT();
  const { lang } = useLang();

  /* Верхній ряд — це шлях до продукту: що це, для кого, кому вже працює,
     скільки коштує. «Амбасадор» саме тут — жива церква переконує сильніше
     за будь-який розділ про можливості. Другорядне живе у згортці «Більше»,
     щоб рядок меню не перетворювався на список: «Модулі», «Телеграм-бот» —
     канал, а не шлях до продукту, і решта довідкових розділів.
     «Імпорту» в меню немає зовсім: перенесення даних — це крок всередині
     модулів, тож він живе посиланням у /modules і в статтях блогу, де на
     нього виходять з питання, а не з рядка навігації. */
  const NAV_LINKS = [
    { label: t.nav.product, href: "/#product", match: "/" },
    { label: t.nav.audience, href: "/for-whom", match: "/for-whom" },
    { label: t.nav.ai, href: "/ai", match: "/ai" },
    { label: t.nav.ambassadors, href: LEAD_AMBASSADOR_HREF, match: LEAD_AMBASSADOR_HREF },
    { label: BLOG_COPY[lang].navLabel, href: "/blog", match: "/blog" },
    { label: PRICING_COPY[lang].navLabel, href: "/pricing", match: "/pricing" },
  ];

  const MORE_LINKS: { label: string; href: string; match: string }[] = [
    { label: t.nav.modules, href: "/modules", match: "/modules" },
    { label: TELEGRAM_COPY[lang].navLabel, href: "/telegram", match: "/telegram" },
    { label: COMPARE_COPY[lang].navLabel, href: "/compare", match: "/compare" },
    { label: t.nav.faq, href: "/faq", match: "/faq" },
    { label: t.nav.support, href: "/support", match: "/support" },
    { label: t.nav.about, href: "/about", match: "/about" },
  ];

  const moreActive = MORE_LINKS.some((link) => pathname === link.match);

  /* «Контакти» — це якір на головну, а не розділ: на широкому екрані він
     живе іконкою поруч з перемикачами, щоб рядок меню лишався читабельним.
     У шухляді на телефоні місця вистачає — там він текстом, як був. */
  const CONTACTS = { label: t.nav.contacts, href: "/#contacts", match: null };

  /* Якорі на головну («Огляд», «Контакти») гортають сторінку, але не
     лишають #hash в адресі: інакше наступне відкриття сайту починалося б
     посеред сторінки, а не згори. З інших сторінок це звичайний перехід —
     там якоря ще нема, його треба спершу завантажити. */
  const scrollToId = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const toAnchor = (id: string) => (e: React.MouseEvent) => {
    if (!document.getElementById(id)) return;
    e.preventDefault();
    scrollToId(id);
  };

  const toContacts = toAnchor("contacts");

  /* Solidify the bar once the page moves away from the top */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Keep the page still while the mobile drawer is open. Only the vertical axis
     is touched — the shorthand would drop the body's own overflow-x: clip. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = previous;
    };
  }, [open]);

  /* A tall drawer on a short screen (landscape, small phones) must close when
     the route changes rather than hang over the new page. Adjusted during the
     render that brings the new path in, not in an effect: React then drops the
     half-finished output and re-renders before painting, so the drawer never
     flashes over the new page. */
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setOpen(false);
    setMore(false);
  }

  /* Згортка «Більше» закривається кліком повз неї — і клавіатурою теж:
     Escape нижче обробляє шухляду, тут — саме її. */
  useEffect(() => {
    if (!more) return;
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMore(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMore(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [more]);

  /* Escape закриває шухляду — так само, як модалку. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Один рядок шухляди. */
  const drawerLink = (link: { label: string; href: string; match: string | null }) => (
    <Link
      key={link.href}
      href={link.href}
      onClick={(e) => {
        setOpen(false);
        if (link.href.startsWith("/#") && document.getElementById(link.href.slice(2))) {
          e.preventDefault();
          /* Спершу шухляда їде вгору, потім сторінка — інакше два рухи
             накладаються і перехід виглядає смиканим. */
          setTimeout(() => scrollToId(link.href.slice(2)), 300);
        }
      }}
      className={cn(
        "px-4 py-3 rounded-xl text-[16px] leading-[1.2] tracking-[-0.16px] transition-colors",
        link.match && pathname === link.match
          ? "bg-surface-3 text-ink font-medium"
          : "text-ink-2 hover:bg-surface-3"
      )}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <header
        className={cn(
          "w-full h-16 md:h-20 flex items-center justify-between px-5 md:px-8 lg:px-12 py-4 md:py-5 sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "bg-surface/85 border-hairline shadow-[0_6px_24px_-18px_rgba(0,0,0,0.5)]"
            : "bg-surface/70 border-transparent"
        )}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        <div className="min-w-0 shrink-0">
          <LogoLink size="md" />
        </div>

        {/* Desktop navigation */}
        <nav aria-label={t.nav.primary} className="hidden min-[1560px]:flex items-center gap-0.5 min-[1720px]:gap-1 shrink-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={link.href.startsWith("/#") ? toAnchor(link.href.slice(2)) : undefined}
              className={cn(
                "px-2 min-[1720px]:px-2.5 py-2 rounded-full text-[14px] min-[1720px]:text-[15px] leading-[1.2] tracking-[-0.16px] transition-colors duration-200 whitespace-nowrap",
                link.match && pathname === link.match
                  ? "bg-surface-3 text-ink"
                  : "text-ink-2 hover:bg-surface-3 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* «Більше» — згортка з другорядними розділами. Відкривається кліком,
             а не наведенням: на тачпаді випадайка від hover ловить курсор. */}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMore((v) => !v)}
              aria-expanded={more}
              aria-haspopup="menu"
              className={cn(
                "flex items-center gap-1 px-2 min-[1720px]:px-2.5 py-2 rounded-full text-[14px] min-[1720px]:text-[15px] leading-[1.2] tracking-[-0.16px] transition-colors duration-200 whitespace-nowrap",
                more || moreActive
                  ? "bg-surface-3 text-ink"
                  : "text-ink-2 hover:bg-surface-3 hover:text-ink"
              )}
            >
              {t.nav.more}
              <ChevronDown
                className={cn("w-[15px] h-[15px] transition-transform duration-200", more && "rotate-180")}
                strokeWidth={2}
              />
            </button>

            <div
              role="menu"
              className={cn(
                "absolute right-0 top-[calc(100%+8px)] min-w-[220px] p-1.5 rounded-2xl border border-hairline bg-surface shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] origin-top-right transition-all duration-200",
                more
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              )}
            >
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  tabIndex={more ? 0 : -1}
                  onClick={() => setMore(false)}
                  className={cn(
                    "block px-3 py-2 rounded-xl text-[14.5px] leading-[1.2] tracking-[-0.16px] transition-colors",
                    pathname === link.match
                      ? "bg-surface-3 text-ink font-medium"
                      : "text-ink-2 hover:bg-surface-3 hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Desktop: preferences + CTA */}
        <div className="hidden min-[1560px]:flex items-center gap-2 min-[1720px]:gap-3 justify-end">
          <Link
            href="/#contacts"
            onClick={toContacts}
            aria-label={t.nav.contacts}
            title={t.nav.contacts}
            className="flex w-10 h-10 items-center justify-center rounded-full border border-hairline-strong bg-surface text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors shrink-0"
          >
            <Mail className="w-[17px] h-[17px]" strokeWidth={2} />
          </Link>
          <PreferenceToggles />
          <button
            onClick={() => openSpace()}
            className="flex items-center justify-center h-10 px-3.5 min-[1720px]:px-4 rounded-full border border-hairline-strong bg-surface text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors shrink-0 text-[15px] font-medium tracking-[-0.32px] whitespace-nowrap"
          >
            {t.workspace.open}
          </button>
          <button
            onClick={openModal}
            data-track="cta"
            data-place="меню"
            className="btn-primary btn-brand group relative flex items-center justify-center h-10 px-4 min-[1720px]:px-5 rounded-full overflow-hidden shrink-0"
          >
            <span className="relative text-white font-semibold text-[15px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
              {t.common.bookDemo}
            </span>
          </button>
        </div>

        {/* Mobile: toggles + hamburger */}
        <div className="flex min-[1560px]:hidden items-center gap-2">
          <PreferenceToggles size="sm" />
          {/* Між телефоном і повним меню (≈640–1560) головна дія лишається на
             видноті: ховати її в шухляду на ноутбуці — втрачати конверсію. */}
          <button
            onClick={openModal}
            data-track="cta"
            data-place="меню (компактне)"
            className="btn-primary btn-brand group relative hidden sm:flex items-center justify-center h-9 px-4 rounded-full overflow-hidden shrink-0"
          >
            <span className="relative text-white font-semibold text-[14px] tracking-[-0.3px] leading-[1.4] whitespace-nowrap">
              {t.common.bookDemo}
            </span>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-9 h-9 flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-surface-3 transition-colors"
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={open}
          >
            <span className={cn("w-5 h-[1.5px] bg-ink rounded-full transition-all duration-200 origin-center", open && "rotate-45 translate-y-[6.5px]")} />
            <span className={cn("w-5 h-[1.5px] bg-ink rounded-full transition-all duration-200", open && "opacity-0 scale-x-0")} />
            <span className={cn("w-5 h-[1.5px] bg-ink rounded-full transition-all duration-200 origin-center", open && "-rotate-45 -translate-y-[6.5px]")} />
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "fixed inset-0 top-16 md:top-20 z-40 min-[1560px]:hidden transition-all duration-300",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/30 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />

        <div
          className={cn(
            "absolute top-0 left-0 right-0 max-h-full overflow-y-auto overscroll-contain bg-surface border-b border-hairline transition-transform duration-300 shadow-lg",
            open ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <nav aria-label={t.nav.primary} className="flex flex-col px-5 py-4 gap-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {NAV_LINKS.map((link) => drawerLink(link))}

            {/* У шухляді «Більше» не ховає нічого за другим тапом — воно просто
               підписує, де закінчується головний шлях і починається решта. */}
            <span className="px-4 pt-4 pb-1 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">
              {t.nav.more}
            </span>
            {MORE_LINKS.map((link) => drawerLink(link))}

            {drawerLink(CONTACTS)}
            <div className="pt-3 pb-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  openSpace();
                }}
                className="flex items-center justify-center h-12 w-full rounded-full border border-hairline-strong bg-surface text-ink font-medium text-[16px] tracking-[-0.32px]"
              >
                {t.workspace.open}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  openModal();
                }}
                className="btn-primary btn-brand group relative flex items-center justify-center h-12 w-full rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4]">
                  {t.common.bookDemo}
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
