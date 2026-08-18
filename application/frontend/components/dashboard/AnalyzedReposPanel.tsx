import { Database } from "lucide-react";

export function AnalyzedReposPanel() {
  return (
    <section className="border border-zinc-800 bg-[#111111]">
      <div className="border-b border-zinc-800 px-6 py-6 sm:px-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Saved Work
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#fff4ef]">
          Analyzed repositories
        </h2>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="border border-dashed border-zinc-700 bg-[#151313] px-5 py-10 text-center">
          <Database className="mx-auto h-9 w-9 text-zinc-500" />
          <p className="mt-4 text-sm font-semibold text-zinc-400">
            No analyzed repositories yet. Once a repo finishes the AskRepo
            pipeline, it will continue from here with its saved files, chunks,
            chat history, and repository state.
          </p>
        </div>
      </div>
    </section>
  );
}
