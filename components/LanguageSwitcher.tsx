"use client";

import type { Locale } from "@/lib/locales";
import { localeMeta, locales } from "@/lib/locales";
import { switchLocalePath } from "@/lib/paths";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
};

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div>
      <label className="sr-only" htmlFor="language-select">
        {label}
      </label>
      <select
        id="language-select"
        className="h-8 rounded-md border border-border bg-surface px-1.5 text-xs text-foreground sm:hidden"
        value={locale}
        onChange={(event) => {
          router.push(switchLocalePath(pathname, event.target.value as Locale));
        }}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeMeta[item].label}
          </option>
        ))}
      </select>
      <div className="hidden items-center gap-1 sm:flex">
        {locales.map((item) => {
          const active = item === locale;
          return (
            <Link
              key={item}
              href={switchLocalePath(pathname, item)}
              hrefLang={localeMeta[item].html}
              className={`rounded-md px-1.5 py-1 text-xs ${
                active
                  ? "bg-zinc-800 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
