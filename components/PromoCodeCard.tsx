"use client";

import { CopyButton } from "@/components/CopyButton";
import { displayReward, isRecentlyFound } from "@/lib/codes";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatAbsoluteFound, formatFoundLabel } from "@/lib/time";
import type { PromoCode } from "@/lib/types";
import Link from "next/link";
import { useSyncExternalStore } from "react";

type PromoCodeCardProps = {
  code: PromoCode;
  locale: Locale;
  messages: Messages;
  compact?: boolean;
  gameName?: string;
  gameHref?: string;
};

const emptySubscribe = () => () => undefined;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function PromoCodeCard({
  code,
  locale,
  messages,
  compact = false,
  gameName,
  gameHref,
}: PromoCodeCardProps) {
  const isClient = useIsClient();
  const found = isClient
    ? formatFoundLabel(code.foundAt, locale)
    : formatAbsoluteFound(code.foundAt, locale);
  const isNew = isClient && isRecentlyFound(code.foundAt);
  const reward = displayReward(code.reward);

  if (compact) {
    return (
      <article
        id={`code-${code.id}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
      >
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-medium tracking-wide text-foreground select-all">
            {code.code}
          </p>
          <time dateTime={code.foundAt} className="mt-0.5 block text-xs text-muted">
            {found}
          </time>
        </div>
        <CopyButton
          text={code.code}
          copyLabel={messages.codes.copy}
          copiedLabel={messages.codes.copied}
          className="min-w-[6.5rem] shrink-0"
        />
      </article>
    );
  }

  return (
    <article
      id={`code-${code.id}`}
      className="rounded-xl border border-border bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {gameName ? (
            gameHref ? (
              <Link href={gameHref} className="text-xs text-muted hover:text-foreground">
                {gameName}
              </Link>
            ) : (
              <span className="text-xs text-muted">{gameName}</span>
            )
          ) : null}
          {isNew ? (
            <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-accent">
              {messages.codes.new}
            </span>
          ) : null}
          {code.source ? (
            <span className="text-xs text-muted">
              {messages.codes.source}:{" "}
              <a
                href={code.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline-offset-2 hover:text-foreground hover:underline"
              >
                {code.source.name}
              </a>
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="select-all font-mono text-xl font-semibold tracking-wide text-foreground sm:text-2xl">
            {code.code}
          </p>
          {reward ? (
            <p className="mt-1.5 text-sm leading-6 text-zinc-300">{reward}</p>
          ) : null}
          <time dateTime={code.foundAt} className="mt-2 block text-sm text-muted">
            {found}
          </time>
        </div>
        <CopyButton
          text={code.code}
          copyLabel={messages.codes.copy}
          copiedLabel={messages.codes.copied}
          className="w-full sm:w-auto"
        />
      </div>
    </article>
  );
}
