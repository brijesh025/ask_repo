import React from 'react'

export const RightHeroSec = () => {
    const useSteps = [
    {
      number: "01",
      title: "Connect your repo",
      body: "Choose a GitHub repository so AskRepo can read the code structure.",
    },
    {
      number: "02",
      title: "Ask naturally",
      body: "Write the question the way you would ask another developer.",
    },
    {
      number: "03",
      title: "Verify the answer",
      body: "Review the cited files, line ranges, and retrieved snippets.",
    },
  ];

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
  return (
    <div>
        <div className="relative min-h-[600px] overflow-hidden bg-[#151313] p-6 sm:p-10 lg:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="relative ml-auto flex h-full max-w-lg flex-col justify-center gap-5">
          <div className="border border-zinc-700 bg-[#201b1b]/90">
            <div className="border-b border-zinc-800 px-5 py-5">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
                How to use
              </div>
              <h2 className="mt-2 text-2xl font-black leading-tight text-[#fff4ef]">
                Connect a repo, ask a question, then inspect the evidence.
              </h2>
            </div>

            <div className="divide-y divide-zinc-800">
              {useSteps.map((step) => (
                <div key={step.number} className="grid grid-cols-[56px_1fr] p-5">
                  <div className="font-mono text-xs font-black text-[#ff3b5c]">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#fff4ef]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-zinc-400">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-zinc-700 bg-[#151313]/95">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Repository
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-[#fff4ef]">
                  github.com/team/api
                </div>
              </div>
              <div className="border border-[#ff3b5c]/50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
                indexed
              </div>
            </div>

            <div className="grid border-b border-zinc-800 sm:grid-cols-[0.88fr_1.12fr]">
              <div className="border-b border-zinc-800 p-5 sm:border-b-0 sm:border-r">
                <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Example question
                </div>
                <p className="text-lg font-black leading-snug text-[#fff4ef]">
                  How does authentication work in this project?
                </p>
              </div>
              <div className="p-5">
                <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
                  Example output
                </div>
                <p className="text-sm font-semibold leading-6 text-zinc-300">
                  Requests pass through middleware, the token is validated,
                  user context is attached, and private routes reject missing or
                  expired sessions.
                </p>
              </div>
            </div>

            <div id="sources" className="divide-y divide-zinc-800">
              {sources.map((source) => (
                <div
                  key={source.file}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div>
                    <div className="font-mono text-sm font-black text-white">
                      {source.file}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-zinc-400">
                      {source.detail}
                    </div>
                  </div>
                  <div className="self-start border border-zinc-700 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
                    {source.line}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
