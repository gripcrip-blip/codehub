import type { Metadata } from "next";
import { localeMeta, locales, type Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/paths";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${SITE_URL}${localizedPath(locale, path)}`;
  const languages: Record<string, string> = {
    "x-default": `${SITE_URL}${path}`,
  };
  for (const item of locales) {
    languages[localeMeta[item].html] = `${SITE_URL}${localizedPath(item, path)}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: localeMeta[locale].og,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
