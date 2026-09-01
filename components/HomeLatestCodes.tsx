"use client";

import { useLiveCodes } from "@/components/CodesProvider";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { games } from "@/data/games";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { gameCodesPath, localizedPath } from "@/lib/paths";
import type { PromoCode } from "@/lib/types";

export function HomeLatestCodes({
  locale,
  messages,
  initial,
}: {
  locale: Locale;
  messages: Messages;
  initial: PromoCode[];
}) {
  const latest = useLiveCodes(initial).slice(0, 6);

  return (
    <div className="mt-4 grid gap-3">
      {latest.map((code) => {
        const game = games.find((item) => item.slug === code.game);
        return (
          <PromoCodeCard
            key={code.id}
            code={code}
            locale={locale}
            messages={messages}
            gameName={game?.name}
            gameHref={
              game ? localizedPath(locale, gameCodesPath(game)) : undefined
            }
          />
        );
      })}
    </div>
  );
}