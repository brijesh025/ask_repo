package services

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/brijesh025/ask_repo/internal/models"
)


func ScanFiles(repoPath string) ([]models.ScannedFile, error) {
	info, err := os.Stat(repoPath)
	if err != nil {
		return nil, fmt.Errorf("repo path is not readable: %w", err)
	}
	if !info.IsDir() {
		return nil, fmt.Errorf("repo path is not a directory: %s", repoPath)
	}

	files := make([]models.ScannedFile, 0)
	err = filepath.WalkDir(repoPath, func(currentPath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}

		name := entry.Name()
		if entry.IsDir() {
			if currentPath != repoPath && IsIgnoredDir(name) {
				return filepath.SkipDir
			}
			return nil
		}

		if IsIgnoredFile(name) || !IsAllowedSourceFile(name) {
			return nil
		}

		fileInfo, err := entry.Info()
		if err != nil {
			return err
		}
		if fileInfo.Size() > MaxFileSizeBytes {
			return nil
		}

		relPath, err := filepath.Rel(repoPath, currentPath)
		if err != nil {
			return err
		}

		files = append(files, models.ScannedFile{
			AbsPath:   currentPath,
			RelPath:   filepath.ToSlash(relPath),
			FileName:  name,
			Extension: strings.ToLower(filepath.Ext(name)),
			Language:  LanguageForFile(name),
			SizeBytes: fileInfo.Size(),
		})

		return nil
	})
	if err != nil {
		return nil, err
	}

	return files, nil
}