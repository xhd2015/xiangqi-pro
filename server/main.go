package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/xhd2015/xiangqi-pro/server/api"
	"github.com/xhd2015/xiangqi-pro/server/api/step"
)

const help = `
xiangqi server

Usage: Prog x [OPTIONS]
Options:
  --help   show help message
`

// example:
//
//	go run ./server/ --pika-root $X/Pikafish/src --chess-book-root my-chessbook
func main() {
	err := handle(os.Args[1:])
	if err != nil {
		fmt.Fprintf(os.Stderr, "%v\n", err)
		os.Exit(1)
	}
}

func handle(args []string) error {
	var chessBookDir string
	var pikaDir string
	n := len(args)

	var remainArgs []string
	for i := 0; i < n; i++ {
		if args[i] == "--pika-root" {
			if i+1 >= n {
				return fmt.Errorf("%v requires arg", args[i])
			}
			pikaDir = args[i+1]
			i++
			continue
		}
		if args[i] == "--chess-book-root" {
			if i+1 >= n {
				return fmt.Errorf("%v requires arg", args[i])
			}
			chessBookDir = args[i+1]
			i++
			continue
		}
		if args[i] == "--help" {
			fmt.Println(strings.TrimSpace(help))
			return nil
		}
		if args[i] == "--" {
			remainArgs = append(remainArgs, args[i+1:]...)
			break
		}
		if strings.HasPrefix(args[i], "-") {
			return fmt.Errorf("unrecognized flag: %v", args[i])
		}
		remainArgs = append(remainArgs, args[i])
	}

	staticDir := "./dist"
	var serveFiles http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {
		log.Printf("request: Method=%s, Host=%s, RemoteAddr=%s, RequestURI=%s, Header=%v", r.Method, r.Host, r.RemoteAddr, r.RequestURI, r.Header)

		file := filepath.Join(staticDir, strings.ReplaceAll(r.RequestURI, "/", string(filepath.Separator)))
		fsInfo, statErr := os.Stat(file)
		if statErr != nil {
			if errors.Is(statErr, os.ErrNotExist) {
				file = filepath.Join(staticDir, "index.html")
				fsInfo, statErr = os.Stat(file)
			}
		} else if fsInfo.IsDir() {
			file = filepath.Join(file, "index.html")
			fsInfo, statErr = os.Stat(file)
		}

		if statErr != nil {
			http.Error(w, statErr.Error(), http.StatusInternalServerError)
			return
		}

		// is file
		osFile, err := os.Open(file)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer osFile.Close()
		http.ServeContent(w, r, file, fsInfo.ModTime(), osFile)
	}
	http.Handle("/", serveFiles)
	http.Handle("/api/eval", api.Eval(pikaDir))
	http.Handle("/api/step/save", step.Save(chessBookDir))
	http.Handle("/api/step/list", step.List(chessBookDir))
	http.Handle("/api/step/get", step.Get(chessBookDir))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Listening on :%s...", port)
	return http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
