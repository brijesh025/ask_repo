package storage

import (
	"context"
	"fmt"

	"github.com/brijesh025/ask_repo/internal/models"
)

func (s *Storage) UpsertRepoFile(ctx context.Context, file models.RepoFile) (int64, error) {
	query := `
		INSERT INTO repo_files (
			repository_id,
			file_name,
			file_path,
			language,
			content_hash,
			size_bytes
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (repository_id, file_path)
		DO UPDATE SET
			file_name = EXCLUDED.file_name,
			language = EXCLUDED.language,
			content_hash = EXCLUDED.content_hash,
			size_bytes = EXCLUDED.size_bytes
		RETURNING id
	`

	var id int64
	err := s.DB.QueryRow(
		ctx,
		query,
		file.RepositoryID,
		file.FileName,
		file.FilePath,
		file.Language,
		file.ContentHash,
		file.SizeBytes,
	).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to upsert repo file: %w", err)
	}

	return id, nil
}
