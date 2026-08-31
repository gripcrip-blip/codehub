export const locales = ["en", "ru", "es", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { html: string; label: string; og: string }
> = {
  en: { html: "en", label: "English", og: "en_US" },
  ru: { html: "ru", label: "Русский", og: "ru_RU" },
  es: { html: "es", label: "Español", og: "es_ES" },
  zh: { html: "zh-CN", label: "中文", og: "zh_CN" },
  ja: { html: "ja", label: "日本語", og: "ja_JP" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
