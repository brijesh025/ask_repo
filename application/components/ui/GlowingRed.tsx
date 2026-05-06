type GlowingRedProps = {
  className?: string;
};

export function GlowingRed({ className = "" }: GlowingRedProps) {
  return (
    <div
      className={`pointer-events-none h-5 bg-[#ff3b5c] shadow-[0_0_24px_rgba(255,59,92,0.45)] ${className}`}
      aria-hidden="true"
    />
  );
}
