import { LeftHeroSec } from "../ui/LeftHeroSec";
import { RightHeroSec } from "../ui/RightHeroSec";
export function HeroSection() {

  return (
    <section
      id="answer"
      className="relative grid border-b border-zinc-800 text-white lg:grid-cols-[3fr_2fr]"
    >
      <LeftHeroSec/>
      <RightHeroSec/>
      
    </section>
  );
}
