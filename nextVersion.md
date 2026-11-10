# AskRepo Version 2 Plan

## Purpose

Version 2 will improve repository understanding and answer quality through a staged retrieval pipeline:

```text
Repository files
    -> AST-aware code chunks
    -> embeddings and metadata in PostgreSQL/pgvector
    -> semantic candidate retrieval
    -> result reranking
    -> grounded answer generation
```

The implementation will be incremental. Each stage must work with the existing local application before the next stage is added.

## Current baseline

The repository already contains:

- A Next.js frontend for repository selection, chat, and source references.
- A Go worker for repository scanning, ingestion, embedding, storage, and retrieval.
- File filtering and language detection in `workers/internal/services`.
- Fixed-size chunking in `workers/internal/chunk/chunker.go` using 80 lines with 20 lines of overlap.
- PostgreSQL storage with pgvector in `workers/internal/storage`.
- Embedding-provider abstractions in `workers/internal/embed`.
- Semantic vector retrieval in `workers/internal/storage/search_table.go`.
- Answer generation through the existing search service and LLM provider.

The main Version 2 limitation is that chunks are currently line-based and retrieval only orders results by vector distance. The system does not yet preserve symbols, AST structure, lexical matches, or a second-stage relevance score.

## Version 2 goals

1. Produce meaningful chunks based on syntax and symbols instead of arbitrary line ranges.
2. Preserve precise source metadata so every result remains inspectable in the UI.
3. Retrieve a broad semantic candidate set for each question.
4. Rerank candidates using stronger relevance signals before answer generation.
5. Keep the existing answer and source-reference experience working during the migration.
6. Make the pipeline testable with deterministic local fixtures and provider-independent unit tests.

## Non-goals for Version 2

- Full architecture-level reasoning across every repository.
- Complete import-graph or call-graph analysis.
- A new production deployment system.
- Replacing the current embedding or LLM providers without a demonstrated need.
- Fabricated search results when parsing, embedding, or retrieval configuration is unavailable.

## Target architecture

```text
Scan file
  -> detect language and parser
  -> parse AST when supported
  -> extract declarations and useful code regions
  -> split oversized regions with structural boundaries
  -> attach symbol and parent metadata
  -> embed chunk text
  -> persist chunks and embeddings

Question
  -> embed query
  -> retrieve semantic candidates (large top-K)
  -> optionally compute lexical/metadata features
  -> rerank candidates
  -> select final context (small top-K)
  -> generate source-grounded answer
```

Unsupported languages or files must use a clearly defined fallback chunker. The fallback must retain the current line numbers and must be observable in logs or chunk metadata.

## Phase 0: establish the baseline

Before changing retrieval behavior:

- Add or confirm Go tests for the current line-based chunker, scanner, embedding attachment, and vector search result mapping.
- Record a small set of representative repositories or fixture files covering Go, TypeScript/TSX, JavaScript/JSX, Python, Markdown, JSON, and unsupported syntax.
- Define baseline measurements:
  - number of indexed files and chunks;
  - ingestion duration;
  - empty or failed parses;
  - retrieval results for a fixed question set;
  - answer context size.
- Verify that `go test ./...`, the worker build, and the frontend build/lint run successfully before the migration.

Deliverable: a repeatable baseline that allows AST chunking and reranking to be compared against the current behavior.

## Phase 1: AST-based chunking

### 1.1 Define the chunk contract

Extend the code-chunk model and database representation with metadata needed for retrieval and source navigation. The exact schema should be finalized before implementation, but the contract should support:

```json
{
  "repository_id": 1,
  "file_id": 10,
  "file_path": "src/auth/service.ts",
  "language": "typescript",
  "symbol": "authenticateUser",
  "symbol_kind": "function",
  "parent_symbol": "AuthService",
  "start_line": 20,
  "end_line": 75,
  "chunk_index": 0,
  "chunk_strategy": "ast",
  "content": "..."
}
```

The existing fields (`file_path`, `chunk_text`, `start_line`, and `end_line`) must remain available for compatibility.

### 1.2 Choose and isolate parsers

- Introduce a parser interface in the chunk package.
- Select a Go-compatible parser strategy for each initially supported language.
- Keep language-specific parsing behind adapters rather than scattering parser checks through ingestion.
- Start with the languages most relevant to this repository: Go, TypeScript, JavaScript, TSX/JSX, and Python.
- Treat Markdown, JSON, YAML, SQL, and plain text as structured or fallback content where AST parsing is not appropriate.

### 1.3 Extract structural chunks

