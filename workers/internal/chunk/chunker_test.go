package chunk

import (
	"context"
	"testing"

	"github.com/brijesh025/ask_repo/internal/models"
)

func TestChunkFileUsesASTForGoDeclarations(t *testing.T) {
	source := `package sample

import "fmt"

type Service struct{}

func (s *Service) Run() {
	fmt.Println("run")
}

func main() {
	service := &Service{}
	service.Run()
}`

	chunks, err := ChunkFile(context.Background(), source, "go", 1, 2, "main.go")
	if err != nil {
		t.Fatalf("ChunkFile returned an error: %v", err)
	}
	if len(chunks) == 0 {
		t.Fatal("expected AST chunks")
	}

	if got := chunks[0].ChunkStrategy; got != "ast" {
		t.Fatalf("expected AST strategy, got %q", got)
	}

	run := findChunkBySymbol(chunks, "Run")
	if run == nil {
		t.Fatal("expected a method chunk for Run")
	}
	if run.StartLine != 7 || run.EndLine != 9 {
		t.Fatalf("unexpected Run line range: %d-%d", run.StartLine, run.EndLine)
	}
	if run.SymbolKind != "method" {
		t.Fatalf("expected method kind, got %q", run.SymbolKind)
	}
	if run.ParentSymbol != "Service" {
		t.Fatalf("expected Service parent symbol, got %q", run.ParentSymbol)
	}
	if run.Language != "go" {
		t.Fatalf("expected language metadata, got %q", run.Language)
	}
}

func TestChunkFileUsesASTForSupportedScriptLanguages(t *testing.T) {
	tests := []struct {
		name     string
		language string
		source   string
		symbol   string
	}{
		{
			name:     "typescript",
			language: "typescript",
			source:   "export function authenticateUser(input: string) { return input.trim(); }",
			symbol:   "authenticateUser",
		},
		{
			name:     "tsx",
			language: "tsx",
			source:   "export function LoginPanel() { return <div>Login</div>; }",
			symbol:   "LoginPanel",
		},
		{
			name:     "python",
			language: "python",
			source:   "def authenticate_user(user):\n    return user is not None\n",
			symbol:   "authenticate_user",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			chunks, err := ChunkFile(context.Background(), test.source, test.language, 1, 2, "source."+test.name)
			if err != nil {
				t.Fatalf("ChunkFile returned an error: %v", err)
			}
			chunk := findChunkBySymbol(chunks, test.symbol)
			if chunk == nil {
				t.Fatalf("expected AST chunk for %q, got %#v", test.symbol, chunks)
			}
			if chunk.ChunkStrategy != "ast" {
				t.Fatalf("expected AST strategy, got %q", chunk.ChunkStrategy)
			}
		})
	}
}

func TestChunkFileFallsBackForUnsupportedOrMalformedSource(t *testing.T) {
	unsupported, err := ChunkFile(context.Background(), "# Notes\n\nThis is documentation.", "markdown", 1, 2, "README.md")
	if err != nil {
		t.Fatalf("unsupported language returned an error: %v", err)
	}
	if len(unsupported) == 0 || unsupported[0].ChunkStrategy != "fallback" {
		t.Fatalf("expected fallback chunks for markdown, got %#v", unsupported)
	}

	malformed, err := ChunkFile(context.Background(), "package sample\nfunc broken( {", "go", 1, 2, "broken.go")
	if err != nil {
		t.Fatalf("malformed source returned an error: %v", err)
	}
	if len(malformed) == 0 || malformed[0].ChunkStrategy != "fallback" {
		t.Fatalf("expected fallback chunks for malformed Go, got %#v", malformed)
	}
}

func TestSplitIntoChunksPreservesFallbackCompatibility(t *testing.T) {
	chunks := SplitIntoChunks("one\ntwo\nthree", 1, 2, "notes.txt")
	if len(chunks) != 1 {
		t.Fatalf("expected one small fallback chunk, got %d", len(chunks))
	}
	if chunks[0].StartLine != 1 || chunks[0].EndLine != 3 {
		t.Fatalf("unexpected fallback line range: %d-%d", chunks[0].StartLine, chunks[0].EndLine)
	}
	if chunks[0].ChunkStrategy != "fallback" {
		t.Fatalf("expected fallback strategy, got %q", chunks[0].ChunkStrategy)
	}
}

func findChunkBySymbol(chunks []models.CodeChunk, symbol string) *models.CodeChunk {
	for i := range chunks {
		if chunks[i].Symbol == symbol {
			return &chunks[i]
		}
	}
	return nil
}
