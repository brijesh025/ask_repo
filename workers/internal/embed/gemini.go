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

const (
	defaultGeminiEmbeddingModel = "gemini-embedding-001"
	defaultGeminiDimensions     = 1536
	geminiEmbeddingEndpoint     = "https://generativelanguage.googleapis.com/v1beta/models/%s:batchEmbedContents"
	geminiMaxBatchSize          = 32
)

type GeminiEmbedder struct {
	apiKey     string
	model      string
	dimensions int
	httpClient *http.Client
}

type geminiBatchEmbeddingRequest struct {
	Requests []geminiEmbeddingRequest `json:"requests"`
}

type geminiEmbeddingRequest struct {
	Model                string        `json:"model"`
	Content              geminiContent `json:"content"`
	TaskType             string        `json:"taskType,omitempty"`
	OutputDimensionality int           `json:"outputDimensionality,omitempty"`
}

type geminiContent struct {
	Parts []geminiPart `json:"parts"`
}

type geminiPart struct {
	Text string `json:"text"`
}

type geminiBatchEmbeddingResponse struct {
	Embeddings []geminiEmbedding `json:"embeddings"`
}

type geminiEmbedding struct {
	Values []float32 `json:"values"`
}

func NewGeminiEmbedder(apiKey string, model string, dimensions int) *GeminiEmbedder {
	model = normalizeGeminiModel(model)
	if dimensions == 0 {
		dimensions = defaultGeminiDimensions
	}

	return &GeminiEmbedder{
		apiKey:     strings.TrimSpace(apiKey),
		model:      model,
		dimensions: dimensions,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

func (e *GeminiEmbedder) EmbedTexts(ctx context.Context, texts []string) ([][]float32, error) {
	if len(texts) == 0 {
		return nil, nil
	}
	if strings.TrimSpace(e.apiKey) == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY is required for embeddings")
	}

	embeddings := make([][]float32, 0, len(texts))
	for start := 0; start < len(texts); start += geminiMaxBatchSize {
		end := start + geminiMaxBatchSize
		if end > len(texts) {
			end = len(texts)
		}

		batchEmbeddings, err := e.embedBatch(ctx, texts[start:end], "RETRIEVAL_DOCUMENT")
		if err != nil {
			return nil, err
		}
		embeddings = append(embeddings, batchEmbeddings...)
	}

	return embeddings, nil
}

func (e *GeminiEmbedder) EmbedQuery(ctx context.Context, query string) ([]float32, error) {
	embeddings, err := e.embedBatch(ctx, []string{query}, "RETRIEVAL_QUERY")
	if err != nil {
		return nil, err
	}
	if len(embeddings) == 0 {
		return nil, fmt.Errorf("empty query embedding response")
	}
	return embeddings[0], nil
}

func (e *GeminiEmbedder) embedBatch(ctx context.Context, texts []string, taskType string) ([][]float32, error) {
	requests := make([]geminiEmbeddingRequest, 0, len(texts))
	for _, text := range texts {
		requests = append(requests, geminiEmbeddingRequest{
			Model: e.model,
			Content: geminiContent{
				Parts: []geminiPart{{Text: text}},
			},
			TaskType:             taskType,
			OutputDimensionality: e.dimensions,
		})
	}

	body, err := json.Marshal(geminiBatchEmbeddingRequest{Requests: requests})
	if err != nil {
		return nil, fmt.Errorf("failed to encode Gemini embeddings request: %w", err)
	}

	endpoint := fmt.Sprintf(geminiEmbeddingEndpoint, strings.TrimPrefix(e.model, "models/"))
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini embeddings request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-goog-api-key", e.apiKey)

	res, err := e.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call Gemini embeddings API: %w", err)
	}
	defer res.Body.Close()

	responseBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read Gemini embeddings response: %w", err)
	}
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("Gemini embeddings API returned %s: %s", res.Status, string(responseBody))
	}

	var parsed geminiBatchEmbeddingResponse
	if err := json.Unmarshal(responseBody, &parsed); err != nil {
		return nil, fmt.Errorf("failed to decode Gemini embeddings response: %w", err)
	}
	if len(parsed.Embeddings) != len(texts) {
		return nil, fmt.Errorf("Gemini embeddings response count mismatch: got %d, want %d", len(parsed.Embeddings), len(texts))
	}

	embeddings := make([][]float32, len(parsed.Embeddings))
	for i, item := range parsed.Embeddings {
		embeddings[i] = item.Values
	}

	return embeddings, nil
}

func normalizeGeminiModel(model string) string {
	model = strings.TrimSpace(model)
	if model == "" {
		model = defaultGeminiEmbeddingModel
	}
	if strings.HasPrefix(model, "models/") {
		return model
	}
	return "models/" + model
}
