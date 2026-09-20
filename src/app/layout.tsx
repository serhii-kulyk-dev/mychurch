import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Caveat, Manrope } from "next/font/google";
import "./globals.css";
import { DemoModalProvider } from "@/context/demo-modal-context";
import DemoModal from "@/components/shared/demo-modal";
import { WorkspaceProvider } from "@/context/workspace-context";
import WorkspaceModal from "@/components/shared/workspace-modal";
import { THEME_KEY, LANG_KEY } from "@/lib/prefs";
import JsonLd from "@/components/shared/json-ld";
import SkipLink from "@/components/shared/skip-link";
import AnchorGuard from "@/components/shared/anchor-guard";
import BackToTop from "@/components/shared/back-to-top";
import Analytics from "@/components/shared/analytics";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

/* Шрифт логотипа: тільки для написання «Моя Церква» / «My Church». */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
  weight: ["500", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080a0f" },
  ],
};

/* Дефолти для всього сайту. Сторінки доповнюють їх через `pageMeta()`
   (src/lib/seo.ts): свій <title>, опис і канонічна адреса. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Моя Церква — система управління церквою українською",
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "Church management software",
  authors: [{ name: SITE_NAME, url: absoluteUrl("/") }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: absoluteUrl("/") },
  formatDetection: { telephone: false, address: false, email: false },
  /* Підтвердження прав у Google Search Console. Токен беремо з оточення:
     без нього тег просто не рендериться, у репозиторії його немає. */
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : null),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "uk_UA",
    alternateLocale: ["en_US"],
    title: "Моя Церква — система управління церквою українською",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

/* Runs before first paint so the stored theme and language are already
   applied — no flash of the wrong theme, no wrong-language first frame. */
const BOOT_SCRIPT = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem('${THEME_KEY}');
if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
if(t==='dark'){d.classList.add('dark');}
d.style.colorScheme=t;
var l=localStorage.getItem('${LANG_KEY}')==='en'?'en':'ua';
d.setAttribute('data-lang',l);
d.setAttribute('lang',l==='en'?'en':'uk');
}catch(e){}
document.documentElement.classList.add('theme-ready');
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      data-lang="ua"
      className={`${inter.variable} ${manrope.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Тема і мова стають на місце ще до гідратації — інакше блимає. */}
        <Script id="boot-prefs" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/* Перший таб на сторінці: пропустити меню й піти одразу в контент. */}
        <SkipLink />
        {/* Якорі гортають сторінку, але не лишають #hash в адресі. */}
        <AnchorGuard />
        <DemoModalProvider>
          <WorkspaceProvider>
            {children}
            <BackToTop />
            {/* Трекер кроків відвідувача — події йдуть у GA4. */}
            <Analytics />
            <DemoModal />
            <WorkspaceModal />
          </WorkspaceProvider>
        </DemoModalProvider>
      </body>
    </html>
  );
}
