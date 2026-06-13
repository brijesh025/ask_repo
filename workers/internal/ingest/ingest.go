package ingest

import (
	"context"
	"crypto/sha256"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/brijesh025/ask_repo/internal/models"
	"github.com/brijesh025/ask_repo/internal/storage"
)

const (
	chunkSizeLines    = 80
	chunkOverlapLines = 20
)

type Service struct {
	store *storage.Storage
}

type Result struct {
	RepositoryID int64
	Files        int
	Chunks       int
}

func NewService(store *storage.Storage) *Service {
	return &Service{store: store}
}

func (s *Service) IngestRepo(ctx context.Context, repo models.Repository) (*Result, error) {
	if s.store == nil {
		return nil, fmt.Errorf("storage is required")
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

	files, err := ScanFiles(repo.LocalPath)
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

		chunks := splitIntoChunks(string(content), repositoryID, fileID, scannedFile.RelPath)
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

func ScanFiles(repoPath string) ([]models.ScannedFile, error) {
	info, err := os.Stat(repoPath)
	if err != nil {
		return nil, fmt.Errorf("repo path is not readable: %w", err)
	}
	if !info.IsDir() {
		return nil, fmt.Errorf("repo path is not a directory: %s", repoPath)
	}

	files := make([]models.ScannedFile, 0)
	err = filepath.WalkDir(repoPath, func(currentPath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}

		name := entry.Name()
		if entry.IsDir() {
			if currentPath != repoPath && isIgnoredDir(name) {
				return filepath.SkipDir
			}
			return nil
		}

		if isIgnoredFile(name) || !isAllowedSourceFile(name) {
			return nil
		}

		fileInfo, err := entry.Info()
		if err != nil {
			return err
		}
		if fileInfo.Size() > maxFileSizeBytes {
			return nil
		}

		relPath, err := filepath.Rel(repoPath, currentPath)
		if err != nil {
			return err
		}

		files = append(files, models.ScannedFile{
			AbsPath:   currentPath,
			RelPath:   filepath.ToSlash(relPath),
			FileName:  name,
			Extension: strings.ToLower(filepath.Ext(name)),
			Language:  languageForFile(name),
			SizeBytes: fileInfo.Size(),
		})

		return nil
	})
	if err != nil {
		return nil, err
	}

	return files, nil
}

func splitIntoChunks(content string, repositoryID, fileID int64, filePath string) []models.CodeChunk {
	content = strings.ReplaceAll(content, "\r\n", "\n")
	lines := strings.Split(content, "\n")
	if len(lines) == 0 || strings.TrimSpace(content) == "" {
		return nil
	}

	step := chunkSizeLines - chunkOverlapLines
	chunks := make([]models.CodeChunk, 0)

	for start := 0; start < len(lines); start += step {
		end := start + chunkSizeLines
		if end > len(lines) {
			end = len(lines)
		}

		chunkText := strings.TrimSpace(strings.Join(lines[start:end], "\n"))
		if chunkText != "" {
			chunks = append(chunks, models.CodeChunk{
				RepositoryID: repositoryID,
				FileID:       fileID,
				FilePath:     filePath,
				ChunkText:    chunkText,
				StartLine:    start + 1,
				EndLine:      end,
			})
		}

		if end == len(lines) {
			break
		}
	}

	return chunks
}

func hashContent(content []byte) string {
	hash := sha256.Sum256(content)
	return fmt.Sprintf("%x", hash)
}
