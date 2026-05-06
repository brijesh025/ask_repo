export function BottomSection() {
  const steps = [
    {
      number: "01",
      title: "Connect a repository",
      body: "Pick a GitHub repo and let AskRepo read the source files it needs for code understanding.",
    },
    {
      number: "02",
      title: "Build a code map",
      body: "Files, functions, routes, and docs are split into searchable chunks with paths and line references preserved.",
    },
    {
      number: "03",
      title: "Ask and inspect",
      body: "Ask in plain English, then open the exact files and snippets used to support the answer.",
    },
  ];

  const answerIncludes = [
    "Short explanation of the code path",
    "Files, functions, and line ranges",
    "Retrieved snippets that justify the answer",
    "Follow-up questions scoped to the same repo",
  ];

  return (
    <section id="workflow" className="text-white">
      <div className="grid border-b border-zinc-800 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-[#ff3b5c]">
            How AskRepo works
          </div>
          <h2 className="max-w-xl text-3xl font-black leading-tight text-[#fff4ef] sm:text-4xl">
            From a repository to an answer you can verify.
          </h2>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-zinc-400">
            AskRepo is built for developers who need to understand unfamiliar
            code quickly without trusting a summary that cannot point back to
            the source.
          </p>
        </div>

        <div className="grid sm:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="border-b border-zinc-800 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:p-8 sm:last:border-r-0"
            >
              <div className="mb-8 font-mono text-xs font-black text-[#ff3b5c]">
                {step.number}
              </div>
              <h3 className="text-xl font-black text-[#fff4ef]">{step.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-6 text-zinc-400">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
