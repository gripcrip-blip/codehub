import { games } from "@/data/games";
import { getUpdatedAt } from "@/lib/codes";
import { locales, localeMeta } from "@/lib/locales";
import { localizedPath } from "@/lib/paths";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

const staticPaths = ["/", "/about", "/disclaimer", "/privacy"];
const gamePaths = games.map((game) => `/${game.slug}-codes`);
const paths = [...staticPaths, ...gamePaths];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(getUpdatedAt());

  return paths.flatMap((path) => {
    const isHome = path === "/";
    const isCodes = path.endsWith("-codes");

    return locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      lastModified,
      changeFrequency: isCodes ? "daily" : isHome ? "daily" : "monthly",
      priority: isHome ? 1 : isCodes ? 0.9 : 0.4,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", `${SITE_URL}${path}`],
          ...locales.map((item) => [
            localeMeta[item].html,
            `${SITE_URL}${localizedPath(item, path)}`,
          ]),
        ]),
      },
    }));
  });
}
