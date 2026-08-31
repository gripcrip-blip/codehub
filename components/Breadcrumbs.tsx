import { localizedPath } from "@/lib/paths";
import type { Locale } from "@/lib/locales";
import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  locale: Locale;
  items: Crumb[];
};

export function Breadcrumbs({ locale, items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {item.href && !last ? (
                <Link
                  href={localizedPath(locale, item.href)}
                  className="hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-zinc-300" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
