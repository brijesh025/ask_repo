"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  GitFork,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";

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

  useEffect(() => {
    const cachedRepos = window.sessionStorage.getItem("askrepo.github.repos");
    if (!cachedRepos) {
      return;
    }

    try {
      const parsedRepos = JSON.parse(cachedRepos) as Repository[];
      setRepos(parsedRepos);
      setStatus("success");
    } catch {
      window.sessionStorage.removeItem("askrepo.github.repos");
    }
  }, []);

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
      window.sessionStorage.setItem(
        "askrepo.github.repos",
        JSON.stringify(data.repos ?? []),
      );
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

  function analysisHref(repo: Repository) {
    const [owner, name] = repo.fullName.split("/");
    const pathname = `/dashboard/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
    return `${pathname}?url=${encodeURIComponent(repo.url)}`;
  }

  return (
    <section className="border border-zinc-800 bg-[#111111] lg:min-h-[620px]">
      <div className="flex flex-col gap-4 border-b border-zinc-800 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Repository Workspace
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#fff4ef]">
            Available repositories
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-zinc-500">
            Fetch your GitHub repositories, then choose which codebase should go
            through the AskRepo ingestion pipeline.
          </p>
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

      <div className="px-6 py-6 sm:px-8">
        {status === "idle" && (
          <div className="border border-dashed border-zinc-700 bg-[#151313] px-5 py-10 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-zinc-500" />
            <p className="mt-4 text-sm font-semibold text-zinc-400">
              Repositories are not fetched yet. Fetch them when you are ready to
              pick a codebase for AskRepo.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="border border-red-900/60 bg-red-950/20 px-5 py-4 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        {status === "success" && repos.length === 0 && (
          <div className="border border-dashed border-zinc-700 bg-[#151313] px-5 py-10 text-center">
            <p className="text-sm font-semibold text-zinc-400">
              No repositories were returned from GitHub for this account.
            </p>
          </div>
        )}

        {repos.length > 0 && (
          <div className="grid gap-3">
            {repos.map((repo) => (
              <article
                key={repo.id}
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

                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#fff4ef]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </a>

                  <Link
                    href={analysisHref(repo)}
                    className="inline-flex items-center justify-center gap-2 bg-[#ff3b5c] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#ff244b]"
                  >
                    Analyze Repo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
