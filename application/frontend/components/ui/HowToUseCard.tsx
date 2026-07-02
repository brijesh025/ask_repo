"use client";

import React, { useState } from "react";
import { GitBranch, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect your repo",
    body: "Paste any GitHub repository URL. AskRepo clones, parses, and indexes every file — building a searchable knowledge graph of the entire codebase.",
    icon: GitBranch,
  },
  {
    number: "02",
    title: "Ask naturally",
    body: "Ask questions the way you'd ask a senior dev. \"How does auth work?\" or \"Where is the payment flow handled?\" — plain English, zero config.",
    icon: MessageSquare,
  },
  {
    number: "03",
    title: "Verify the answer",
    body: "Every answer comes with cited files, exact line ranges, and retrieved code snippets. Explore the interactive code graph to see how components connect.",
    icon: CheckCircle,
  },
];

export function HowToUseCard() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="border border-zinc-700/60 bg-[#201b1b]/90 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-5 sm:px-8 sm:py-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
          How to use
        </div>
        <h2 className="mt-2 text-xl font-black leading-tight text-[#fff4ef] sm:text-2xl">
          Connect a repo, ask a question,
          <br className="hidden sm:block" />
          then inspect the evidence.
        </h2>
      </div>

      {/* Steps */}
      <div className="divide-y divide-zinc-800">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(index)}
              onMouseEnter={() => setActiveStep(index)}
              className={`group relative flex w-full cursor-pointer items-start gap-4 px-6 py-5 text-left transition-all duration-300 sm:px-8 sm:py-6 ${
                isActive
                  ? "bg-[#ff3b5c]/[0.04]"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              {/* Accent bar */}
              <div
                className={`absolute top-0 left-0 h-full w-[3px] origin-top transition-transform duration-300 ${
                  isActive
                    ? "scale-y-100 bg-[#ff3b5c]"
                    : "scale-y-0 bg-transparent"
                }`}
                style={{ transformOrigin: "top" }}
              />

              {/* Number + Icon */}
              <div className="flex flex-shrink-0 flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "border-[#ff3b5c]/40 bg-[#ff3b5c]/10 text-[#ff3b5c]"
                      : "border-zinc-700 bg-zinc-800/50 text-zinc-500 group-hover:border-zinc-600 group-hover:text-zinc-400"
                  }`}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <span
                  className={`font-mono text-[10px] font-black transition-colors duration-300 ${
                    isActive ? "text-[#ff3b5c]" : "text-zinc-600"
                  }`}
                >
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm font-black uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? "text-[#fff4ef]" : "text-zinc-400 group-hover:text-zinc-300"
                  }`}
                >
                  {step.title}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isActive ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {step.body}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
