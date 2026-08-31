import { GameIcon } from "@/components/GameIcon";
import { gameCodesPath, localizedPath } from "@/lib/paths";
import type { Game } from "@/lib/types";
import type { Locale } from "@/lib/locales";
import type { Messages } from "@/lib/i18n";
import Link from "next/link";

type GameCardProps = {
  game: Game;
  locale: Locale;
  messages: Messages;
  featured?: boolean;
  active?: boolean;
};

export function GameCard({
  game,
  locale,
  messages,
  featured = false,
  active = false,
}: GameCardProps) {
  const href = localizedPath(locale, gameCodesPath(game));
  const badge =
    game.badge === "new"
      ? messages.games.new
      : game.badge === "comingSoon"
        ? messages.games.comingSoon
        : null;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group block rounded-xl border bg-surface p-4 transition-colors hover:border-zinc-600 hover:bg-surface-hover ${
        featured ? "sm:p-5" : ""
      } ${
        active
          ? "border-accent/40 bg-zinc-800/80"
          : "border-border"
      }`}
      style={
        game.accent
          ? { boxShadow: `inset 3px 0 0 0 ${game.accent}` }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <GameIcon game={game} size={featured ? "lg" : "md"} />
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-white">
              {game.name}
            </p>
            <p className="mt-0.5 text-xs text-muted">{messages.games.open}</p>
          </div>
        </div>
        {badge ? (
          <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
            {badge}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
