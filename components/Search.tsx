"use client";

import { GameIcon } from "@/components/GameIcon";
import { games } from "@/data/games";
import { displayReward } from "@/lib/codes";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { gameCodesPath, localizedPath } from "@/lib/paths";
import { gameAlias } from "@/lib/seo";
import type { PromoCode } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchProps = {
  locale: Locale;
  messages: Messages;
  codes: PromoCode[];
};

export function Search({ locale, messages, codes }: SearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  const gameResults = useMemo(() => {
    if (!q) return [];
    return games.filter((game) => {
      const alias = gameAlias(messages, game.slug).toLowerCase();
      return (
        game.name.toLowerCase().includes(q) ||
        game.shortName.toLowerCase().includes(q) ||
        game.slug.includes(q) ||
        (alias && alias.includes(q))
      );
    });
  }, [q, messages]);

  const codeResults = useMemo(() => {
    if (!q) return [];
    return codes
      .filter(
        (code) =>
          code.code.toLowerCase().includes(q) ||
          code.reward?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [codes, q]);

  const hasResults = gameResults.length > 0 || codeResults.length > 0;

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      <label className="sr-only" htmlFor="site-search">
        {messages.nav.search}
      </label>
      <input
        id="site-search"
        ref={inputRef}
        type="search"
        value={query}
        placeholder={messages.nav.searchPlaceholder}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-zinc-500"
      />
      {open && q ? (
        <div className="absolute right-0 z-40 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border bg-zinc-950 shadow-xl">
          {!hasResults ? (
            <p className="px-3 py-3 text-sm text-muted">
              {messages.nav.searchNoResults}
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1">
              {gameResults.length > 0 ? (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted">
                    {messages.nav.searchGames}
                  </p>
                  {gameResults.map((game) => (
                    <Link
                      key={game.slug}
                      href={localizedPath(locale, gameCodesPath(game))}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-zinc-900"
                    >
                      <GameIcon game={game} size="sm" />
                      {game.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              {codeResults.length > 0 ? (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted">
                    {messages.nav.searchCodes}
                  </p>
                  {codeResults.map((code) => {
                    const game = games.find((item) => item.slug === code.game);
                    if (!game) return null;
                    const reward = displayReward(code.reward);
                    return (
                      <Link
                        key={code.id}
                        href={`${localizedPath(locale, gameCodesPath(game))}#code-${code.id}`}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                        }}
                        className="block px-3 py-2 hover:bg-zinc-900"
                      >
                        <span className="font-mono text-sm text-foreground">
                          {code.code}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {game.shortName}
                          {reward ? ` · ${reward}` : ""}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
