package storage

import (
	"context"
	"fmt"

	"github.com/brijesh025/ask_repo/internal/models"
)

func (s *Storage) UpsertRepository(ctx context.Context, repo models.Repository) (int64, error) {
	query := `
		INSERT INTO repositories (repo_url, name, local_path)
		VALUES ($1, $2, $3)
		ON CONFLICT (repo_url)
		DO UPDATE SET
			name = EXCLUDED.name,
			local_path = EXCLUDED.local_path
		RETURNING id
	`

	var id int64
	err := s.DB.QueryRow(ctx, query, repo.RepoURL, repo.Name, repo.LocalPath).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to upsert repository: %w", err)
	}

	return id, nil
}

func (s *Storage) MarkRepositoryIndexed(ctx context.Context, repositoryID int64) error {
	query := `UPDATE repositories SET indexed_at = now() WHERE id = $1`
	if _, err := s.DB.Exec(ctx, query, repositoryID); err != nil {
		return fmt.Errorf("failed to mark repository indexed: %w", err)
	}

	return nil
}

func (s *Storage) ClearRepositoryContents(ctx context.Context, repositoryID int64) error {
	query := `DELETE FROM repo_files WHERE repository_id = $1`
	if _, err := s.DB.Exec(ctx, query, repositoryID); err != nil {
		return fmt.Errorf("failed to clear repository contents: %w", err)
	}

	return nil
}
