"use client";

import { GameCard } from "@/components/GameCard";
import { featuredGames, secondaryGames } from "@/data/games";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { gameCodesPath, stripLocale } from "@/lib/paths";
import { usePathname } from "next/navigation";

type GameSelectorProps = {
  locale: Locale;
  messages: Messages;
  section?: "featured" | "more" | "all";
};

export function GameSelector({
  locale,
  messages,
  section = "all",
}: GameSelectorProps) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const featured = featuredGames();
  const more = secondaryGames();
  const showFeatured = section === "all" || section === "featured";
  const showMore = section === "all" || section === "more";

  return (
    <section id={showFeatured ? "games" : undefined} className="scroll-mt-20">
      {showFeatured ? (
        <>
          <h2 className="text-sm font-medium text-muted">
            {messages.games.featured}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {featured.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
                locale={locale}
                messages={messages}
                featured
                active={path === gameCodesPath(game)}
              />
            ))}
          </div>
        </>
      ) : null}
      {showMore ? (
        <>
          <h2
            className={`${showFeatured ? "mt-8" : ""} text-sm font-medium text-muted`}
          >
            {messages.games.more}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
                locale={locale}
                messages={messages}
                active={path === gameCodesPath(game)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
