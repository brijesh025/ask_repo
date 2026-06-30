package chunk

import (
	"strings"

	"github.com/brijesh025/ask_repo/internal/models"
)

const (
	chunkSizeLines    = 80
	chunkOverlapLines = 20
)

func SplitIntoChunks(content string, repositoryID, fileID int64, filePath string) []models.CodeChunk {
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