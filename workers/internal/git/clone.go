package git

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// cmd := exec.Command("git", "clone", "--depth", "1", repoURL, targetDir)
// err := cmd.Run()

// exec.Command(...)  → prepare a system command
// "git"              → command/program to run
// "clone"            → first argument
// "--depth", "1"     → shallow clone, latest version only
// repoURL            → repo URL
// targetDir          → where to save it
// cmd.Run()          → actually run the command

// 1. Function params are name first, type second.
// 2. Return errors instead of only printing them.
// 3. Use capital function names when other packages should call them.
// 4. Avoid semicolons and parentheses in if.
// 5. Add context to errors using fmt.Errorf.
// 6. Use CombinedOutput when running system commands so failures are debuggable.
// 7. Name packages by responsibility: git, not github, if it is generic Git logic.

func CloneRepo(repoURL string, targetDir string) error {
	if err := os.MkdirAll(filepath.Dir(targetDir), 0755); err != nil {
		return fmt.Errorf("failed to create repo storage directory: %w", err)
	}

	cmd := exec.Command("git", "clone", "--depth", "1", repoURL, targetDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to clone repo: %w: %s", err, string(output))
	}
	return nil
}
