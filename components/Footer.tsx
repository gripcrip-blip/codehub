import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/paths";
import Link from "next/link";

type FooterProps = {
  locale: Locale;
  messages: Messages;
};

export function Footer({ locale, messages }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1 text-sm text-muted">
          <p>{messages.footer.unofficial}</p>
          <p>{messages.footer.notAffiliated}</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          <a href={`${localizedPath(locale, "/")}#games`} className="text-muted hover:text-foreground">
            {messages.nav.games}
          </a>
          <Link href={localizedPath(locale, "/about")} className="text-muted hover:text-foreground">
            {messages.nav.about}
          </Link>
          <Link href={localizedPath(locale, "/privacy")} className="text-muted hover:text-foreground">
            {messages.nav.privacy}
          </Link>
          <Link href={localizedPath(locale, "/disclaimer")} className="text-muted hover:text-foreground">
            {messages.nav.disclaimer}
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-5 text-zinc-600 sm:px-6 lg:px-8">
        {messages.footer.trademarks}
      </p>
    </footer>
  );
}
