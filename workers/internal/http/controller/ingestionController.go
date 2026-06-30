package controller

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/brijesh025/ask_repo/internal/embed"
	"github.com/brijesh025/ask_repo/internal/ingest"
	"github.com/brijesh025/ask_repo/internal/models"
	"github.com/brijesh025/ask_repo/internal/storage"
)

type ingestRepoRequest struct {
	RepoURL   string `json:"repo_url"`
	Name      string `json:"name"`
	LocalPath string `json:"local_path"`
}

type ingestRepoResponse struct {
	Message      string `json:"message"`
	RepositoryID int64  `json:"repository_id"`
	Files        int    `json:"files"`
	Chunks       int    `json:"chunks"`
	Embeddings   int    `json:"embeddings"`
}

func IngestRepoController(store *storage.Storage, embedder embed.Embedder) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		if store == nil {
			writeJSONError(res, http.StatusInternalServerError, "storage is not configured")
			return
		}
		if embedder == nil {
			writeJSONError(res, http.StatusInternalServerError, "embedder is not configured")
			return
		}

		var reqBody ingestRepoRequest
		if err := json.NewDecoder(req.Body).Decode(&reqBody); err != nil {
			writeJSONError(res, http.StatusBadRequest, "invalid request body")
			return
		}

		repoURL := strings.TrimSpace(reqBody.RepoURL)
		localPath := strings.TrimSpace(reqBody.LocalPath)
		if repoURL == "" {
			writeJSONError(res, http.StatusBadRequest, "repo_url is required")
			return
		}
		if localPath == "" {
			writeJSONError(res, http.StatusBadRequest, "local_path is required")
			return
		}
		

		service := ingest.NewService(store, embedder)
		result, err := service.IngestRepo(req.Context(), models.Repository{
			RepoURL:   repoURL,
			Name:      strings.TrimSpace(reqBody.Name),
			LocalPath: localPath,
		})
		if err != nil {
			writeJSONError(res, http.StatusInternalServerError, err.Error())
			return
		}

		writeJSON(res, http.StatusCreated, ingestRepoResponse{
			Message:      "repo ingested successfully",
			RepositoryID: result.RepositoryID,
			Files:        result.Files,
			Chunks:       result.Chunks,
			Embeddings:   result.Embeddings,
		})
	}
}
