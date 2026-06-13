package storage

import "context"

func (s *Storage) EnsureSchema(ctx context.Context) error {
	statements := []string{
		`CREATE EXTENSION IF NOT EXISTS vector`,
		`CREATE TABLE IF NOT EXISTS repositories (
			id BIGSERIAL PRIMARY KEY,
			repo_url TEXT NOT NULL UNIQUE,
			name TEXT NOT NULL,
			local_path TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
			indexed_at TIMESTAMPTZ
		)`,
		`CREATE TABLE IF NOT EXISTS repo_files (
			id BIGSERIAL PRIMARY KEY,
			repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
			file_name TEXT NOT NULL,
			file_path TEXT NOT NULL,
			language TEXT NOT NULL,
			content_hash TEXT NOT NULL,
			size_bytes BIGINT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
			UNIQUE(repository_id, file_path)
		)`,
		`CREATE TABLE IF NOT EXISTS code_chunks (
			id BIGSERIAL PRIMARY KEY,
			repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
			file_id BIGINT NOT NULL REFERENCES repo_files(id) ON DELETE CASCADE,
			file_path TEXT NOT NULL,
			chunk_text TEXT NOT NULL,
			start_line INTEGER NOT NULL,
			end_line INTEGER NOT NULL,
			embedding vector(1536),
			created_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)`,
		`CREATE INDEX IF NOT EXISTS repo_files_repository_id_idx ON repo_files(repository_id)`,
		`CREATE INDEX IF NOT EXISTS code_chunks_repository_id_idx ON code_chunks(repository_id)`,
		`CREATE INDEX IF NOT EXISTS code_chunks_file_id_idx ON code_chunks(file_id)`,
	}

	for _, statement := range statements {
		if _, err := s.DB.Exec(ctx, statement); err != nil {
			return err
		}
	}

	return nil
}
