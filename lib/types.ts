export type PromoCode = {
  id: string;
  code: string;
  game: string;
  reward?: string;
  foundAt: string;
  source?: {
    name: string;
    url: string;
  };
};

export type Game = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon?: string;
  active: boolean;
  featured?: boolean;
  badge?: "new" | "comingSoon";
  redemptionUrl?: string;
  officialUrl?: string;
  accent?: string;
};

export type CodesFile = {
  demo: boolean;
  updatedAt: string;
  codes: PromoCode[];
};
