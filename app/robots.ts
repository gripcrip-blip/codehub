import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = new URL(SITE_URL).host;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host,
  };
}
