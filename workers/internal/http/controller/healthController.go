package controller

import "net/http"

func Health(res http.ResponseWriter, req *http.Request) {
	writeJSON(res, http.StatusOK, map[string]string{
		"status":  "ok",
		"service": "askrepo-worker",
	})
}
