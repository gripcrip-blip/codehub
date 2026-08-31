import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeInPath = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (localeInPath) {
    if (localeInPath === defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/en/, "") || "/";
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|google8bcdf9cdfd35241d.html|.*\\..*).*)",
  ],
};
