import type { Locale } from "@/lib/locales";

function ruPlural(n: number, one: string, few: string, many: string): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}

function formatAbsolute(iso: string, locale: Locale): string {
  const date = new Date(iso);
  const map: Record<Locale, string> = {
    en: "en-US",
    ru: "ru-RU",
    es: "es-ES",
    zh: "zh-CN",
    ja: "ja-JP",
  };
  return new Intl.DateTimeFormat(map[locale], {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatFoundLabel(iso: string, locale: Locale): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diff / 60_000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0 || minutes < 2) {
    switch (locale) {
      case "ru":
        return "Найден только что";
      case "es":
        return "Encontrado hace un momento";
      case "zh":
        return "刚刚发现";
      case "ja":
        return "たった今確認";
      default:
        return "Found just now";
    }
  }

  if (minutes < 60) {
    switch (locale) {
      case "ru":
        return `Найден ${minutes} ${ruPlural(minutes, "минуту", "минуты", "минут")} назад`;
      case "es":
        return minutes === 1
          ? "Encontrado hace 1 minuto"
          : `Encontrado hace ${minutes} minutos`;
      case "zh":
        return `${minutes} 分钟前发现`;
      case "ja":
        return `${minutes}分前に確認`;
      default:
        return minutes === 1
          ? "Found 1 minute ago"
          : `Found ${minutes} minutes ago`;
    }
  }

  if (hours < 24) {
    switch (locale) {
      case "ru":
        return `Найден ${hours} ${ruPlural(hours, "час", "часа", "часов")} назад`;
      case "es":
        return hours === 1
          ? "Encontrado hace 1 hora"
          : `Encontrado hace ${hours} horas`;
      case "zh":
        return `${hours} 小时前发现`;
      case "ja":
        return `${hours}時間前に確認`;
      default:
        return hours === 1 ? "Found 1 hour ago" : `Found ${hours} hours ago`;
    }
  }

  if (days === 1) {
    switch (locale) {
      case "ru":
        return "Найден вчера";
      case "es":
        return "Encontrado ayer";
      case "zh":
        return "昨天发现";
      case "ja":
        return "昨日確認";
      default:
        return "Found yesterday";
    }
  }

  if (days < 7) {
    switch (locale) {
      case "ru":
        return `Найден ${days} ${ruPlural(days, "день", "дня", "дней")} назад`;
      case "es":
        return `Encontrado hace ${days} días`;
      case "zh":
        return `${days} 天前发现`;
      case "ja":
        return `${days}日前に確認`;
      default:
        return `Found ${days} days ago`;
    }
  }

  const abs = formatAbsolute(iso, locale);
  switch (locale) {
    case "ru":
      return `Найден: ${abs}`;
    case "es":
      return `Encontrado: ${abs}`;
    case "zh":
      return `发现于 ${abs}`;
    case "ja":
      return `確認日: ${abs}`;
    default:
      return `Found: ${abs}`;
  }
}

export function formatAbsoluteFound(iso: string, locale: Locale): string {
  const abs = formatAbsolute(iso, locale);
  switch (locale) {
    case "ru":
      return `Найден: ${abs}`;
    case "es":
      return `Encontrado: ${abs}`;
    case "zh":
      return `发现于 ${abs}`;
    case "ja":
      return `確認日: ${abs}`;
    default:
      return `Found: ${abs}`;
  }
}

export function formatShortDate(iso: string, locale: Locale): string {
  return formatAbsolute(iso, locale);
}
