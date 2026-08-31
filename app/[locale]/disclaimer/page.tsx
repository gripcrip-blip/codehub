import { getMessages } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const messages = getMessages(locale);
  return pageMetadata({
    locale,
    path: "/disclaimer",
    title: messages.meta.disclaimerTitle,
    description: messages.meta.disclaimerDescription,
  });
}

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const messages = getMessages(locale);

  return (
    <article className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {messages.disclaimer.title}
      </h1>
      <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
        <p>{messages.disclaimer.p1}</p>
        <p>{messages.disclaimer.p2}</p>
        <p>{messages.disclaimer.p3}</p>
      </div>
    </article>
  );
}
