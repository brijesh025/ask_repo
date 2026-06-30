package services

import (
	"path/filepath"
	"strings"
)

const MaxFileSizeBytes int64 = 1024 * 1024

var IgnoredDirs = map[string]bool{
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

var IgnoredFileNames = map[string]bool{
	".env":              true,
	".env.local":        true,
	"package-lock.json": true,
	"pnpm-lock.yaml":    true,
	"yarn.lock":         true,
	"go.sum":            true,
}

var AllowedFileNames = map[string]string{
	"Dockerfile": "dockerfile",
	"Makefile":   "makefile",
}

var LanguageByExtension = map[string]string{
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

func IsIgnoredDir(name string) bool {
	return IgnoredDirs[name]
}

func IsIgnoredFile(name string) bool {
	return IgnoredFileNames[name]
}

func LanguageForFile(name string) string {
	if language, ok := AllowedFileNames[name]; ok {
		return language
	}

	ext := strings.ToLower(filepath.Ext(name))
	return LanguageByExtension[ext]
}

func IsAllowedSourceFile(name string) bool {
	return LanguageForFile(name) != ""
}
