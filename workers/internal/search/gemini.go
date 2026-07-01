package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/brijesh025/ask_repo/internal/models"
)

const (
	defaultGeminiAnswerModel = "gemini-3.5-flash"
	geminiGenerateEndpoint   = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent"
)

type GeminiAnswerer struct {
	apiKey      string
	model       string
	temperature float64
	httpClient  *http.Client
}

type geminiGenerateRequest struct {
	Contents          []geminiGenerateContent `json:"contents"`
	SystemInstruction geminiGenerateContent   `json:"systemInstruction,omitempty"`
	GenerationConfig  geminiGenerationConfig  `json:"generationConfig,omitempty"`
}

type geminiGenerationConfig struct {
	Temperature float64 `json:"temperature"`
}

type geminiGenerateContent struct {
	Parts []geminiGeneratePart `json:"parts"`
}

type geminiGeneratePart struct {
	Text string `json:"text"`
}

type geminiGenerateResponse struct {
	Candidates []geminiCandidate `json:"candidates"`
}

type geminiCandidate struct {
	Content geminiGenerateContent `json:"content"`
}

func NewGeminiAnswerer(apiKey string, model string, temperature float64) *GeminiAnswerer {
	model = strings.TrimSpace(model)
	if model == "" {
		model = defaultGeminiAnswerModel
	}

	return &GeminiAnswerer{
		apiKey:      strings.TrimSpace(apiKey),
		model:       model,
		temperature: temperature,
		httpClient: &http.Client{
			Timeout: 90 * time.Second,
		},
	}
}

func (a *GeminiAnswerer) GenerateAnswer(ctx context.Context, question string, chunks []models.RetrievedChunk) (string, error) {
	if strings.TrimSpace(a.apiKey) == "" {
		return "", fmt.Errorf("GEMINI_API_KEY is required for answer generation")
	}

	prompt := buildRAGPrompt(question, chunks)
	body, err := json.Marshal(geminiGenerateRequest{
		SystemInstruction: geminiGenerateContent{
			Parts: []geminiGeneratePart{{
				Text: "You answer questions about a code repository using only the provided context. If the context is insufficient, say what is missing. Cite file paths and line ranges when useful.",
			}},
		},
		Contents: []geminiGenerateContent{{
			Parts: []geminiGeneratePart{{Text: prompt}},
		}},
		GenerationConfig: geminiGenerationConfig{
			Temperature: a.temperature,
		},
	})
	if err != nil {
		return "", fmt.Errorf("failed to encode Gemini answer request: %w", err)
	}

	endpoint := fmt.Sprintf(geminiGenerateEndpoint, strings.TrimPrefix(a.model, "models/"))
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("failed to create Gemini answer request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-goog-api-key", a.apiKey)

	res, err := a.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call Gemini answer API: %w", err)
	}
	defer res.Body.Close()

	responseBody, err := io.ReadAll(res.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read Gemini answer response: %w", err)
	}
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return "", fmt.Errorf("Gemini answer API returned %s: %s", res.Status, string(responseBody))
	}

	var parsed geminiGenerateResponse
	if err := json.Unmarshal(responseBody, &parsed); err != nil {
		return "", fmt.Errorf("failed to decode Gemini answer response: %w", err)
	}
	if len(parsed.Candidates) == 0 || len(parsed.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("Gemini answer response did not include text")
	}

	var answer strings.Builder
	for _, part := range parsed.Candidates[0].Content.Parts {
		answer.WriteString(part.Text)
	}

	return strings.TrimSpace(answer.String()), nil
}

func buildRAGPrompt(question string, chunks []models.RetrievedChunk) string {
	var prompt strings.Builder
	prompt.WriteString("Question:\n")
	prompt.WriteString(question)
	prompt.WriteString("\n\nRelevant repository context:\n")

	for i, chunk := range chunks {
		prompt.WriteString(fmt.Sprintf(
			"\n[%d] %s:%d-%d\n%s\n",
			i+1,
			chunk.FilePath,
			chunk.StartLine,
			chunk.EndLine,
			chunk.ChunkText,
		))
	}

	prompt.WriteString("\nAnswer with the most relevant explanation based on the context above.")
	return prompt.String()
}
