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
	defaultCloudflareEmbeddingModel = "@cf/baai/bge-base-en-v1.5"
	cloudflareEmbeddingEndpoint     = "https://api.cloudflare.com/client/v4/accounts/%s/ai/run/%s"
)

type CloudflareEmbedder struct {
	accountID  string
	apiToken   string
	model      string
	dimensions int
	client     *http.Client
}

type cloudflareEmbeddingRequest struct {
	Text []string `json:"text"`
}

type cloudflareEmbeddingResponse struct {
	Success bool `json:"success"`
	Errors  []struct {
		Message string `json:"message"`
	} `json:"errors"`
	Result struct {
		Data [][]float32 `json:"data"`
	} `json:"result"`
}

func NewCloudflareEmbedder(accountID, apiToken, model string, dimensions int) *CloudflareEmbedder {
	model = strings.TrimSpace(model)
	if model == "" {
		model = defaultCloudflareEmbeddingModel
	}

	return &CloudflareEmbedder{
		accountID:  strings.TrimSpace(accountID),
		apiToken:   strings.TrimSpace(apiToken),
		model:      model,
		dimensions: dimensions,
		client: &http.Client{
			Timeout: 2 * time.Minute,
		},
	}
}

func (e *CloudflareEmbedder) EmbedTexts(ctx context.Context, texts []string) ([][]float32, error) {
	if len(texts) == 0 {
		return nil, nil
	}
	if e.accountID == "" {
		return nil, fmt.Errorf("CLOUDFLARE_ACCOUNT_ID is required for embeddings")
	}
	if e.apiToken == "" {
		return nil, fmt.Errorf("CLOUDFLARE_API_TOKEN is required for embeddings")
	}

	body, err := json.Marshal(cloudflareEmbeddingRequest{Text: texts})
	if err != nil {
		return nil, fmt.Errorf("failed to encode Cloudflare embeddings request: %w", err)
	}

	endpoint := fmt.Sprintf(cloudflareEmbeddingEndpoint, e.accountID, e.model)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create Cloudflare embeddings request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+e.apiToken)
	req.Header.Set("Content-Type", "application/json")

	res, err := e.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call Cloudflare embeddings API: %w", err)
	}
	defer res.Body.Close()

	responseBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read Cloudflare embeddings response: %w", err)
	}

	var parsed cloudflareEmbeddingResponse
	if err := json.Unmarshal(responseBody, &parsed); err != nil {
		return nil, fmt.Errorf("failed to decode Cloudflare embeddings response: %w", err)
	}
	if res.StatusCode < 200 || res.StatusCode >= 300 || !parsed.Success {
		message := strings.TrimSpace(string(responseBody))
		if len(parsed.Errors) > 0 && strings.TrimSpace(parsed.Errors[0].Message) != "" {
			message = parsed.Errors[0].Message
		}
		return nil, fmt.Errorf("Cloudflare embeddings API returned %s: %s", res.Status, message)
	}
	if len(parsed.Result.Data) != len(texts) {
		return nil, fmt.Errorf("Cloudflare embeddings response count mismatch: got %d, want %d", len(parsed.Result.Data), len(texts))
	}
	if e.dimensions > 0 {
		for i, embedding := range parsed.Result.Data {
			if len(embedding) != e.dimensions {
				return nil, fmt.Errorf("Cloudflare embedding dimension mismatch at index %d: got %d, want %d", i, len(embedding), e.dimensions)
			}
		}
	}

	return parsed.Result.Data, nil
}

func (e *CloudflareEmbedder) EmbedQuery(ctx context.Context, query string) ([]float32, error) {
	embeddings, err := e.EmbedTexts(ctx, []string{query})
	if err != nil {
		return nil, err
	}
	if len(embeddings) == 0 {
		return nil, fmt.Errorf("empty response from Cloudflare embeddings API")
	}
	return embeddings[0], nil
}
