import { DisclaimerBanner } from "@/components/Disclaimer";
import { GameSelector } from "@/components/GameSelector";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { games } from "@/data/games";
import { getAllCodes } from "@/lib/codes";
import { getMessages } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { gameCodesPath, localizedPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const messages = getMessages(locale);
  return pageMetadata({
    locale,
    path: "/",
    title: messages.meta.homeTitle,
    description: messages.meta.homeDescription,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const messages = getMessages(locale);
  const latest = getAllCodes().slice(0, 6);

  return (
    <div>
      <section className="pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          {messages.hero.accent}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {messages.hero.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">
          {messages.hero.subtitle}
        </p>
        <a
          href="#games"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg hover:bg-accent/90"
        >
          {messages.hero.cta}
        </a>
      </section>

      <GameSelector locale={locale} messages={messages} section="featured" />

      <div className="mt-8">
        <DisclaimerBanner text={messages.codes.disclaimer} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-foreground">
          {messages.codes.homeLatest}
        </h2>
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
                  game
                    ? localizedPath(locale, gameCodesPath(game))
                    : undefined
                }
              />
            );
          })}
        </div>
      </section>

      <div className="mt-10">
        <GameSelector locale={locale} messages={messages} section="more" />
      </div>
    </div>
  );
}
