import codesFile from "@/data/codes.json";
import type { CodesFile, PromoCode } from "@/lib/types";

const data = codesFile as CodesFile;

const NEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const LATEST_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

export function isDemoData(): boolean {
  return data.demo;
}

export function getUpdatedAt(): string {
  return data.updatedAt;
}

export function getAllCodes(): PromoCode[] {
  return [...data.codes].sort(
    (a, b) => new Date(b.foundAt).getTime() - new Date(a.foundAt).getTime(),
  );
}

export function getCodesByGame(gameSlug: string): PromoCode[] {
  return getAllCodes().filter((code) => code.game === gameSlug);
}

export function displayReward(reward?: string): string | undefined {
  if (!reward) return undefined;
  if (/wikitable|===Expired===|===Active===|\{[\|:]|class\s*=/i.test(reward)) {
    return undefined;
  }
  return reward;
}

export function isRecentlyFound(foundAt: string, now = Date.now()): boolean {
  return now - new Date(foundAt).getTime() < NEW_WINDOW_MS;
}

export function isNewCode(code: PromoCode, now = Date.now()): boolean {
  return isRecentlyFound(code.foundAt, now);
}

export function splitCodes(codes: PromoCode[], now = Date.now()): {
  latest: PromoCode[];
  history: PromoCode[];
} {
  const latest: PromoCode[] = [];
  const history: PromoCode[] = [];

  for (const code of codes) {
    const age = now - new Date(code.foundAt).getTime();
    if (age <= LATEST_WINDOW_MS) {
      latest.push(code);
    } else {
      history.push(code);
    }
  }

  if (latest.length === 0 && history.length > 0) {
    return { latest: history.slice(0, 4), history: history.slice(4) };
  }

  if (latest.length > 0 && history.length === 0 && latest.length > 5) {
    return { latest: latest.slice(0, 5), history: latest.slice(5) };
  }

  return { latest, history };
}

export function searchCodes(query: string): PromoCode[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllCodes()
    .filter(
      (code) =>
        code.code.toLowerCase().includes(q) ||
        code.reward?.toLowerCase().includes(q),
    )
    .slice(0, 8);
}
