"use client";

import React, { useState } from "react";
import {
  MessageSquareText,
  Binary,
  Database,
  FileText,
  Cpu,
  FileCheck,
} from "lucide-react";

const pipelineStages = [
  {
    id: "ingest",
    icon: Binary,
    label: "Clone & Scan",
    description:
      "A Go worker clones the repository, filters relevant source files, and prepares them for processing.",
    color: "#fff4ef",
    bgColor: "#fff4ef",
  },
  {
    id: "chunk",
    icon: FileText,
    label: "Code Chunking",
    description:
      "Files are logically split by functions, classes, and methods, preserving metadata like file paths and line numbers.",
    color: "#ff3b5c",
    bgColor: "#ff3b5c",
  },
  {
    id: "embed",
    icon: Database,
    label: "Vector Store",
    description:
      "Chunks are converted into embeddings and stored in a PostgreSQL vector database for fast semantic retrieval.",
    color: "#ff3b5c",
    bgColor: "#ff3b5c",
  },
  {
    id: "query",
    icon: MessageSquareText,
    label: "User Query",
    description:
      "You ask a plain-English question. It's embedded and matched against the indexed code vectors.",
    color: "#ff3b5c",
    bgColor: "#ff3b5c",
  },
  {
    id: "llm",
    icon: Cpu,
    label: "LLM Generation",
    description:
      "The retrieved context and your question are sent to the LLM to generate a source-grounded answer.",
    color: "#ff3b5c",
    bgColor: "#ff3b5c",
  },
  {
    id: "response",
    icon: FileCheck,
    label: "Verifiable Answer",
    description:
      "You receive a clear explanation, complete with cited file snippets and line references.",
    color: "#fff4ef",
    bgColor: "#fff4ef",
  },
];

export function RAGPipelineFlow() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      {/* ─── Desktop: Horizontal flow ─── */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between gap-2">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = activeStage === index;
            const isFirst = index === 0;
            const isLast = index === pipelineStages.length - 1;

            return (
              <React.Fragment key={stage.id}>
                {/* Node */}
                <div
                  className="group relative flex flex-1 flex-col items-center"
                  onMouseEnter={() => setActiveStage(index)}
                  onMouseLeave={() => setActiveStage(null)}
                >
                  {/* Icon circle */}
                  <div
                    className={`relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl border-2 transition-all duration-300 xl:h-20 xl:w-20 ${
                      isActive
                        ? "scale-110 border-[#ff3b5c] bg-[#ff3b5c]/15"
                        : isFirst || isLast
                        ? "border-zinc-600 bg-zinc-800/80 group-hover:border-zinc-500"
                        : "border-zinc-700/50 bg-[#201b1b] group-hover:border-[#ff3b5c]/40"
                    }`}
                    style={
                      isActive
                        ? {
                            animation: "glow-pulse 2s ease-in-out infinite",
                          }
                        : undefined
                    }
                  >
                    <Icon
                      size={24}
                      strokeWidth={2}
                      className={`transition-colors duration-300 xl:h-7 xl:w-7 ${
                        isActive
                          ? "text-[#ff3b5c]"
                          : isFirst || isLast
                          ? "text-[#fff4ef]"
                          : "text-zinc-400 group-hover:text-[#ff3b5c]"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-3 text-center text-[10px] font-black uppercase tracking-widest transition-colors duration-300 xl:text-xs ${
                      isActive
                        ? "text-[#ff3b5c]"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  >
                    {stage.label}
                  </div>

                  {/* Hover description card */}
                  <div
                    className={`absolute top-full z-20 mt-8 w-56 border border-zinc-700/80 bg-[#1a1717] p-4 shadow-2xl shadow-black/40 transition-all duration-300 xl:w-64 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
                      Step {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-400">
                      {stage.description}
                    </p>
                    {/* Arrow */}
                    <div className="absolute -top-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-zinc-700/80 bg-[#1a1717]" />
                  </div>
                </div>

                {/* Connector arrow */}
                {index < pipelineStages.length - 1 && (
                  <div className="relative mt-7 flex flex-shrink-0 items-center self-start xl:mt-9">
                    <div className="h-[2px] w-4 bg-gradient-to-r from-zinc-700 to-zinc-600 sm:w-6 md:w-4 xl:w-8" />
                    <div className="h-0 w-0 border-t-[5px] border-b-[5px] border-l-[7px] border-t-transparent border-b-transparent border-l-zinc-600" />
                    {/* Animated particle */}
                    <div
                      className="absolute top-1/2 h-1.5 w-1.5 rounded-full bg-[#ff3b5c] shadow-[0_0_8px_rgba(255,59,92,0.6)]"
                      style={{
                        animation: `particle-flow 2s ease-in-out ${
                          index * 0.4
                        }s infinite`,
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ─── Mobile / Tablet: Vertical flow ─── */}
      <div className="md:hidden">
        <div className="flex flex-col items-start gap-0">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = activeStage === index;

            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStage(activeStage === index ? null : index)
                  }
                  className={`group relative flex w-full items-start gap-4 px-2 py-4 text-left transition-all duration-300 ${
                    isActive ? "bg-[#ff3b5c]/[0.03]" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                      isActive
                        ? "border-[#ff3b5c] bg-[#ff3b5c]/15"
                        : "border-zinc-700/50 bg-[#201b1b] group-hover:border-zinc-600"
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "text-[#ff3b5c]"
                          : "text-zinc-400 group-hover:text-zinc-300"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] font-black text-zinc-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4
                        className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                          isActive
                            ? "text-[#ff3b5c]"
                            : "text-zinc-400 group-hover:text-zinc-300"
                        }`}
                      >
                        {stage.label}
                      </h4>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive
                          ? "mt-2 max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Vertical connector */}
                {index < pipelineStages.length - 1 && (
                  <div className="relative ml-[22px] h-4 sm:ml-[22px]">
                    <div className="absolute left-1/2 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-zinc-700 to-zinc-700/30" />
                    <div
                      className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#ff3b5c] shadow-[0_0_8px_rgba(255,59,92,0.6)]"
                      style={{
                        animation: `particle-flow-vertical 1.5s ease-in-out ${
                          index * 0.3
                        }s infinite`,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
