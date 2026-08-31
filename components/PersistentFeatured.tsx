"use client";

import { GameSelector } from "@/components/GameSelector";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { stripLocale } from "@/lib/paths";
import { usePathname } from "next/navigation";

type PersistentFeaturedProps = {
  locale: Locale;
  messages: Messages;
};

export function PersistentFeatured({
  locale,
  messages,
}: PersistentFeaturedProps) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);

  if (path === "/") return null;

  return (
    <div className="mb-8">
      <GameSelector locale={locale} messages={messages} section="featured" />
    </div>
  );
}
