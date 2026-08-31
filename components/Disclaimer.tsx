type DisclaimerBannerProps = {
  text: string;
};

export function DisclaimerBanner({ text }: DisclaimerBannerProps) {
  return (
    <p className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted">
      {text}
    </p>
  );
}
