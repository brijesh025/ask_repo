package routes

import (
	"net/http"
	"strings"
)

func WithCORS(next http.Handler, allowedOrigin string) http.Handler {
	allowedOrigin = strings.TrimSpace(allowedOrigin)
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		res.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		res.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		res.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if req.Method == http.MethodOptions {
			res.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(res, req)
	})
}
