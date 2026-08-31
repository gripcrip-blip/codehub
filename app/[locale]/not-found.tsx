import { getMessages } from "@/lib/i18n";
import { localizedPath } from "@/lib/paths";
import Link from "next/link";

export default function LocaleNotFound() {
  const messages = getMessages("en");

  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        {messages.notFound.title}
      </h1>
      <p className="mt-3 text-sm text-muted">{messages.notFound.body}</p>
      <Link
        href={localizedPath("en", "/")}
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg"
      >
        {messages.notFound.back}
      </Link>
    </div>
  );
}
