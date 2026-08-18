"use client";

import { useState, useCallback } from "react";
import { ingestRepo, type IngestResponse } from "@/lib/worker";

export type IngestionStatus = "idle" | "ingesting" | "success" | "error";

export type IngestionState = {
  status: IngestionStatus;
  result: IngestResponse | null;
  error: string | null;
};

export function useIngestion() {
  const [state, setState] = useState<IngestionState>({
    status: "idle",
    result: null,
    error: null,
  });

  const startIngestion = useCallback(
    async (repoUrl: string, name?: string) => {
      setState({ status: "ingesting", result: null, error: null });

      try {
        const result = await ingestRepo(repoUrl, name);
        setState({ status: "success", result, error: null });
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ingestion failed";
        setState({ status: "error", result: null, error: message });
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState({ status: "idle", result: null, error: null });
  }, []);

  return {
    ...state,
    isReady: state.status === "success" && state.result !== null,
    repositoryId: state.result?.repository_id ?? null,
    startIngestion,
    reset,
  };
}
