package cmd

import (
	"forum/pkg/tools"
	"log"
	"net/http"
	"forum/pkg/web/handler"
)

const (
	// ADDR = "localhost"
	PORT = ":8080"
)

func Start() {
	tools.Init()
	mux := http.NewServeMux()
	wsServer := handler.NewWebsocketServer()
	go wsServer.Run()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler.Handler(w, r, wsServer)
	})
	log.Printf("the server has successfully started up on port %s", PORT)
	err := http.ListenAndServe(PORT, mux)
	if err != nil {
		tools.LogErr(err)
		tools.Log(err)
		log.Fatal("ERROR: sever not start at port", PORT, " Error on => ./internal/api/serveur/serveur.go")
	}
}
