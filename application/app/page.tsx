import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { BottomSection } from "@/components/home/BottomSection";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#100f0f] font-sans selection:bg-[#ff3b5c] selection:text-white"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <main className="mx-auto min-h-screen max-w-[1440px] border-x border-zinc-800 bg-[#111111]">
        <Navbar />
        <HeroSection />
        <BottomSection />
      </main>
    </div>
  );
}
