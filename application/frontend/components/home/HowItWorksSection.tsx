import React from "react";
import { HowToUseCard } from "../ui/HowToUseCard";
import { RepoExampleCard } from "../ui/RepoExampleCard";

export function HowItWorksSection() {
  return (
    <section className="relative border-b border-zinc-800 text-white">
      {/* Section header */}
      <div className="border-b border-zinc-800 px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Getting Started
          </div>
          <h2 className="mt-2 text-2xl font-black text-[#fff4ef] sm:text-3xl">
            Three steps to{" "}
            <span className="text-[#ff3b5c]">understand any repo</span>
          </h2>
        </div>
      </div>

      {/* Side-by-side: How to Use + Repo Example */}
      <div className="grid md:grid-cols-2">
        {/* Left: How to use */}
        <div className="border-b border-zinc-800 p-6 sm:p-8 md:border-b-0 md:border-r md:p-10">
          <HowToUseCard />
        </div>

        {/* Right: Repo example */}
        <div className="p-6 sm:p-8 md:p-10">
          <RepoExampleCard />
        </div>
      </div>
    </section>
  );
}
