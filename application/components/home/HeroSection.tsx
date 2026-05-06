export function HeroSection() {
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
    <section
      id="answer"
      className="relative grid border-b border-zinc-800 text-white lg:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]"
    >
      <div className="relative overflow-hidden border-b border-zinc-800 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-16 xl:p-20">
        <div className="mb-8 inline-flex border border-zinc-700 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
          Semantic repository intelligence
        </div>

        <div className="relative mb-8 max-w-5xl">
          <div
            className="pointer-events-none absolute left-[8%] top-[48%] z-0 h-4 w-[86%] -rotate-[14deg] bg-[#ff3b5c] shadow-[0_0_24px_rgba(255,59,92,0.45)] sm:h-5"
            aria-hidden="true"
          />
          <h1 className="relative z-10 text-5xl font-black leading-[0.96] tracking-normal text-[#fff4ef] sm:text-7xl lg:text-8xl xl:text-[104px]">
            CHAT WITH
            <br />
            ANY GITHUB
            <br />
            REPOSITORY
          </h1>
        </div>

        <p className="mb-10 max-w-2xl text-lg font-semibold leading-8 text-zinc-300 sm:text-xl">
          Connect a repository, ask a plain-English question, and get an answer
          grounded in exact files, functions, and code paths.
        </p>

        <div className="mb-10 flex flex-wrap items-center gap-4">
          <a
            href="#workflow"
            className="bg-[#ff3b5c] px-7 py-4 text-xs font-black tracking-widest text-white transition-colors hover:bg-[#ff244b]"
          >
            SEE HOW IT WORKS
          </a>
          <a
            href="#sources"
            className="flex items-center gap-4 border border-zinc-700 px-6 py-4 text-xs font-black tracking-widest text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
          >
            <span className="text-[#ff3b5c]">&gt;</span> VIEW CODE SOURCES
          </a>
        </div>

        <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-wider text-zinc-300">
          <span className="border border-zinc-700 px-4 py-2">GitHub import</span>
          <span className="border border-zinc-700 px-4 py-2">
            semantic index
          </span>
          <span className="border border-zinc-700 px-4 py-2">
            file citations
          </span>
          <span className="border border-zinc-700 px-4 py-2">repo chat</span>
        </div>
      </div>

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

        <div className="relative ml-auto max-w-md border border-zinc-700 bg-[#201b1b]/90">
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

          <div className="border-b border-zinc-800 p-5">
            <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Example query
            </div>
            <p className="text-lg font-black leading-snug text-[#fff4ef]">
              How does authentication work in this project?
            </p>
          </div>

          <div className="p-5">
            <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
              AskRepo answer
            </div>
            <p className="mb-5 text-sm font-semibold leading-6 text-zinc-300">
              Requests pass through the auth middleware, the token is validated,
              user context is attached, and protected routes reject missing or
              expired sessions.
            </p>

            <div id="sources" className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.file}
                  className="border-l-2 border-[#ff3b5c] bg-[#2b2525] px-4 py-3"
                >
                  <div className="font-mono text-sm font-black text-white">
                    {source.file}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-zinc-400">
                    {source.line} / {source.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid max-w-md gap-3 text-xs font-bold text-zinc-300 sm:grid-cols-3">
          <div className="border border-zinc-800 bg-[#111111]/80 p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">
              Step 01
            </div>
            <div className="mt-2">Read repo tree</div>
          </div>
          <div className="border border-zinc-800 bg-[#111111]/80 p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">
              Step 02
            </div>
            <div className="mt-2">Retrieve context</div>
          </div>
          <div className="border border-zinc-800 bg-[#111111]/80 p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">
              Step 03
            </div>
            <div className="mt-2">Answer with files</div>
          </div>
        </div>
      </div>
    </section>
  );
}
