package embed

import (
	"fmt"

	"github.com/brijesh025/ask_repo/internal/models"
)

func ChunkTexts(chunks []models.CodeChunk) []string {
	texts := make([]string, 0, len(chunks))
	for _, chunk := range chunks {
		texts = append(texts, chunk.ChunkText)
	}
	return texts
}

func AttachEmbeddings(chunks []models.CodeChunk, embeddings [][]float32) error {
	if len(chunks) != len(embeddings) {
		return fmt.Errorf("chunk and embedding count mismatch: chunks=%d embeddings=%d", len(chunks), len(embeddings))
	}

	for i := range chunks {
		chunks[i].Embedding = embeddings[i]
	}

	return nil
}
