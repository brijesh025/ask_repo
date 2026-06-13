package models

import "time"

type Repository struct {
	ID        int64
	RepoURL   string
	Name      string
	LocalPath string
	CreatedAt time.Time
	IndexedAt *time.Time
}

type RepoFile struct {
	ID           int64
	RepositoryID int64
	FileName     string
	FilePath     string
	Language     string
	ContentHash  string
	SizeBytes    int64
}

type CodeChunk struct {
	ID           int64
	RepositoryID int64
	FileID       int64
	FilePath     string
	ChunkText    string
	StartLine    int
	EndLine      int
	Embedding    []float32
}

type ScannedFile struct {
	AbsPath   string
	RelPath   string
	FileName  string
	Extension string
	Language  string
	SizeBytes int64
}

// Backward-compatible aliases while you are still learning and renaming.
type RepoFiles = RepoFile
type FileChunk = CodeChunk
