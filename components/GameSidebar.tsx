"use client";

import { GameIcon } from "@/components/GameIcon";
import { games } from "@/data/games";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { gameCodesPath, localizedPath, stripLocale } from "@/lib/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";

type GameSidebarProps = {
  locale: Locale;
  messages: Messages;
};

export function GameSidebar({ locale, messages }: GameSidebarProps) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const firstSecondary = games.findIndex((item) => !item.featured);

  return (
    <>
      <nav
        aria-label={messages.games.heading}
        className="border-b border-border bg-background md:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:thin]">
          {games.map((game) => {
            const href = localizedPath(locale, gameCodesPath(game));
            const active = path === gameCodesPath(game);
            return (
              <li key={game.slug} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${
                    active
                      ? "border-accent/40 bg-accent/10 text-foreground"
                      : "border-border bg-surface text-muted hover:border-zinc-600 hover:text-foreground"
                  }`}
                >
                  <GameIcon game={game} size="sm" />
                  {game.shortName}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <aside className="hidden w-48 shrink-0 border-r border-border py-5 pr-4 md:block lg:w-52">
        <p className="px-2 text-xs font-medium uppercase tracking-wider text-muted">
          {messages.games.heading}
        </p>
        <ul className="mt-3 space-y-0.5">
          {games.map((game, index) => {
            const href = localizedPath(locale, gameCodesPath(game));
            const active = path === gameCodesPath(game);
            return (
              <li key={game.slug}>
                {index === firstSecondary && firstSecondary > 0 ? (
                  <div className="mx-2 my-2 border-t border-border" />
                ) : null}
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${
                    active
                      ? "bg-zinc-800 text-foreground"
                      : game.featured
                        ? "text-zinc-200 hover:bg-zinc-900 hover:text-foreground"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-foreground"
                  }`}
                  style={
                    active && game.accent
                      ? { boxShadow: `inset 2px 0 0 0 ${game.accent}` }
                      : undefined
                  }
                >
                  <GameIcon game={game} size="md" />
                  <span className="leading-tight">{game.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
