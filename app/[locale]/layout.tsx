import { SiteShell } from "@/components/SiteShell";
import { getAllCodes } from "@/lib/codes";
import { getMessages } from "@/lib/i18n";
import { localeMeta, locales } from "@/lib/locales";
import { resolveLocale } from "@/lib/locale";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamic = "force-static";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const messages = getMessages(locale);
  const codes = getAllCodes();

  return (
    <html
      lang={localeMeta[locale].html}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteShell locale={locale} messages={messages} codes={codes}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