For supported source files, identify useful nodes such as:

- functions and methods;
- classes, structs, and interfaces;
- exported declarations;
- route handlers, middleware, services, and React components where the parser exposes them;
- meaningful top-level declarations and configuration blocks.

Each chunk should include enough surrounding context to be understandable, such as the declaration signature, relevant imports, and the parent type or module name. Do not duplicate an entire file into every child chunk without a size limit.

### 1.4 Handle size and edge cases

- Define a token/line limit for a single AST chunk.
- Split oversized nodes recursively at child declarations or safe line boundaries.
- Merge very small adjacent related nodes when that improves context.
- Preserve exact one-based source line ranges.
- Avoid overlapping chunks by default; introduce limited context overlap only when needed and document it.
- Fall back to the current line-based strategy when parsing fails or a language is unsupported.
- Mark the selected strategy (`ast`, `fallback`, or another explicit value) for diagnostics.

### 1.5 Integrate with ingestion

- Replace the direct call to `chunk.SplitIntoChunks` with a chunking service that receives file language and content.
- Keep embedding and storage stages unchanged initially.
- Ensure re-ingestion replaces all chunks for a file and does not leave stale AST metadata.
- Make parser failures non-fatal for the whole repository when a safe fallback is possible.

### 1.6 Verify Phase 1

- Unit-test node extraction, nested declarations, anonymous functions, syntax errors, empty files, and oversized declarations.
- Test line ranges against fixture files.
- Test fallback behavior for unsupported languages and malformed source.
- Re-ingest a local repository and inspect stored chunk metadata and source references.
- Confirm the frontend still renders the returned source chunks.

Exit criterion: supported files are indexed into meaningful symbol-aware chunks, fallback behavior is explicit, and existing ingestion/retrieval still works.

## Phase 2: semantic search foundation

The current system already performs vector search, so this phase makes semantic retrieval a deliberate, observable stage rather than changing the user-facing contract immediately.

### 2.1 Separate retrieval from answer generation

Refactor the search service into clear stages:

1. validate the question and repository scope;
2. embed the query;
3. retrieve semantic candidates;
4. apply post-processing and deduplication;
5. select final context;
6. generate the answer.

The retrieval stage should be independently callable and testable.

### 2.2 Retrieve a candidate pool

- Retrieve a larger candidate pool than the final answer context, for example `candidateK` followed by `finalK`.
- Keep repository filtering mandatory when a repository ID is supplied.
- Exclude rows without embeddings from semantic retrieval.
- Return enough metadata for later reranking: chunk ID, file ID/path, language, symbol fields, line range, vector distance, and chunk strategy.
- Deduplicate overlapping or near-identical chunks from the same source region.

Candidate limits should be configurable, validated, and bounded to protect latency and prompt size.

### 2.3 Improve vector-storage readiness

- Confirm embedding dimensions are consistent between configuration, schema, and provider output.
- Add an appropriate pgvector index after measuring local query behavior and choosing the index type/configuration.
- Add indexes for repository/file filtering and any fields used by reranking.
- Define behavior for repositories indexed with an older embedding dimension or chunk schema.

### 2.4 Verify Phase 2

- Unit-test query validation, repository isolation, candidate limits, empty results, and deduplication.
- Add an integration test against PostgreSQL/pgvector when the local database is available.
- Compare semantic retrieval on the baseline question set using AST chunks versus line chunks.

Exit criterion: semantic retrieval is an explicit service with a stable candidate contract and measurable behavior.

## Phase 3: reranking

Reranking should operate on the semantic candidate pool and produce the final evidence set. It must be introduced behind an interface so the first implementation can be deterministic and provider-independent.

### 3.1 Define the reranker interface

Create a small interface that accepts the question and candidates and returns candidates with ranking information. The result should preserve the original vector distance and add fields such as:

- final score;
- rerank score or component scores;
- rank before reranking;
- rank after reranking;
- reason/features used, where useful for debugging.

### 3.2 Implement a first deterministic reranker

Start with a transparent local reranker using weighted signals such as:

- semantic similarity from pgvector;
- lexical overlap between question terms and chunk text/symbol/path;
- exact matches on symbol names and file paths;
- symbol/declaration quality;
- repository and language filters;
- duplicate and overlapping-region penalties;
- a small preference for complete AST declarations over fragments.

Keep weights configurable and document them. The first version should not require an external reranking API.

### 3.3 Add an optional model-based reranker later

Only after the deterministic reranker is measured should an external or LLM-based reranker be considered. It must have:

