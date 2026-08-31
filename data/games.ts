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
    icon: "/games/honkai-impact-3rd.png",
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
    icon: "/games/tears-of-themis.png",
    active: true,
    redemptionUrl: "https://tot.hoyoverse.com/gift/",
    accent: "#d47a8a",
  },
  {
    slug: "wuthering-waves",
    name: "Wuthering Waves",
    shortName: "WuWa",
    description:
      "Find the latest Wuthering Waves promo codes, rewards and redemption information in one place.",
    icon: "/games/wuthering-waves.png",
    active: true,
    officialUrl: "https://wutheringwaves.kurogames.com/",
    accent: "#5ec8e8",
  },
  {
    slug: "nikke",
    name: "NIKKE",
    shortName: "NIKKE",
    description:
      "Find the latest Goddess of Victory: NIKKE promo codes, rewards and redemption information in one place.",
    icon: "/games/nikke.png",
    active: true,
    officialUrl: "https://nikke-en.com/",
    accent: "#f0c14a",
  },
  {
    slug: "fate-grand-order",
    name: "Fate/Grand Order",
    shortName: "FGO",
    description:
      "Find the latest Fate/Grand Order promo codes, rewards and redemption information in one place.",
    icon: "/games/fate-grand-order.png",
    active: true,
    redemptionUrl: "https://game.fate-go.jp/Webview/SerialCodeTop",
    officialUrl: "https://fate-go.us/",
    accent: "#c9a227",
  },
  {
    slug: "pokemon-tcg-pocket",
    name: "Pokémon TCG Pocket",
    shortName: "TCG Pocket",
    description:
      "Find the latest Pokémon TCG Pocket promo codes, rewards and redemption information in one place.",
    icon: "/games/pokemon-tcg-pocket.png",
    active: true,
    redemptionUrl: "https://gift.pokemontcgpocket.com/{locale}/",
    officialUrl: "https://ptcgpocket.pokemon.com/",
    accent: "#f5d76e",
  },
  {
    slug: "arknights",
    name: "Arknights",
    shortName: "Arknights",
    description:
      "Find the latest Arknights promo codes, rewards and redemption information in one place.",
    icon: "/games/arknights.png",
    active: true,
    officialUrl: "https://www.arknights.global/",
    accent: "#22c3c8",
  },
  {
    slug: "love-and-deepspace",
    name: "Love and Deepspace",
    shortName: "Deepspace",
    description:
      "Find the latest Love and Deepspace promo codes, rewards and redemption information in one place.",
    icon: "/games/love-and-deepspace.png",
    active: true,
    officialUrl: "https://www.loveanddeepspace.com/",
    accent: "#7ec8e3",
  },
  {
    slug: "afk-journey",
    name: "AFK Journey",
    shortName: "AFK Journey",
    description:
      "Find the latest AFK Journey promo codes, rewards and redemption information in one place.",
    icon: "/games/afk-journey.png",
    active: true,
    officialUrl: "https://afkjourney.farlightgames.com/",
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
