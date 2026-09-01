"use client";

import { useLiveCodes } from "@/components/CodesProvider";
import { EmptyState } from "@/components/EmptyState";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { splitCodes } from "@/lib/codes";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import type { PromoCode } from "@/lib/types";

export function GameCodeList({
  gameSlug,
  locale,
  messages,
  initial,
}: {
  gameSlug: string;
  locale: Locale;
  messages: Messages;
  initial: PromoCode[];
}) {
  const codes = useLiveCodes(initial).filter((code) => code.game === gameSlug);
  const { latest, history } = splitCodes(codes);

  return (
    <>
      <section className="mt-8">
        <h2 className="text-lg font-medium text-foreground">
          {messages.codes.latest}
        </h2>
        {latest.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={messages.codes.emptyTitle}
              body={messages.codes.emptyBody}
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {latest.map((code) => (
              <PromoCodeCard
                key={code.id}
                code={code}
                locale={locale}
                messages={messages}
              />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-foreground">
            {messages.codes.recentlyFound}
          </h2>
          <div className="mt-4 grid gap-2">
            {history.map((code) => (
              <PromoCodeCard
                key={code.id}
                code={code}
                locale={locale}
                messages={messages}
                compact
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}