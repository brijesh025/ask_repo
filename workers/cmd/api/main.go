package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/brijesh025/ask_repo/internal/config"
	"github.com/brijesh025/ask_repo/internal/embed"
	httproutes "github.com/brijesh025/ask_repo/internal/http/routes"
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
	cntx := context.Background() /*req.Context() for http routes*/

	store, err := storage.NewPostgres(cntx, cnfg.Database.URL)
	if err != nil {
		log.Fatalf("failed to connect postgress: %s", err)
	}
	defer store.Close()

	log.Printf("connected to postgres successfully")
	if err := store.EnsureSchema(cntx); err != nil {
		log.Fatalf("failed to ensure database schema: %s", err)
	}

	embedder := embed.NewOpenAIEmbedder(os.Getenv("OPENAI_API_KEY"), cnfg.Embedding.Model)

	// setup router
	router := http.NewServeMux()
	httproutes.Register(router, store, embedder)

	// setup HTTP server
	server := http.Server{
		Addr:    cnfg.HTTPServer.Address,
		Handler: router,
	}
	slog.Info("Server Started", slog.String("address", server.Addr))
	err = server.ListenAndServe()
	if err != nil {
		log.Fatalf("failed to start server: %s", err)
	}
}
