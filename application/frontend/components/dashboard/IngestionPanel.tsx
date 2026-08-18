"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
  FileCode2,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { IngestionStatus } from "@/hooks/use-ingestion";
import type { IngestResponse } from "@/lib/worker";

type Props = {
  owner: string;
  name: string;
  repoUrl?: string;
  status: IngestionStatus;
  result: IngestResponse | null;
  error: string | null;
  onStart: () => void;
};

export function IngestionPanel({
  owner,
  name,
  repoUrl,
  status,
  result,
  error,
  onStart,
}: Props) {
  const isIngesting = status === "ingesting";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <section className="border border-zinc-800 bg-[#111111]">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Repository Analysis
        </p>
        <h1 className="mt-3 break-words text-3xl font-black text-[#fff4ef]">
          {owner}/{name}
        </h1>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-zinc-500 transition-colors hover:text-[#ff6b81]"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {repoUrl}
          </a>
        )}
      </div>

      {/* Action + Status */}
      <div className="px-6 py-6">
        {/* Start / Retry Button */}
        <button
          type="button"
          onClick={onStart}
          disabled={isIngesting}
          className="inline-flex w-full items-center justify-center gap-2 bg-[#ff3b5c] px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#ff244b] disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {isIngesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isIngesting
            ? "Analyzing Repository…"
            : isSuccess
              ? "Re-Analyze"
              : "Start Analysis"}
        </button>

        {/* Ingesting — animated pulse */}
        {isIngesting && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 border border-zinc-800 bg-[#151313] p-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#ff3b5c]" />
              <div>
                <p className="text-sm font-black text-[#fff4ef]">
                  Processing repository
                </p>
                <p className="mt-1 text-xs font-semibold text-zinc-500">
                  Cloning, scanning, chunking, embedding, and indexing…
                </p>
              </div>
            </div>
            <div className="h-1 overflow-hidden bg-zinc-800">
              <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-[#ff3b5c] to-[#ff6b81]" />
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && error && (
          <div className="mt-6 flex items-start gap-3 border border-red-900/60 bg-red-950/20 px-5 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-black text-red-200">
                Analysis failed
              </p>
              <p className="mt-1 text-sm font-semibold text-red-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success — stats + sample files */}
        {isSuccess && result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 border border-emerald-900/60 bg-emerald-950/20 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-sm font-black text-emerald-200">
                Repository analyzed successfully
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={<FileCode2 className="h-4 w-4 text-[#ff3b5c]" />}
                label="Files"
                value={result.files}
              />
              <StatCard
                icon={<Layers className="h-4 w-4 text-[#ff3b5c]" />}
                label="Chunks"
                value={result.chunks}
              />
              <StatCard
                icon={<Sparkles className="h-4 w-4 text-[#ff3b5c]" />}
                label="Embeddings"
                value={result.embeddings}
              />
            </div>

            {/* Sample files */}
            {result.sample_files && result.sample_files.length > 0 && (
              <div className="border border-zinc-800 bg-[#151313] p-4">
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Database className="mr-1.5 inline h-3.5 w-3.5" />
                  Indexed Files (sample)
                </p>
                <ul className="space-y-1.5">
                  {result.sample_files.map((file) => (
                    <li
                      key={file}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-400"
                    >
                      <FileCode2 className="h-3 w-3 shrink-0 text-zinc-600" />
                      <span className="truncate">{file}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="border border-zinc-800 bg-[#151313] p-4 text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center">
        {icon}
      </div>
      <p className="text-2xl font-black text-[#fff4ef]">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </p>
    </div>
  );
}
