type GlowingRedProps = {
  className?: string;
};

export function GlowingRed({ className = "" }: GlowingRedProps) {
  return (
    <div
      className={`pointer-events-none absolute h-4 bg-[#ff3b5c] shadow-[0_0_24px_rgba(255,59,92,0.45)] sm:h-5 ${className}`}
      aria-hidden="true"
    />
  );
}
