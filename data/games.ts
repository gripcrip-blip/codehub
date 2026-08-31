import type { Game } from "@/lib/types";

/**
 * Single source of truth for games.
 * Add a new object here and it will appear in the sidebar, homepage and routes.
 * Promo codes themselves live in data/codes.json (updated later by a Python parser).
 *
 * redemptionUrl — official gift/redemption page (placeholders: {locale}, {lang}).
 * officialUrl — official game site, used when there is no web redemption page.
 */
export const games: Game[] = [
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    shortName: "Genshin",
    description:
      "Find the latest Genshin Impact promo codes, rewards and redemption information in one place.",
    icon: "/games/genshin-impact.png",
    active: true,
    featured: true,
    redemptionUrl: "https://genshin.hoyoverse.com/{locale}/gift",
    accent: "#d4b45a",
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    shortName: "Star Rail",
    description:
      "Find the latest Honkai: Star Rail promo codes, rewards and redemption information in one place.",
    icon: "/games/honkai-star-rail.png",
    active: true,
    featured: true,
    redemptionUrl: "https://hsr.hoyoverse.com/gift?lang={lang}",
    accent: "#7aa2ff",
  },
  {
    slug: "zenless-zone-zero",
    name: "Zenless Zone Zero",
    shortName: "ZZZ",
    description:
      "Find the latest Zenless Zone Zero promo codes, rewards and redemption information in one place.",
    icon: "/games/zenless-zone-zero.png",
    active: true,
    featured: true,
    redemptionUrl: "https://zenless.hoyoverse.com/redemption?lang={lang}",
    accent: "#e08a4c",
  },
  {
    slug: "honkai-impact-3rd",
    name: "Honkai Impact 3rd",
    shortName: "Honkai 3rd",
    description:
      "Find the latest Honkai Impact 3rd promo codes, rewards and redemption information in one place.",
    icon: "⚡",
    active: true,
    officialUrl: "https://honkaiimpact3.hoyoverse.com/global/{site}/",
    accent: "#e08ab8",
  },
  {
    slug: "tears-of-themis",
    name: "Tears of Themis",
    shortName: "Themis",
    description:
      "Find the latest Tears of Themis promo codes, rewards and redemption information in one place.",
    icon: "💌",
    active: true,
    redemptionUrl: "https://tot.hoyoverse.com/gift/",
    accent: "#d47a8a",
  },
  {
    slug: "honkai-nexus-anima",
    name: "Honkai: Nexus Anima",
    shortName: "Nexus Anima",
    description:
      "Find the latest Honkai: Nexus Anima promo codes, rewards and redemption information in one place.",
    icon: "✨",
    active: true,
    badge: "new",
    officialUrl: "https://hna.hoyoverse.com/{site}",
    accent: "#9b8cff",
  },
  {
    slug: "petit-planet",
    name: "Petit Planet",
    shortName: "Petit Planet",
    description:
      "Find the latest Petit Planet promo codes, rewards and redemption information in one place.",
    icon: "🌱",
    active: true,
    badge: "new",
    officialUrl: "https://planet.hoyoverse.com/{site}/",
    accent: "#7cbc7a",
  },
];

const pathLocale: Record<string, string> = {
  en: "en",
  ru: "ru",
  es: "es",
  zh: "zh-cn",
  ja: "ja",
};

const queryLang: Record<string, string> = {
  en: "en-us",
  ru: "ru-ru",
  es: "es-es",
  zh: "zh-cn",
  ja: "ja-jp",
};

const siteLocale: Record<string, string> = {
  en: "en-us",
  ru: "ru-ru",
  es: "es-es",
  zh: "zh-cn",
  ja: "ja-jp",
};

function fillUrl(template: string, locale: string): string {
  return template
    .replaceAll("{locale}", pathLocale[locale] ?? "en")
    .replaceAll("{lang}", queryLang[locale] ?? "en-us")
    .replaceAll("{site}", siteLocale[locale] ?? "en-us");
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function getGameByCodesSlug(slug: string): Game | undefined {
  if (!slug.endsWith("-codes")) return undefined;
  return getGameBySlug(slug.slice(0, -"-codes".length));
}

export function getRedemptionUrl(
  game: Game,
  locale: string,
): string | undefined {
  if (!game.redemptionUrl) return undefined;
  return fillUrl(game.redemptionUrl, locale);
}

export function getOfficialUrl(game: Game, locale: string): string | undefined {
  if (!game.officialUrl) return undefined;
  return fillUrl(game.officialUrl, locale);
}

export function displayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url;
  }
}

export function featuredGames(): Game[] {
  return games.filter((game) => game.featured);
}

export function secondaryGames(): Game[] {
  return games.filter((game) => !game.featured);
}
