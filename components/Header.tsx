import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Search } from "@/components/Search";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/paths";
import { SITE_NAME } from "@/lib/site";
import type { PromoCode } from "@/lib/types";
import Link from "next/link";

type HeaderProps = {
  locale: Locale;
  messages: Messages;
  codes: PromoCode[];
};

export function Header({ locale, messages, codes }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link href={localizedPath(locale, "/")} className="shrink-0">
          <span className="block font-semibold tracking-tight text-foreground">
            {SITE_NAME}
          </span>
          <span className="block text-[11px] text-muted">
            {messages.brand.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-muted sm:flex">
          <a href={`${localizedPath(locale, "/")}#games`} className="hover:text-foreground">
            {messages.nav.games}
          </a>
          <Link href={localizedPath(locale, "/about")} className="hover:text-foreground">
            {messages.nav.about}
          </Link>
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1 sm:flex-none sm:w-64">
            <Search locale={locale} messages={messages} codes={codes} />
          </div>
          <LanguageSwitcher locale={locale} label={messages.nav.language} />
        </div>
      </div>
    </header>
  );
}
