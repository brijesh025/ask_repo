"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Clock3,
  FileCode2,
  Loader2,
  MessageSquareText,
  Send,
} from "lucide-react";
import { SourceChunkCard } from "@/components/dashboard/SourceChunkCard";
import type { ChatMessage } from "@/hooks/use-repo-chat";

type Props = {
  messages: ChatMessage[];
  isLoading: boolean;
  isReady: boolean;
  onAsk: (question: string) => void;
};

export function ChatPanel({ messages, isLoading, isReady, onAsk }: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !isReady || isLoading) return;

    onAsk(trimmed);
    setInput("");
  }

  return (
    <section className="border border-zinc-800 bg-[#111111]">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          AskRepo Chat
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#fff4ef]">
          Ask questions about this repo
        </h2>
      </div>

      {/* Message area + input */}
      <div className="grid min-h-[560px] grid-rows-[1fr_auto]">
        {/* Messages */}
        <div ref={scrollRef} className="space-y-4 overflow-y-auto px-6 py-6">
          {/* Locked state */}
          {!isReady && (
            <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-zinc-700 bg-[#151313] px-6 text-center">
              <Clock3 className="h-9 w-9 text-zinc-500" />
              <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-zinc-400">
                Chat unlocks after the repository has finished the analysis
                pipeline.
              </p>
            </div>
          )}

          {/* Empty state */}
          {isReady && messages.length === 0 && !isLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-zinc-700 bg-[#151313] px-6 text-center">
              <MessageSquareText className="h-9 w-9 text-[#ff3b5c]" />
              <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-zinc-400">
                The repo is ready. Ask about request flow, auth, database logic,
                API calls, or any file-level behavior.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`border p-4 ${
                message.role === "user"
                  ? "ml-auto max-w-2xl border-[#ff3b5c]/50 bg-[#201b1b]"
                  : "mr-auto max-w-3xl border-zinc-800 bg-[#151313]"
              }`}
            >
              {/* Role label */}
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <FileCode2 className="h-4 w-4" />
                )}
                {message.role}
              </div>

              {/* Message body */}
              {message.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none text-sm font-semibold leading-6 text-zinc-300 prose-headings:text-[#fff4ef] prose-code:text-[#ff6b81] prose-pre:bg-[#0d0c0c] prose-pre:border prose-pre:border-zinc-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm font-semibold leading-6 text-zinc-300">
                  {message.text}
                </p>
              )}

              {/* Source chunks */}
              {message.chunks && message.chunks.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Sources ({message.chunks.length} chunks)
                  </p>
                  {message.chunks.map((chunk, i) => (
                    <SourceChunkCard key={chunk.id} chunk={chunk} index={i} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="mr-auto flex max-w-3xl items-center gap-3 border border-zinc-800 bg-[#151313] p-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#ff3b5c]" />
              <p className="text-sm font-semibold text-zinc-400">
                Searching codebase and generating answer…
              </p>
            </div>
          )}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-zinc-800 px-6 py-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isReady || isLoading}
              placeholder={
                isReady
                  ? "Ask how something works in this repo…"
                  : "Waiting for analysis to finish…"
              }
              className="min-h-12 flex-1 border border-zinc-700 bg-[#151313] px-4 py-3 text-sm font-semibold text-[#fff4ef] outline-none transition-colors placeholder:text-zinc-600 focus:border-[#ff3b5c] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!isReady || isLoading || input.trim() === ""}
              className="inline-flex items-center justify-center gap-2 bg-[#ff3b5c] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#ff244b] disabled:cursor-not-allowed disabled:bg-zinc-700"
            >
              <Send className="h-4 w-4" />
              Ask
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
