import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DisclaimerBanner } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { RedeemGuide } from "@/components/RedeemGuide";
import { games, getGameByCodesSlug } from "@/data/games";
import { getCodesByGame, splitCodes } from "@/lib/codes";
import { getMessages, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { locales } from "@/lib/locales";
import { gameAlias, labeledGameName, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    games.map((game) => ({ locale, slug: `${game.slug}-codes` })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const game = getGameByCodesSlug(slug);
  if (!game) return {};
  const messages = getMessages(locale);
  const label = labeledGameName(game, gameAlias(messages, game.slug));
  return pageMetadata({
    locale,
    path: `/${slug}`,
    title: t(messages.meta.gameTitle, { game: label }),
    description: t(messages.meta.gameDescription, { game: label }),
  });
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const game = getGameByCodesSlug(slug);
  if (!game) notFound();

  const messages = getMessages(locale);
  const codes = getCodesByGame(game.slug);
  const { latest, history } = splitCodes(codes);
  const label = labeledGameName(game, gameAlias(messages, game.slug));

  return (
    <div>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: messages.nav.home, href: "/" },
          { label: game.name },
        ]}
      />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {t(messages.codes.pageHeading, { game: label })}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        {t(messages.codes.pageIntro, { game: label })}
      </p>

      <div className="mt-5">
        <DisclaimerBanner text={messages.codes.disclaimer} />
      </div>

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

      <RedeemGuide game={game} locale={locale} messages={messages} />
    </div>
  );
}
