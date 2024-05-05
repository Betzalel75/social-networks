package cmd

import (
	"forum/pkg/tools"
	"forum/pkg/web/handler"
	"log"
	"net/http"
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
	static := http.FileServer(http.Dir("./images/"))
	mux.Handle("/images/", http.StripPrefix("/images/", static))
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
