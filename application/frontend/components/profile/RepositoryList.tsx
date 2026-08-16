"use client";

import { useState } from "react";
import { BookOpen, GitFork, Loader2, RefreshCw, Star } from "lucide-react";

type Repository = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
};

export function RepositoryList() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function fetchRepositories() {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/github/repos", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to fetch repositories");
      }

      setRepos(data.repos ?? []);
      setStatus("success");
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to fetch repositories",
      );
      setStatus("error");
    }
  }

  return (
    <section className="border-t border-zinc-800 px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Repository Access
          </p>
          <h2 className="mt-2 text-xl font-black text-[#fff4ef]">
            GitHub repositories
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchRepositories}
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 bg-[#ff3b5c] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#ff244b] disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {repos.length > 0 ? "Refresh Repos" : "Fetch Repos"}
        </button>
      </div>

      {status === "idle" && (
        <div className="mt-6 border border-dashed border-zinc-700 bg-[#151313] px-5 py-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-zinc-500" />
          <p className="mt-4 text-sm font-semibold text-zinc-400">
            Repositories are not fetched yet. Fetch them when you are ready to
            choose a codebase for AskRepo.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 border border-red-900/60 bg-red-950/20 px-5 py-4 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

      {status === "success" && repos.length === 0 && (
        <div className="mt-6 border border-dashed border-zinc-700 bg-[#151313] px-5 py-8 text-center">
          <p className="text-sm font-semibold text-zinc-400">
            No repositories were returned from GitHub for this account.
          </p>
        </div>
      )}

      {repos.length > 0 && (
        <div className="mt-6 grid gap-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group border border-zinc-800 bg-[#151313] p-4 transition-colors hover:border-[#ff3b5c]/70"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-[#fff4ef] group-hover:text-[#ff6b81]">
                      {repo.fullName}
                    </h3>
                    <span className="border border-zinc-700 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {repo.private ? "Private" : "Public"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {repo.description ?? "No description provided."}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 text-xs font-bold text-zinc-500">
                  <span>{repo.language ?? "Code"}</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    {repo.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" />
                    {repo.forks}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
