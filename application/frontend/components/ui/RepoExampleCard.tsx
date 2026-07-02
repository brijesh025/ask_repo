"use client";

import React, { useState, useEffect } from "react";

const sources = [
  {
    file: "auth/middleware.go",
    detail: "token validation and request context",
    line: "lines 45-67",
  },
  {
    file: "routes/private.go",
    detail: "protected route wiring",
    line: "lines 18-31",
  },
  {
    file: "db/sessions.go",
    detail: "session lookup and expiry checks",
    line: "lines 72-96",
  },
];

const fullAnswer =
  "Requests pass through middleware, the token is validated, user context is attached, and private routes reject missing or expired sessions.";

export function RepoExampleCard() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    // Start typing animation when card becomes visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTyped) {
          setIsTyping(true);
          setHasTyped(true);
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById("repo-example-card");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [hasTyped]);

  useEffect(() => {
    if (!isTyping) return;
    if (displayedText.length >= fullAnswer.length) {
      setIsTyping(false);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(fullAnswer.slice(0, displayedText.length + 1));
    }, 18 + Math.random() * 25);

    return () => clearTimeout(timeout);
  }, [isTyping, displayedText]);

  return (
    <div
      id="repo-example-card"
      className="border border-zinc-700/60 bg-[#151313]/95 backdrop-blur-sm"
    >
      {/* Repo header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 sm:px-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Repository
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-[#fff4ef]">
            github.com/team/api
          </div>
        </div>
        <div className="border border-[#ff3b5c]/50 bg-[#ff3b5c]/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#ff3b5c] animate-pulse" />
          indexed
        </div>
      </div>

      {/* Question & Answer */}
      <div className="grid border-b border-zinc-800 sm:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-zinc-800 p-5 sm:border-b-0 sm:border-r sm:p-6">
          <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Example question
          </div>
          <p className="text-lg font-black leading-snug text-[#fff4ef]">
            How does authentication work in this project?
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
            Example output
          </div>
          <p className="text-sm font-semibold leading-relaxed text-zinc-300">
            {displayedText || fullAnswer}
            {isTyping && (
              <span
                className="ml-0.5 inline-block h-4 w-[2px] bg-[#ff3b5c]"
                style={{ animation: "blink-cursor 0.8s infinite" }}
              />
            )}
          </p>
        </div>
      </div>

      {/* Sources */}
      <div className="divide-y divide-zinc-800">
        {sources.map((source, i) => (
          <div
            key={source.file}
            className="group grid gap-2 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.02] sm:grid-cols-[minmax(0,1fr)_auto] sm:px-6"
            style={{
              animation: `fade-in-up 0.4s ease-out ${0.6 + i * 0.1}s both`,
            }}
          >
            <div>
              <div className="font-mono text-sm font-black text-white transition-colors group-hover:text-[#ff3b5c]">
                {source.file}
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                {source.detail}
              </div>
            </div>
            <div className="self-start border border-zinc-700 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#ff3b5c] transition-colors group-hover:border-[#ff3b5c]/30">
              {source.line}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
