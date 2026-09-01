import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DisclaimerBanner } from "@/components/Disclaimer";
import { GameCodeList } from "@/components/GameCodeList";
import { RedeemGuide } from "@/components/RedeemGuide";
import { games, getGameByCodesSlug } from "@/data/games";
import { getCodesByGame } from "@/lib/codes";
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

      <GameCodeList
        gameSlug={game.slug}
        locale={locale}
        messages={messages}
        initial={codes}
      />

      <RedeemGuide game={game} locale={locale} messages={messages} />
    </div>
  );
}
