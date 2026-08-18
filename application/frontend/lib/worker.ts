/**
 * Worker API client — types and fetch wrappers for the Go worker
 * running on localhost:8000 (proxied through Next.js API routes).
 */

const WORKER_API = "/api/worker";

// ─── Ingestion ───────────────────────────────────────────────

export type IngestRequest = {
  repo_url: string;
  name?: string;
};

export type IngestResponse = {
  message: string;
  repository_id: number;
  files: number;
  chunks: number;
  embeddings: number;
  local_path: string;
  cloned: boolean;
  sample_files: string[];
};

// ─── Retrieval ───────────────────────────────────────────────

export type RetrievedChunk = {
  id: number;
  repository_id: number;
  file_path: string;
  chunk_text: string;
  start_line: number;
  end_line: number;
  distance: number;
};

export type RetrieveResponse = {
  question: string;
  answer: string;
  chunks: RetrievedChunk[];
};

// ─── API Functions ───────────────────────────────────────────

export async function ingestRepo(
  repoUrl: string,
  name?: string,
): Promise<IngestResponse> {
  const res = await fetch(`${WORKER_API}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl, name } satisfies IngestRequest),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Ingestion failed");
  }
  return data as IngestResponse;
}

export async function retrieveAnswer(
  question: string,
  repositoryId: number,
  topK?: number,
): Promise<RetrieveResponse> {
  const res = await fetch(`${WORKER_API}/retrieve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      repository_id: repositoryId,
      top_k: topK,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Retrieval failed");
  }
  return data as RetrieveResponse;
}
