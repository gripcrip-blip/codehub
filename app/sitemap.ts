import { games } from "@/data/games";
import { locales, localeMeta } from "@/lib/locales";
import { localizedPath } from "@/lib/paths";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

const staticPaths = ["/", "/about", "/disclaimer", "/privacy"];
const gamePaths = games.map((game) => `/${game.slug}-codes`);
const paths = [...staticPaths, ...gamePaths];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      lastModified: new Date("2026-08-31T06:40:00Z"),
      alternates: {
        languages: Object.fromEntries([
          ["x-default", `${SITE_URL}${path}`],
          ...locales.map((item) => [
            localeMeta[item].html,
            `${SITE_URL}${localizedPath(item, path)}`,
          ]),
        ]),
      },
    })),
  );
}
