"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to execCommand
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  copyLabel,
  copiedLabel,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-11 min-w-[7.5rem] cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      aria-live="polite"
    >
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
