import React from "react";
import { RAGPipelineFlow } from "../ui/RAGPipelineFlow";

export function RAGPipelineSection() {
  return (
    <section
      id="how-it-works"
      className="relative border-b border-zinc-800 text-white"
    >
      {/* Section header */}
      <div className="border-b border-zinc-800 px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Under The Hood
          </div>
          <h2 className="mt-2 text-2xl font-black text-[#fff4ef] sm:text-3xl">
            The{" "}
            <span className="text-[#ff3b5c]">RAG pipeline</span>{" "}
            powering every answer
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-zinc-400 sm:text-base">
            From your question to a grounded, cited answer — hover over each
            stage to see exactly what happens at every step of the pipeline.
          </p>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        {/* Subtle grid bg */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <RAGPipelineFlow />
        </div>
      </div>
    </section>
  );
}
