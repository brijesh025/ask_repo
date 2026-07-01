package storage

import (
	"context"
	"fmt"

	"github.com/brijesh025/ask_repo/internal/models"
	"github.com/pgvector/pgvector-go"
)

func (s *Storage) SearchCodeChunks(ctx context.Context, repositoryID int64, queryEmbedding []float32, limit int) ([]models.RetrievedChunk, error) {
	if len(queryEmbedding) == 0 {
		return nil, fmt.Errorf("query embedding is required")
	}
	if limit <= 0 {
		limit = 5
	}

	query := `
		SELECT
			id,
			repository_id,
			file_path,
			chunk_text,
			start_line,
			end_line,
			embedding <=> $1 AS distance
		FROM code_chunks
		WHERE embedding IS NOT NULL
			AND ($2::bigint = 0 OR repository_id = $2)
		ORDER BY embedding <=> $1
		LIMIT $3
	`

	rows, err := s.DB.Query(ctx, query, pgvector.NewVector(queryEmbedding), repositoryID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to search code chunks: %w", err)
	}
	defer rows.Close()

	chunks := make([]models.RetrievedChunk, 0)
	for rows.Next() {
		var chunk models.RetrievedChunk
		if err := rows.Scan(
			&chunk.ID,
			&chunk.RepositoryID,
			&chunk.FilePath,
			&chunk.ChunkText,
			&chunk.StartLine,
			&chunk.EndLine,
			&chunk.Distance,
		); err != nil {
			return nil, fmt.Errorf("failed to scan search result: %w", err)
		}
		chunks = append(chunks, chunk)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to read search results: %w", err)
	}

	return chunks, nil
}
