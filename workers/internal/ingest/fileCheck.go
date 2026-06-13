package ingest

import (
	"path/filepath"
	"strings"
)

const maxFileSizeBytes int64 = 1024 * 1024

var ignoredDirs = map[string]bool{
	".git":         true,
	".next":        true,
	".turbo":       true,
	".vscode":      true,
	".idea":        true,
	"node_modules": true,
	"dist":         true,
	"build":        true,
	"coverage":     true,
	"vendor":       true,
	"__pycache__":  true,
}

var ignoredFileNames = map[string]bool{
	".env":              true,
	".env.local":        true,
	"package-lock.json": true,
	"pnpm-lock.yaml":    true,
	"yarn.lock":         true,
	"go.sum":            true,
}

var allowedFileNames = map[string]string{
	"Dockerfile": "dockerfile",
	"Makefile":   "makefile",
}

var languageByExtension = map[string]string{
	".c":    "c",
	".cpp":  "cpp",
	".css":  "css",
	".go":   "go",
	".h":    "c",
	".html": "html",
	".java": "java",
	".js":   "javascript",
	".json": "json",
	".jsx":  "javascript",
	".md":   "markdown",
	".py":   "python",
	".rs":   "rust",
	".sql":  "sql",
	".ts":   "typescript",
	".tsx":  "typescript",
	".txt":  "text",
	".yaml": "yaml",
	".yml":  "yaml",
}

func isIgnoredDir(name string) bool {
	return ignoredDirs[name]
}

func isIgnoredFile(name string) bool {
	return ignoredFileNames[name]
}

func languageForFile(name string) string {
	if language, ok := allowedFileNames[name]; ok {
		return language
	}

	ext := strings.ToLower(filepath.Ext(name))
	return languageByExtension[ext]
}

func isAllowedSourceFile(name string) bool {
	return languageForFile(name) != ""
}
