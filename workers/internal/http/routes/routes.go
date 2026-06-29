package routes

import (
	"net/http"

	"github.com/brijesh025/ask_repo/internal/http/controller"
	"github.com/brijesh025/ask_repo/internal/storage"
)

func Register(router *http.ServeMux, store *storage.Storage) {

	router.HandleFunc("GET /", home)
	router.HandleFunc("POST /repos/clone", controller.CloneRepo)
	router.HandleFunc("POST /repos/ingest", controller.IngestRepo(store))
}

func home(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("Welcome to AskRepo API"))
}
