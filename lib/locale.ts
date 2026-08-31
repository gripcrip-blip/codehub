import { defaultLocale, isLocale, type Locale } from "@/lib/locales";
import { notFound } from "next/navigation";

export function resolveLocale(raw: string): Locale {
  if (!isLocale(raw)) notFound();
  return raw;
}

export { defaultLocale };
