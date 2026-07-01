package controller

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/brijesh025/ask_repo/internal/search"
)

type retrieveRequest struct {
	Question     string `json:"question"`
	RepositoryID int64  `json:"repository_id"`
	TopK         int    `json:"top_k"`
}

func RetrieveController(searchService *search.Service) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		if searchService == nil {
			writeJSONError(res, http.StatusInternalServerError, "retrieval service is not configured")
			return
		}

		var reqBody retrieveRequest
		if err := json.NewDecoder(req.Body).Decode(&reqBody); err != nil {
			writeJSONError(res, http.StatusBadRequest, "invalid request body")
			return
		}

		if strings.TrimSpace(reqBody.Question) == "" {
			writeJSONError(res, http.StatusBadRequest, "question is required")
			return
		}

		result, err := searchService.AnswerQuestion(req.Context(), reqBody.Question, reqBody.RepositoryID, reqBody.TopK)
		if err != nil {
			writeJSONError(res, http.StatusInternalServerError, err.Error())
			return
		}

		writeJSON(res, http.StatusOK, result)
	}
}
