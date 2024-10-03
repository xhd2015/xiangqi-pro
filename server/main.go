package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	err := handle()
	if err != nil {
		fmt.Fprintf(os.Stderr, "%v\n", err)
		os.Exit(1)
	}
}

func handle() error {
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Listening on :%s...", port)
	return http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
