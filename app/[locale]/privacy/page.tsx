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
    path: "/privacy",
    title: messages.meta.privacyTitle,
    description: messages.meta.privacyDescription,
  });
}

export default async function PrivacyPage({
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
        {messages.privacy.title}
      </h1>
      <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
        <p>{messages.privacy.p1}</p>
        <p>{messages.privacy.p2}</p>
      </div>
    </article>
  );
}
