package handler

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/xhd2015/xgo/support/cmd"
)

func Eval(pikaDir string, fen string, player string) (int, error) {
	if fen == "" {
		return 0, fmt.Errorf("requires fen")
	}
	output, err := cmd.Dir(pikaDir).Output("./pikafish", []string{"eval", fen}...)
	if err != nil {
		return 0, err
	}
	score, err := ParseEvalOutput(output)
	if err != nil {
		return 0, err
	}
	if player == "black" {
		score = -score
	}
	return score, nil
}

func ParseEvalOutput(output string) (int, error) {
	output = filterInfo(output)
	return strconv.Atoi(output)
}

func filterInfo(s string) string {
	lines := strings.Split(s, "\n")
	i := 0
	for j := 0; j < len(lines); j++ {
		if strings.HasPrefix(lines[j], "info ") {
			continue
		}
		lines[i] = lines[j]
		i++
	}
	return strings.Join(lines[:i], "\n")
}
