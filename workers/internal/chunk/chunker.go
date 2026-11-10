package chunk

import (
	"context"
	"sort"
	"strings"

	"github.com/brijesh025/ask_repo/internal/models"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/golang"
	"github.com/smacker/go-tree-sitter/javascript"
	"github.com/smacker/go-tree-sitter/python"
	"github.com/smacker/go-tree-sitter/typescript/tsx"
	"github.com/smacker/go-tree-sitter/typescript/typescript"
)

const (
	chunkSizeLines    = 80
	chunkOverlapLines = 20
	maxASTChunkLines  = 120
)

// ChunkFile creates syntax-aware chunks for languages with a Tree-sitter
// grammar. It deliberately falls back to line chunks when the language is
// unsupported or the source cannot be parsed cleanly.
func ChunkFile(ctx context.Context, content, language string, repositoryID, fileID int64, filePath string) ([]models.CodeChunk, error) {
	content = strings.ReplaceAll(content, "\r\n", "\n")
	if strings.TrimSpace(content) == "" {
		return nil, nil
	}

	lang := strings.ToLower(strings.TrimSpace(language))
	grammar := grammarFor(lang)
	if grammar == nil {
		return splitLineChunks(content, repositoryID, fileID, filePath, language, "fallback"), nil
	}

	parser := sitter.NewParser()
	defer parser.Close()
	parser.SetLanguage(grammar)

	tree, err := parser.ParseCtx(ctx, nil, []byte(content))
	if err != nil {
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}
		return splitLineChunks(content, repositoryID, fileID, filePath, language, "fallback"), nil
	}
	if tree == nil {
		return splitLineChunks(content, repositoryID, fileID, filePath, language, "fallback"), nil
	}
	defer tree.Close()

	root := tree.RootNode()
	if root == nil || root.HasError() {
		return splitLineChunks(content, repositoryID, fileID, filePath, language, "fallback"), nil
	}

	nodes := make([]astNode, 0)
	collectASTNodes(root, nil, lang, []byte(content), &nodes)
	if len(nodes) == 0 {
		return splitLineChunks(content, repositoryID, fileID, filePath, language, "fallback"), nil
	}

	sort.SliceStable(nodes, func(i, j int) bool {
		if nodes[i].node.StartByte() == nodes[j].node.StartByte() {
			return nodes[i].node.EndByte() < nodes[j].node.EndByte()
		}
		return nodes[i].node.StartByte() < nodes[j].node.StartByte()
	})

	chunks := make([]models.CodeChunk, 0, len(nodes))
	for _, item := range nodes {
		text := item.node.Content([]byte(content))
		if strings.TrimSpace(text) == "" {
			continue
		}
		chunks = append(chunks, splitASTNode(text, item, repositoryID, fileID, filePath, language, len(chunks))...)
	}

	if len(chunks) == 0 {
		return splitLineChunks(content, repositoryID, fileID, filePath, language, "fallback"), nil
	}
	return chunks, nil
}

// SplitIntoChunks is retained for callers that need the original fallback
// behavior. New ingestion code should use ChunkFile.
func SplitIntoChunks(content string, repositoryID, fileID int64, filePath string) []models.CodeChunk {
	return splitLineChunks(content, repositoryID, fileID, filePath, "", "fallback")
}

type astNode struct {
	node         *sitter.Node
	symbol       string
	symbolKind   string
	parentSymbol string
}

func grammarFor(language string) *sitter.Language {
	switch language {
	case "go":
		return golang.GetLanguage()
	case "javascript":
		return javascript.GetLanguage()
	case "typescript":
		return typescript.GetLanguage()
	case "tsx":
		return tsx.GetLanguage()
	case "python":
		return python.GetLanguage()
	default:
		return nil
	}
}

func collectASTNodes(node *sitter.Node, parent *astNode, language string, source []byte, nodes *[]astNode) {
	if node == nil {
		return
	}

	currentParent := parent
	if isChunkNode(language, node.Type()) {
		name := nodeName(node, source)
		if name != "" || isNamelessChunkNode(node.Type()) {
			item := astNode{
				node:       node,
				symbol:     name,
				symbolKind: symbolKind(node.Type()),
			}
			if parent != nil {
				item.parentSymbol = parent.symbol
			} else if item.symbolKind == "method" {
				item.parentSymbol = receiverTypeName(node, source)
			}
			*nodes = append(*nodes, item)
			currentParent = &item
		}
	}

	for i := uint32(0); i < node.NamedChildCount(); i++ {
		collectASTNodes(node.NamedChild(int(i)), currentParent, language, source, nodes)
	}
}

