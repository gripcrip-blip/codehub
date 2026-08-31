import { getOfficialUrl, getRedemptionUrl } from "@/data/games";
import { t, type Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import type { Game } from "@/lib/types";

type RedeemGuideProps = {
  game: Game;
  locale: Locale;
  messages: Messages;
};

function inGameNote(messages: Messages, slug: string): string | undefined {
  return messages.redeem.inGame[slug as keyof typeof messages.redeem.inGame];
}

function PageLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
    >
      {children}
    </a>
  );
}

export function RedeemGuide({ game, locale, messages }: RedeemGuideProps) {
  const url = getRedemptionUrl(game, locale);
  const official = getOfficialUrl(game, locale);
  const inGame = inGameNote(messages, game.slug);
  const steps =
    messages.redeem.ingameSteps[
      game.slug as keyof typeof messages.redeem.ingameSteps
    ];
  const hint = messages.redeem.clickableHint;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-medium text-foreground">
        {t(messages.redeem.heading, { game: game.name })}
      </h2>

      {url ? (
        <>
          <ol className="mt-4 space-y-2 text-sm leading-6 text-zinc-300">
            <li>1. {messages.redeem.step1}</li>
            <li>
              2.{" "}
              <PageLink href={url}>
                {t(messages.redeem.step2, { game: game.name })} {hint}
              </PageLink>
            </li>
            <li>3. {messages.redeem.step3}</li>
            <li>4. {messages.redeem.step4}</li>
            <li>5. {messages.redeem.step5}</li>
          </ol>
          {inGame ? (
            <p className="mt-4 text-sm text-muted">
              {messages.redeem.inGameAlt} {inGame}
            </p>
          ) : null}
        </>
      ) : steps ? (
        <>
          <p className="mt-3 text-sm text-muted">{messages.redeem.inGameOnly}</p>
          <ol className="mt-4 space-y-2 text-sm leading-6 text-zinc-300">
            {steps.map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
          {official ? (
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              <PageLink href={official}>
                {messages.redeem.officialSite} {hint}
              </PageLink>
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            {messages.redeem.noWebYet}
          </p>
          {inGame ? <p className="mt-3 text-sm text-muted">{inGame}</p> : null}
          {official ? (
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              <PageLink href={official}>
                {messages.redeem.officialSite} {hint}
              </PageLink>
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
