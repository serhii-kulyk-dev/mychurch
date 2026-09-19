"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Send } from "lucide-react";
import LogoLink from "@/components/shared/logo-link";
import PreferenceToggles from "@/components/shared/preference-toggles";
import { PRICING_COPY } from "@/content/pricing";
import { useLang, useT } from "@/lib/lang";
import { LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { cn } from "@/lib/utils";
import { SITE_TELEGRAM, SITE_TELEGRAM_HANDLE } from "@/lib/seo";
import { TELEGRAM_COPY } from "@/content/telegram";
import { BLOG_COPY } from "@/content/blog";
import { COMPARE_COPY } from "@/content/compare";

const NEW_LIFE = { label: "Нове Життя", href: "https://www.newlife.ck.ua/" };

const EMAIL = "team@mychurch.com.ua";
const PHONE = { label: "+380 96 529 73 75", href: "tel:+380965297375" };
const TELEGRAM = { label: `@${SITE_TELEGRAM_HANDLE}`, href: SITE_TELEGRAM };

/* Column captions: small caps so the links themselves stay the loudest thing
   in the column. */
const capCls = "text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 leading-[1.2]";

/* Roomier rows on touch: a 15px line with py-1.5 is a 33px target. Desktop
   keeps the tighter list. */
const linkCls =
  "-mx-2 px-2 py-1.5 md:py-1 rounded-md text-[15px] text-ink-2 tracking-[-0.16px] leading-[1.25] hover:text-ink hover:bg-surface-3 transition-colors";
const smallCls =
  "-mx-2 px-2 py-1.5 md:py-1 rounded-md text-[12px] text-ink-3 tracking-[-0.12px] leading-[1.2] whitespace-nowrap hover:text-ink transition-colors";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3.5">
      <span className={capCls}>{title}</span>
      <div className="flex flex-col gap-0.5 md:gap-1 items-start">{children}</div>
    </div>
  );
}

/* The action is the loud line — «Зателефонувати», not a bare number — so it is
   obvious each row is a way to reach us, not just a string to copy. The value
   sits under it in the quiet size. */
function Contact({
  href,
  icon: Icon,
  action,
  children,
  external,
  className,
}: {
  href: string;
  icon: typeof Mail;
  action: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-3",
        className
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink-2 transition-colors group-hover:border-brand/30 group-hover:text-brand">
        <Icon className="h-[15px] w-[15px]" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[15px] font-medium text-ink tracking-[-0.16px] leading-[1.2] transition-colors group-hover:text-brand">
          {action}
        </span>
        <span className="text-[12.5px] text-ink-3 tracking-[-0.12px] leading-[1.25]">
          {children}
        </span>
      </span>
    </a>
  );
}

export default function Footer() {
  const t = useT();
  const { lang } = useLang();

  const PRODUCT = [
    { label: t.nav.product, href: "/#product" },
    { label: t.nav.modules, href: "/modules" },
    { label: t.nav.ai, href: "/ai" },
    { label: TELEGRAM_COPY[lang].navLabel, href: "/telegram" },
    { label: t.nav.import, href: "/import" },
  ];

  const COMPANY = [
    { label: t.nav.about, href: "/about" },
    { label: t.nav.ambassadors, href: LEAD_AMBASSADOR_HREF },
    { label: t.nav.consulting, href: "/consulting" },
    { label: BLOG_COPY[lang].navLabel, href: "/blog" },
  ];

  const HELP = [
    { label: t.nav.audience, href: "/for-whom" },
    { label: PRICING_COPY[lang].navLabel, href: "/pricing" },
    { label: COMPARE_COPY[lang].navLabel, href: "/compare" },
    { label: t.nav.faq, href: "/faq" },
    { label: t.nav.support, href: "/support" },
  ];

  return (
    <footer id="contacts" className="w-full bg-page border-t border-hairline">
      <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8 py-14 md:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-12">
          {/* Brand + how to reach us */}
          <div className="flex flex-col gap-7 w-full lg:max-w-[340px]">
            <LogoLink />

            <div className="flex flex-col gap-3">
              <span className={capCls}>{t.footer.contacts}</span>
              <div className="flex flex-col items-start">
                <Contact
                  href={`mailto:${EMAIL}`}
                  icon={Mail}
                  action={t.footer.writeMail}
                  className="max-w-full"
                >
                  <span className="break-all sm:break-normal">{EMAIL}</span>
                </Contact>
                <Contact href={PHONE.href} icon={Phone} action={t.footer.call}>
                  {PHONE.label}
                </Contact>
                <Contact
                  href={TELEGRAM.href}
                  icon={Send}
                  action={t.footer.writeTelegram}
                  external
                >
                  {TELEGRAM.label}
                </Contact>
              </div>
            </div>

            <PreferenceToggles size="sm" className="hidden lg:flex" />
          </div>

          {/* Site map */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:w-[620px] lg:shrink-0 lg:gap-x-8">
            <Column title={t.footer.product}>
              {PRODUCT.map(({ label, href }) => (
                <Link key={href} href={href} className={linkCls}>
                  {label}
                </Link>
              ))}
            </Column>

            <Column title={t.footer.company}>
              {COMPANY.map(({ label, href }) => (
                <Link key={href} href={href} className={linkCls}>
                  {label}
                </Link>
              ))}
              <a
                href={NEW_LIFE.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkCls, "group/ext inline-flex items-center gap-1")}
              >
                {NEW_LIFE.label}
                <ArrowUpRight className="h-[13px] w-[13px] text-ink-3 transition-colors group-hover/ext:text-brand" />
              </a>
            </Column>

            <Column title={t.footer.help}>
              {HELP.map(({ label, href }) => (
                <Link key={href} href={href} className={linkCls}>
                  {label}
                </Link>
              ))}
            </Column>
          </div>
        </div>

        <PreferenceToggles size="sm" className="mt-10 lg:hidden" />

        <div className="mt-10 md:mt-14 pt-6 border-t border-hairline flex flex-col-reverse sm:flex-row items-start sm:items-center sm:justify-between gap-4 sm:gap-6">
          <p className="text-[12px] text-ink-3 tracking-[-0.12px] leading-[1.2]">{t.footer.rights}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className={smallCls}>
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className={smallCls}>
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
