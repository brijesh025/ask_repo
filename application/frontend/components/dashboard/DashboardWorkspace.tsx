"use client";

import { useState } from "react";
import { AnalyzedReposPanel } from "@/components/dashboard/AnalyzedReposPanel";
import { RepositoryList } from "@/components/dashboard/RepositoryList";

type DashboardTab = "available" | "analyzed";

export function DashboardWorkspace() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("available");

  return (
    <div>
      <div className="mb-6 flex border border-zinc-800 bg-[#111111] p-1 text-xs font-black uppercase tracking-widest text-zinc-400">
        <button
          type="button"
          onClick={() => setActiveTab("available")}
          className={`flex-1 px-4 py-3 transition-colors ${
            activeTab === "available"
              ? "bg-[#ff3b5c] text-white"
              : "hover:bg-zinc-900 hover:text-white"
          }`}
        >
          Available Repos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("analyzed")}
          className={`flex-1 px-4 py-3 transition-colors ${
            activeTab === "analyzed"
              ? "bg-[#ff3b5c] text-white"
              : "hover:bg-zinc-900 hover:text-white"
          }`}
        >
          Analyzed Repositories
        </button>
      </div>

      {activeTab === "available" ? <RepositoryList /> : <AnalyzedReposPanel />}
    </div>
  );
}