func isChunkNode(language, nodeType string) bool {
	common := map[string]bool{
		"function_declaration":   true,
		"method_definition":      true,
		"method_declaration":     true,
		"function_definition":    true,
		"class_declaration":      true,
		"class_definition":       true,
		"interface_declaration":  true,
		"type_declaration":       true,
		"type_alias_declaration": true,
	}
	if common[nodeType] {
		return true
	}

	switch language {
	case "go":
		return nodeType == "const_declaration" || nodeType == "var_declaration" || nodeType == "import_declaration"
	case "javascript", "typescript", "tsx":
		return nodeType == "lexical_declaration" || nodeType == "variable_declaration" || nodeType == "import_statement"
	case "python":
		return nodeType == "import_statement" || nodeType == "import_from_statement"
	default:
		return false
	}
}

func isNamelessChunkNode(nodeType string) bool {
	return nodeType == "import_declaration" || nodeType == "import_statement" || nodeType == "import_from_statement" ||
		nodeType == "const_declaration" || nodeType == "var_declaration" || nodeType == "lexical_declaration" ||
		nodeType == "variable_declaration"
}

func nodeName(node *sitter.Node, source []byte) string {
	if node == nil {
		return ""
	}
	if name := node.ChildByFieldName("name"); name != nil {
		return strings.TrimSpace(name.Content(source))
	}
	return firstIdentifier(node, source)
}

func firstIdentifier(node *sitter.Node, source []byte) string {
	if node == nil {
		return ""
	}
	if node.Type() == "identifier" || node.Type() == "type_identifier" || node.Type() == "property_identifier" {
		return strings.TrimSpace(node.Content(source))
	}
	for i := uint32(0); i < node.NamedChildCount(); i++ {
		if name := firstIdentifier(node.NamedChild(int(i)), source); name != "" {
			return name
		}
	}
	return ""
}

func receiverTypeName(node *sitter.Node, source []byte) string {
	if node == nil {
		return ""
	}
	receiver := node.ChildByFieldName("receiver")
	if receiver == nil {
		return ""
	}
	return firstTypeIdentifier(receiver, source)
}

func firstTypeIdentifier(node *sitter.Node, source []byte) string {
	if node == nil {
		return ""
	}
	if node.Type() == "type_identifier" {
		return strings.TrimSpace(node.Content(source))
	}
	for i := uint32(0); i < node.NamedChildCount(); i++ {
		if name := firstTypeIdentifier(node.NamedChild(int(i)), source); name != "" {
			return name
		}
	}
	return ""
}

func symbolKind(nodeType string) string {
	switch nodeType {
	case "function_declaration", "function_definition":
		return "function"
	case "method_definition", "method_declaration":
		return "method"
	case "class_declaration", "class_definition":
		return "class"
	case "interface_declaration":
		return "interface"
	case "type_declaration", "type_alias_declaration":
		return "type"
	case "import_declaration", "import_statement", "import_from_statement":
		return "import"
	case "const_declaration", "var_declaration", "lexical_declaration", "variable_declaration":
		return "variable"
	case "export_statement":
		return "export"
	case "decorated_definition":
		return "declaration"
	default:
		return nodeType
	}
}

func splitASTNode(text string, item astNode, repositoryID, fileID int64, filePath, language string, chunkIndex int) []models.CodeChunk {
	lines := strings.Split(text, "\n")
	startLine := int(item.node.StartPoint().Row) + 1
	chunks := make([]models.CodeChunk, 0, (len(lines)+maxASTChunkLines-1)/maxASTChunkLines)
	for start := 0; start < len(lines); start += maxASTChunkLines {
		end := start + maxASTChunkLines
		if end > len(lines) {
			end = len(lines)
		}
		chunkText := strings.TrimSpace(strings.Join(lines[start:end], "\n"))
		if chunkText == "" {
			continue
		}
		chunks = append(chunks, models.CodeChunk{
			RepositoryID:  repositoryID,
			FileID:        fileID,
			FilePath:      filePath,
			Language:      language,
			Symbol:        item.symbol,
			SymbolKind:    item.symbolKind,
			ParentSymbol:  item.parentSymbol,
			ChunkIndex:    chunkIndex + len(chunks),
			ChunkStrategy: "ast",
			ChunkText:     chunkText,
			StartLine:     startLine + start,
			EndLine:       startLine + end - 1,
		})
	}
	return chunks
}

func splitLineChunks(content string, repositoryID, fileID int64, filePath, language, strategy string) []models.CodeChunk {
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
				RepositoryID:  repositoryID,
				FileID:        fileID,
				FilePath:      filePath,
				Language:      language,
				ChunkIndex:    len(chunks),
				ChunkStrategy: strategy,
				ChunkText:     chunkText,
				StartLine:     start + 1,
				EndLine:       end,
			})
		}

		if end == len(lines) {
			break
		}
	}

	return chunks
}
