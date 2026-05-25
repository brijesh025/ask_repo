package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"

	"github.com/brijesh025/ask_repo/internal/config"
	"github.com/brijesh025/ask_repo/internal/storage"
	"github.com/joho/godotenv"
)

func main() {
	// load configuration
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found")
	}
	cnfg := config.MustLoad()

	// load DB
	cntx := context.Background()

	store, err := storage.NewPostgres(cntx, cnfg.Database.URL)
	if err != nil {
		log.Fatalf("failed to connect postgress: %s", err)
	}
	defer store.Close()

	log.Printf("connected to postgres successfully")

	// setup router
	router := http.NewServeMux()
	router.Handle("GET /", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print("Welcome to HomePage")
		w.Write([]byte("Welcome to AskRepo API"))
	}))
	// setup HTTP server
	server := http.Server{
		Addr:    cnfg.HTTPServer.Address,
		Handler: router,
	}
	slog.Info("Server Started", slog.String("address", cnfg.HTTPServer.Address))
	err = server.ListenAndServe()
	if err != nil {
		log.Fatalf("failed to start server: %s", err)
	}
}
