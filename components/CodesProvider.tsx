"use client";

import { sortCodes } from "@/lib/codes";
import { LIVE_CODES_URL } from "@/lib/site";
import type { CodesFile, PromoCode } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

const CodesContext = createContext<PromoCode[] | null>(null);

export function CodesProvider({
  initial,
  children,
}: {
  initial: PromoCode[];
  children: React.ReactNode;
}) {
  const [codes, setCodes] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetch(`${LIVE_CODES_URL}?t=${Date.now()}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: CodesFile | null) => {
        if (cancelled || !payload?.codes?.length) return;
        setCodes(sortCodes(payload.codes));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return <CodesContext.Provider value={codes}>{children}</CodesContext.Provider>;
}

export function useLiveCodes(fallback: PromoCode[]): PromoCode[] {
  return useContext(CodesContext) ?? fallback;
}