- a timeout and failure fallback to deterministic ranking;
- bounded candidate input;
- provider configuration that does not expose secrets to the frontend;
- cost and latency measurement;
- tests for malformed or incomplete provider responses.

### 3.4 Integrate final context selection

- Retrieve `candidateK` semantic results.
- Rerank them.
- Select `finalK` results for the answerer.
- Preserve source metadata and ranking details in the worker response where useful to the UI.
- Ensure prompt construction uses the final set and stays within a defined context budget.

### 3.5 Verify Phase 3

- Unit-test score calculation, tie handling, duplicate removal, and deterministic ordering.
- Test reranker failure and timeout fallback.
- Evaluate the fixed question set for relevance, source diversity, and answer grounding.
- Confirm the answerer receives only the final selected context.

Exit criterion: reranking improves or maintains retrieval relevance on the evaluation set without making retrieval unavailable when reranking fails.

## Phase 4: API and UI observability

After the worker pipeline is stable:

- Keep the existing retrieve request compatible: `question`, `repository_id`, and `top_k`.
- Add optional configuration for candidate count, final count, and reranker mode.
- Extend response chunks carefully with symbol, language, strategy, and ranking fields.
- Update frontend types and source cards to show symbol names and accurate line ranges.
- Keep provider errors readable and actionable.
- Add a debug mode or internal logging for retrieval stages without exposing secrets or full repository contents unnecessarily.

## Data model and migration strategy

Prefer an additive migration strategy:

1. Add nullable metadata columns for symbol and chunk strategy.
2. Add indexes required by retrieval and reranking.
3. Backfill by re-ingesting repositories rather than guessing AST metadata for old chunks.
4. Version the chunking/indexing behavior so future changes can invalidate or rebuild stale records.
5. Keep destructive schema changes out of the first implementation until old data has a safe migration path.

The ingestion result should eventually report counts for AST chunks, fallback chunks, parser failures, and embeddings so a repository can be diagnosed after indexing.

## Testing and evaluation plan

### Automated tests

- Chunker tests per supported language and fallback path.
- Exact line-range and symbol-metadata tests.
- Ingestion tests for replacement and re-ingestion.
- Storage tests for schema, repository isolation, and vector retrieval.
- Reranker tests with fixed candidates and expected ordering.
- Search-service tests that verify stage ordering and failure handling.
- Frontend type/build/lint checks after response-shape changes.

### Retrieval evaluation set

Create a small manually verified set of questions covering:

- symbol lookup;
- file or module responsibility;
- request flow across files;
- authentication or authorization flow;
- data/storage operations;
- configuration lookup;
- questions with no answer in the repository.

For each question, record expected files/symbols and whether the answer is grounded. Compare:

- fixed-line chunks + vector search;
- AST chunks + vector search;
- AST chunks + vector search + reranking.

Useful measurements include relevant-result hit rate, top-k source precision, duplicate rate, empty-result rate, ingestion duration, retrieval latency, and answer context size.

## Proposed implementation order

1. Add baseline tests and fixture files.
2. Define extended chunk metadata and additive schema changes.
3. Add parser interfaces and the first AST adapters.
4. Implement AST chunk extraction, size handling, and explicit fallback.
5. Integrate AST chunking into ingestion and verify stored metadata.
6. Refactor semantic retrieval into a standalone candidate stage.
7. Add candidate deduplication and configurable candidate/final limits.
8. Implement the deterministic reranker.
9. Integrate reranking into answer generation.
10. Update API types/UI source display and add observability.
11. Run the evaluation set and tune only from measured results.

## Version 2 completion criteria

Version 2 is complete when:

- supported source files produce AST-aware chunks with accurate symbols and line ranges;
- unsupported or malformed files use an explicit, tested fallback;
- ingestion stores embeddings and all required metadata consistently;
- semantic retrieval returns a bounded candidate pool scoped to the selected repository;
- reranking selects final context using deterministic, tested behavior;
- reranker failure safely falls back without losing basic retrieval;
- answers remain grounded in returned source references;
- the existing frontend flow works with the expanded response metadata;
- the evaluation set shows an improvement over the current fixed-line/vector baseline;
- local builds, tests, and ingestion/retrieval smoke tests pass.

## First implementation task

Begin with Phase 0 and Phase 1. The first code change should establish fixture-based chunker tests and the chunk metadata contract, then implement AST chunking for one language at a time. Do not add reranking until AST chunks are stored, displayed, and verified through the existing semantic retrieval path.
