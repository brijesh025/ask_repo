package main

import (
	"log"

	"github.com/brijesh025/ask_repo/internal/config"
	"github.com/brijesh025/ask_repo/internal/git"
	"github.com/joho/godotenv"
)

func main(){
	if err := godotenv.Load(); err!=nil {
		log.Printf("Not able to load .env due to, %s", err);
	}
	local_path := config.MustLoad().LocalStorage.Path
	git.CloneRepo("https://github.com/brijesh025/students-api.git", local_path)
}
