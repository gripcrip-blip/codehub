import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ja from "@/messages/ja.json";
import ru from "@/messages/ru.json";
import zh from "@/messages/zh.json";
import { defaultLocale, isLocale, type Locale } from "@/lib/locales";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = {
  en,
  ru: ru as Messages,
  es: es as Messages,
  zh: zh as Messages,
  ja: ja as Messages,
};

export function getMessages(locale: string): Messages {
  if (isLocale(locale)) return dictionaries[locale];
  return dictionaries[defaultLocale];
}

export function t(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}
