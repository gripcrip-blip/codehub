import { DemoBanner } from "@/components/DemoBanner";
import { Footer } from "@/components/Footer";
import { GameSidebar } from "@/components/GameSidebar";
import { Header } from "@/components/Header";
import { PersistentFeatured } from "@/components/PersistentFeatured";
import { isDemoData } from "@/lib/codes";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import type { PromoCode } from "@/lib/types";

type SiteShellProps = {
  locale: Locale;
  messages: Messages;
  codes: PromoCode[];
  children: React.ReactNode;
};

export function SiteShell({
  locale,
  messages,
  codes,
  children,
}: SiteShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {isDemoData() ? <DemoBanner text={messages.codes.demoBanner} /> : null}
      <Header locale={locale} messages={messages} codes={codes} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
        <GameSidebar locale={locale} messages={messages} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 md:py-6 lg:px-8">
          <PersistentFeatured locale={locale} messages={messages} />
          {children}
        </main>
      </div>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
