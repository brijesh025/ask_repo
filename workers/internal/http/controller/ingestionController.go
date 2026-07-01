package controller

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/brijesh025/ask_repo/internal/embed"
	"github.com/brijesh025/ask_repo/internal/git"
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
	Message      string   `json:"message"`
	RepositoryID int64    `json:"repository_id"`
	Files        int      `json:"files"`
	Chunks       int      `json:"chunks"`
	Embeddings   int      `json:"embeddings"`
	LocalPath    string   `json:"local_path"`
	Cloned       bool     `json:"cloned"`
	SampleFiles  []string `json:"sample_files"`
}

func IngestRepoController(store *storage.Storage, embedder embed.Embedder, localStoragePath string) http.HandlerFunc {
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
			repoName, err := repoNameFromURL(repoURL)
			if err != nil {
				writeJSONError(res, http.StatusBadRequest, err.Error())
				return
			}
			if strings.TrimSpace(localStoragePath) == "" {
				writeJSONError(res, http.StatusInternalServerError, "local storage path is not configured")
				return
			}
			localPath = filepath.Join(localStoragePath, repoName)
		}

		cloned := false
		info, err := os.Stat(localPath)
		if err != nil {
			if !os.IsNotExist(err) {
				writeJSONError(res, http.StatusInternalServerError, "repo path is not readable")
				return
			}
			if err := git.CloneRepo(repoURL, localPath); err != nil {
				writeJSONError(res, http.StatusInternalServerError, err.Error())
				return
			}
			cloned = true
			info, err = os.Stat(localPath)
			if err != nil {
				writeJSONError(res, http.StatusInternalServerError, "repo was cloned but path is not readable")
				return
			}
		}
		if !info.IsDir() {
			writeJSONError(res, http.StatusBadRequest, "repo path is not a directory")
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
			LocalPath:    localPath,
			Cloned:       cloned,
			SampleFiles:  result.SampleFiles,
		})
	}
}
