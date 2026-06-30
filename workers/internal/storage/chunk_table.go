package storage

import (
	"context"
	"fmt"

	"github.com/brijesh025/ask_repo/internal/models"
	"github.com/pgvector/pgvector-go"
)

func (s *Storage) ReplaceChunksForFile(ctx context.Context, fileID int64, chunks []models.CodeChunk) error {
	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin chunk replacement: %w", err)
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `DELETE FROM code_chunks WHERE file_id = $1`, fileID); err != nil {
		return fmt.Errorf("failed to delete old chunks: %w", err)
	}

	query := `
		INSERT INTO code_chunks (
			repository_id,
			file_id,
			file_path,
			chunk_text,
			start_line,
			end_line,
			embedding
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	for _, chunk := range chunks {
		var embedding any
		if len(chunk.Embedding) > 0 {
			embedding = pgvector.NewVector(chunk.Embedding)
		}

		if _, err := tx.Exec(
			ctx,
			query,
			chunk.RepositoryID,
			chunk.FileID,
			chunk.FilePath,
			chunk.ChunkText,
			chunk.StartLine,
			chunk.EndLine,
			embedding,
		); err != nil {
			return fmt.Errorf("failed to insert code chunk: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit chunk replacement: %w", err)
	}

	return nil
}
