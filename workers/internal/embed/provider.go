package embed

import (
	"fmt"
	"strings"
)

const (
	ProviderOpenAI = "openai"
	ProviderGemini = "gemini"
)

type Options struct {
	Provider     string
	Model        string
	Dimensions   int
	OpenAIAPIKey string
	GeminiAPIKey string
}

func NewEmbedder(options Options) (Embedder, error) {
	provider := strings.ToLower(strings.TrimSpace(options.Provider))
	if provider == "" {
		provider = ProviderGemini
	}

	switch provider {
	case ProviderOpenAI:
		return NewOpenAIEmbedder(options.OpenAIAPIKey, options.Model), nil
	case ProviderGemini:
		return NewGeminiEmbedder(options.GeminiAPIKey, options.Model, options.Dimensions), nil
	default:
		return nil, fmt.Errorf("unsupported embedding provider: %s", options.Provider)
	}
}
