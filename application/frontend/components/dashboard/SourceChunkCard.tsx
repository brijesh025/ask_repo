"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileCode2 } from "lucide-react";
import type { RetrievedChunk } from "@/lib/worker";

type Props = {
  chunk: RetrievedChunk;
  index: number;
};

export function SourceChunkCard({ chunk, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  const relevance = Math.max(0, Math.round((1 - chunk.distance) * 100));

  return (
    <div className="border border-zinc-800 bg-[#151313]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/40"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        )}

        <FileCode2 className="h-4 w-4 shrink-0 text-[#ff3b5c]" />

        <span className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-300">
          <span className="text-zinc-500">[{index + 1}]</span>{" "}
          {chunk.file_path}
          <span className="text-zinc-600">
            :{chunk.start_line}-{chunk.end_line}
          </span>
        </span>

        <span className="shrink-0 border border-zinc-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {relevance}% match
        </span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-3">
          <pre className="overflow-x-auto text-xs leading-5 text-zinc-400">
            <code>{chunk.chunk_text}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
