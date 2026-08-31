type DemoBannerProps = {
  text: string;
};

export function DemoBanner({ text }: DemoBannerProps) {
  return (
    <div className="border-b border-amber-900/40 bg-amber-950/30 px-4 py-2 text-center text-xs text-amber-200/90 sm:text-sm">
      {text}
    </div>
  );
}
