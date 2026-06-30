package controller

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/brijesh025/ask_repo/internal/config"
	"github.com/brijesh025/ask_repo/internal/git"
	"github.com/joho/godotenv"
)

var safeRepoNamePattern = regexp.MustCompile(`[^a-zA-Z0-9._-]+`)

type cloneRepoRequest struct {
	RepoURL string `json:"repo_url"`
}

type cloneRepoResponse struct {
	Message   string `json:"message"`
	RepoURL   string `json:"repo_url"`
	LocalPath string `json:"local_path"`
}


func CloneRepoController(res http.ResponseWriter, req *http.Request) {
	err := godotenv.Load(); if(err!=nil) {
		writeJSONError(res, http.StatusInternalServerError, "Not able to load environment variables.")
	} 

	var localStoragePath = config.MustLoad().LocalStorage.Path;
	var reqBody cloneRepoRequest
	if err := json.NewDecoder(req.Body).Decode(&reqBody); err != nil {
		writeJSONError(res, http.StatusBadRequest, "invalid request body")
		return
	}

	repoURL := strings.TrimSpace(reqBody.RepoURL)
	if repoURL == "" {
		writeJSONError(res, http.StatusBadRequest, "repo_url is required")
		return
	}
	if strings.TrimSpace(localStoragePath)==""{
		writeJSONError(res, http.StatusInternalServerError, "Intial local storage path is not found")
	}

	repoName, err := repoNameFromURL(repoURL)
	if err != nil {
		writeJSONError(res, http.StatusBadRequest, err.Error())
		return
	}

	targetDir := filepath.Join(localStoragePath, repoName)
	if err := git.CloneRepo(repoURL, targetDir); err != nil {
		writeJSONError(res, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(res, http.StatusCreated, cloneRepoResponse{
		Message:   "repo cloned successfully",
		RepoURL:   repoURL,
		LocalPath: targetDir,
	})
}

func repoNameFromURL(rawURL string) (string, error) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil || parsedURL.Scheme == "" || parsedURL.Host == "" {
		return "", errors.New("Repo URL must be a valid absolute URL")
	}

	repoName := strings.TrimSuffix(path.Base(parsedURL.Path), ".git")
	repoName = strings.TrimSpace(repoName)
	if repoName == "" || repoName == "." || repoName == "/" {
		return "", errors.New("Repo URL must include a repository name")
	}

	safeName := strings.Trim(safeRepoNamePattern.ReplaceAllString(repoName, "-"), ".-")
	if safeName == "" {
		return "", errors.New("repository name is not valid")
	}

	return safeName, nil
}

func writeJSON(res http.ResponseWriter, statusCode int, data any) {
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(statusCode)
	json.NewEncoder(res).Encode(data)
}

func writeJSONError(res http.ResponseWriter, statusCode int, message string) {
	writeJSON(res, statusCode, map[string]string{"error": message})
}
