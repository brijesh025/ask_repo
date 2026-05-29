package routes

import (
	"net/http"

	"github.com/brijesh025/ask_repo/internal/config"
	"github.com/brijesh025/ask_repo/internal/http/controller"
)

func Register(router *http.ServeMux, cnfg *config.Config) {

	router.HandleFunc("GET /", home)
	router.HandleFunc("POST /repos/clone", controller.CloneRepo)
}

func home(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("Welcome to AskRepo API"))
}
