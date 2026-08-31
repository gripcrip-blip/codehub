import { defaultLocale, isLocale, type Locale } from "@/lib/locales";
import type { Game } from "@/lib/types";

export function gameCodesPath(game: Pick<Game, "slug">): string {
  return `/${game.slug}-codes`;
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    const rest = segments.slice(1).join("/");
    return { locale: first, path: rest ? `/${rest}` : "/" };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}

export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const { path } = stripLocale(pathname);
  return localizedPath(nextLocale, path);
}
