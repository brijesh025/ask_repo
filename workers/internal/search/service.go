package search

import (
	"context"
	"fmt"
	"strings"

	"github.com/brijesh025/ask_repo/internal/embed"
	"github.com/brijesh025/ask_repo/internal/models"
	"github.com/brijesh025/ask_repo/internal/storage"
)

const defaultTopK = 5

type Answerer interface {
	GenerateAnswer(ctx context.Context, question string, chunks []models.RetrievedChunk) (string, error)
}

type Service struct {
	store    *storage.Storage
	embedder embed.Embedder
	answerer Answerer
}

type Result struct {
	Question string                  `json:"question"`
	Answer   string                  `json:"answer"`
	Chunks   []models.RetrievedChunk `json:"chunks"`
}

func NewService(store *storage.Storage, embedder embed.Embedder, answerer Answerer) *Service {
	return &Service{
		store:    store,
		embedder: embedder,
		answerer: answerer,
	}
}

func (s *Service) AnswerQuestion(ctx context.Context, question string, repositoryID int64, topK int) (*Result, error) {
	if s.store == nil {
		return nil, fmt.Errorf("storage is required")
	}
	if s.embedder == nil {
		return nil, fmt.Errorf("embedder is required")
	}
	if s.answerer == nil {
		return nil, fmt.Errorf("answerer is required")
	}

	question = strings.TrimSpace(question)
	if question == "" {
		return nil, fmt.Errorf("question is required")
	}
	if topK <= 0 {
		topK = defaultTopK
	}

	queryEmbedding, err := s.embedder.EmbedQuery(ctx, question)
	if err != nil {
		return nil, fmt.Errorf("failed to embed question: %w", err)
	}

	chunks, err := s.store.SearchCodeChunks(ctx, repositoryID, queryEmbedding, topK)
	if err != nil {
		return nil, err
	}
	if len(chunks) == 0 {
		return &Result{
			Question: question,
			Answer:   "I could not find relevant indexed code chunks for this question.",
			Chunks:   chunks,
		}, nil
	}

	answer, err := s.answerer.GenerateAnswer(ctx, question, chunks)
	if err != nil {
		return nil, fmt.Errorf("failed to generate answer: %w", err)
	}

	return &Result{
		Question: question,
		Answer:   answer,
		Chunks:   chunks,
	}, nil
}
