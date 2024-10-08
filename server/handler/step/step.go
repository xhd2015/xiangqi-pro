package step

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/xhd2015/less-gen/fs"
)

func Save(dataDir string, name string, data string) error {
	if name == "" {
		return fmt.Errorf("requires name")
	}

	file := filepath.Join(dataDir, name+".json")
	return fs.MkdirWriteFile(file, data)
}

func List(dataDir string) ([]string, error) {
	entries, err := os.ReadDir(dataDir)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, nil
		}
		return nil, err
	}
	names := make([]string, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		names = append(names, strings.TrimSuffix(entry.Name(), ".json"))
	}
	return names, nil
}

func Get(dataDir string, name string) (string, error) {
	if name == "" {
		return "", fmt.Errorf("requires name")
	}

	file := filepath.Join(dataDir, name+".json")
	content, err := os.ReadFile(file)
	if err != nil {
		return "", err
	}
	return string(content), nil
}
