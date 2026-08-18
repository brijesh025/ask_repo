package embed

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type OllamaEmbedder struct {
	endpoint string
	model    string
	client   *http.Client
}

type ollamaRequest struct {
	Model string   `json:"model"`
	Input []string `json:"input"`
}

type ollamaResponse struct {
	Embeddings [][]float32 `json:"embeddings"`
}

func NewOllamaEmbedder(model string) *OllamaEmbedder {
	if strings.TrimSpace(model) == "" {
		model = "nomic-embed-text"
	}

	return &OllamaEmbedder{
		endpoint: "http://localhost:11434/api/embed",
		model:    model,
		client: &http.Client{
			Timeout: 2 * time.Minute, // Local generation can take time depending on your CPU/GPU
		},
	}
}

func (e *OllamaEmbedder) EmbedTexts(ctx context.Context, texts []string) ([][]float32, error) {
	if len(texts) == 0 {
		return nil, nil
	}

	// Ollama can handle batch inputs directly in a single request
	reqBody, _ := json.Marshal(ollamaRequest{
		Model: e.model,
		Input: texts,
	})

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, e.endpoint, bytes.NewReader(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create ollama request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	res, err := e.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call ollama API: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("ollama API returned %s: %s", res.Status, string(body))
	}

	var parsed ollamaResponse
	if err := json.NewDecoder(res.Body).Decode(&parsed); err != nil {
		return nil, fmt.Errorf("failed to decode ollama response: %w", err)
	}

	return parsed.Embeddings, nil
}

func (e *OllamaEmbedder) EmbedQuery(ctx context.Context, query string) ([]float32, error) {
	embeddings, err := e.EmbedTexts(ctx, []string{query})
	if err != nil {
		return nil, err
	}
	if len(embeddings) == 0 {
		return nil, fmt.Errorf("empty response from ollama")
	}
	return embeddings[0], nil
}
