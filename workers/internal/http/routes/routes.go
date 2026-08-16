package routes

import (
	"net/http"

	"github.com/brijesh025/ask_repo/internal/embed"
	"github.com/brijesh025/ask_repo/internal/http/controller"
	"github.com/brijesh025/ask_repo/internal/search"
	"github.com/brijesh025/ask_repo/internal/storage"
)

func Register(router *http.ServeMux, store *storage.Storage, embedder embed.Embedder, localStoragePath string, searchService *search.Service) {

	router.HandleFunc("GET /", controller.Home)
	router.HandleFunc("GET /health", controller.Health)
	router.HandleFunc("GET /api/v1/health", controller.Health)

	router.HandleFunc("POST /repos/clone", controller.CloneRepoController(localStoragePath))
	router.HandleFunc("POST /repos/ingest", controller.IngestRepoController(store, embedder, localStoragePath))
	router.HandleFunc("POST /repos/retrieve", controller.RetrieveController(searchService))

	router.HandleFunc("POST /api/v1/repos/clone", controller.CloneRepoController(localStoragePath))
	router.HandleFunc("POST /api/v1/repos/ingest", controller.IngestRepoController(store, embedder, localStoragePath))
	router.HandleFunc("POST /api/v1/repos/retrieve", controller.RetrieveController(searchService))
}
