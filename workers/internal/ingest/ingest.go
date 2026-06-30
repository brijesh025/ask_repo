package ingest

import (
	"context"
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/brijesh025/ask_repo/internal/chunk"
	"github.com/brijesh025/ask_repo/internal/embed"
	"github.com/brijesh025/ask_repo/internal/models"
	"github.com/brijesh025/ask_repo/internal/services"
	"github.com/brijesh025/ask_repo/internal/storage"
)

type Service struct {
	store    *storage.Storage
	embedder embed.Embedder
}

type Result struct {
	RepositoryID int64
	Files        int
	Chunks       int
	Embeddings   int
}

func NewService(store *storage.Storage, embedder embed.Embedder) *Service {
	return &Service{
		store:    store,
		embedder: embedder,
	}
}

func (s *Service) IngestRepo(ctx context.Context, repo models.Repository) (*Result, error) {
	if s.store == nil {
		return nil, fmt.Errorf("storage is required")
	}
	if s.embedder == nil {
		return nil, fmt.Errorf("embedder is required")
	}
	if strings.TrimSpace(repo.RepoURL) == "" {
		return nil, fmt.Errorf("repo url is required")
	}
	if strings.TrimSpace(repo.LocalPath) == "" {
		return nil, fmt.Errorf("local repo path is required")
	}
	if strings.TrimSpace(repo.Name) == "" {
		repo.Name = filepath.Base(repo.LocalPath)
	}

	repositoryID, err := s.store.UpsertRepository(ctx, repo)
	if err != nil {
		return nil, err
	}

	files, err := services.ScanFiles(repo.LocalPath)
	if err != nil {
		return nil, err
	}

	if err := s.store.ClearRepositoryContents(ctx, repositoryID); err != nil {
		return nil, err
	}

	result := &Result{RepositoryID: repositoryID, Files: len(files)}
	for _, scannedFile := range files {
		content, err := os.ReadFile(scannedFile.AbsPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read %s: %w", scannedFile.RelPath, err)
		}

		fileID, err := s.store.UpsertRepoFile(ctx, models.RepoFile{
			RepositoryID: repositoryID,
			FileName:     scannedFile.FileName,
			FilePath:     scannedFile.RelPath,
			Language:     scannedFile.Language,
			ContentHash:  hashContent(content),
			SizeBytes:    scannedFile.SizeBytes,
		})
		if err != nil {
			return nil, err
		}

		chunks := chunk.SplitIntoChunks(string(content), repositoryID, fileID, scannedFile.RelPath)
		if len(chunks) > 0 {
			embeddings, err := s.embedder.EmbedTexts(ctx, embed.ChunkTexts(chunks))
			if err != nil {
				return nil, fmt.Errorf("failed to embed chunks for %s: %w", scannedFile.RelPath, err)
			}
			if err := embed.AttachEmbeddings(chunks, embeddings); err != nil {
				return nil, err
			}
			result.Embeddings += len(embeddings)
		}

		if err := s.store.ReplaceChunksForFile(ctx, fileID, chunks); err != nil {
			return nil, err
		}
		result.Chunks += len(chunks)
	}

	if err := s.store.MarkRepositoryIndexed(ctx, repositoryID); err != nil {
		return nil, err
	}

	return result, nil
}

func hashContent(content []byte) string {
	hash := sha256.Sum256(content)
	return fmt.Sprintf("%x", hash)
}
