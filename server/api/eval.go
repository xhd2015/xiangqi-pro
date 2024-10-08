package api

import (
	"io"
	"net/http"
	"strconv"

	"github.com/xhd2015/xiangqi-pro/server/handler"
)

func Eval(pikaDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fen := r.URL.Query().Get("fen")
		if fen == "" {
			http.Error(w, "requires fen", http.StatusBadRequest)
			return
		}
		player := r.URL.Query().Get("player")
		res, err := handler.Eval(pikaDir, fen, player)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		v := strconv.Itoa(res)
		io.WriteString(w, v)
	}
}
