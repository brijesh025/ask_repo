"use client";

import React from "react";
import { GlowingRed } from "../ui/GlowingRed";
import { ArrowDown } from "lucide-react";

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

/* Floating code-graph node for hero background */
function FloatingNode({
  className = "",
  size = 40,
  delay = 0,
  label,
}: {
  className?: string;
  size?: number;
  delay?: number;
  label: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute flex items-center justify-center rounded-lg border border-zinc-700/30 bg-zinc-800/30 font-mono text-[9px] font-bold text-zinc-600 backdrop-blur-sm ${className}`}
      style={{
        width: size,
        height: size,
        animation: `float-node 6s ease-in-out ${delay}s infinite`,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function FloatingConnector({
  className = "",
  width = 60,
  delay = 0,
}: {
  className?: string;
  width?: number;
  delay?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ animation: `float-node-reverse 8s ease-in-out ${delay}s infinite` }}
      aria-hidden="true"
    >
      <svg
        width={width}
        height="2"
        viewBox={`0 0 ${width} 2`}
        className="text-zinc-700/30"
      >
        <line
          x1="0"
          y1="1"
          x2={width}
          y2="1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          style={{ animation: "dash-flow 1s linear infinite" }}
        />
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden border-b border-zinc-800 px-5 py-20 text-white sm:px-8 lg:px-16"
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Glowing accents */}
      <GlowingRed className="-left-40 top-1/4 z-0 w-96 -rotate-12 opacity-60" />
      <GlowingRed className="-right-40 bottom-1/3 z-0 w-96 rotate-12 opacity-60" />

      {/* Floating code-graph nodes (background decoration) */}
      <FloatingNode className="left-[8%] top-[15%]" size={48} delay={0} label="fn" />
      <FloatingNode className="right-[12%] top-[20%]" size={36} delay={1.2} label=".ts" />
      <FloatingNode className="left-[15%] bottom-[25%]" size={42} delay={2.4} label="api" />
      <FloatingNode className="right-[8%] bottom-[18%]" size={38} delay={0.8} label=".py" />
      <FloatingNode className="left-[35%] top-[10%] hidden lg:flex" size={32} delay={1.8} label="db" />
      <FloatingNode className="right-[30%] bottom-[12%] hidden lg:flex" size={44} delay={3.0} label="src" />
      <FloatingConnector className="left-[12%] top-[28%]" width={50} delay={0.5} />
      <FloatingConnector className="right-[15%] top-[32%]" width={40} delay={1.5} />
      <FloatingConnector className="left-[20%] bottom-[30%] hidden lg:block" width={65} delay={2.0} />

      {/* ─── Main content ─── */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Badge */}
        <div
          className="mb-8 flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/40 px-5 py-2 backdrop-blur-sm"
          style={{ animation: "fade-in-up 0.6s ease-out 0.1s both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b5c] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            AI-Powered Codebase Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl font-black leading-[0.95] tracking-tight text-[#fff4ef] sm:text-7xl lg:text-8xl xl:text-[112px]"
          style={{ animation: "fade-in-up 0.6s ease-out 0.2s both" }}
        >
          UNDERSTAND
          <br />
          ANY{" "}
          <span className="bg-gradient-to-r from-[#ff3b5c] to-[#ff6b81] bg-clip-text text-transparent">
            CODEBASE
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="mt-6 max-w-2xl text-base font-semibold leading-relaxed text-zinc-400 sm:text-lg lg:mt-8 lg:text-xl"
          style={{ animation: "fade-in-up 0.6s ease-out 0.35s both" }}
        >
          Chat with any GitHub repository, visualize code connections as
          interactive graphs, and trace how every file and function fits
          together — powered by RAG.
        </p>

        {/* CTAs */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-10"
          style={{ animation: "fade-in-up 0.6s ease-out 0.5s both" }}
        >
          <a
            href="#how-it-works"
            className="group flex items-center gap-2 bg-[#ff3b5c] px-7 py-4 text-xs font-black tracking-widest text-white transition-all duration-200 hover:bg-[#ff244b] hover:shadow-lg hover:shadow-[#ff3b5c]/20"
          >
            SEE HOW IT WORKS
            <ArrowDown
              size={14}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
          </a>
          <a
            href="https://github.com/brijesh025/ask_repo"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 border border-zinc-700 px-6 py-4 text-xs font-black tracking-widest text-white transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-900"
          >
            <GitHubIcon
              className="text-[#ff3b5c] transition-transform duration-200 group-hover:scale-110"
            />
            VIEW CODE SOURCES
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-16 flex flex-col items-center gap-2 lg:mt-20"
          style={{ animation: "fade-in-up 0.6s ease-out 0.7s both" }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Scroll to explore
          </span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-zinc-700/60 p-1">
            <div
              className="h-1.5 w-1 rounded-full bg-zinc-500"
              style={{
                animation: "particle-flow-vertical 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
