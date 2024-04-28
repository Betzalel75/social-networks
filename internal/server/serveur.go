package serveur

import (
	"log"
	"net/http"

	"forum/internal/tools"
	"forum/web/handler"
)

const (
	ADDR = "localhost"
	PORT = ":8080"
)

func Start() {
	tools.Init()
	mux := http.NewServeMux()
	wsServer := handler.NewWebsocketServer()
	go wsServer.Run()
	static := http.FileServer(http.Dir("./web/static"))
	mux.Handle("/web/static/", http.StripPrefix("/web/static/", static))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler.Handler(w,r, wsServer)
	})
	log.Printf("the server has successfully started up on port %s and is accessible on (http://%s%s/)", PORT, ADDR, PORT)
	err := http.ListenAndServe(ADDR+PORT, mux)
	if err != nil {
		tools.LogErr(err)
		tools.Log(err)
		log.Fatal("ERROR: sever not start at port", PORT, " Error on => ./internal/api/serveur/serveur.go")
	}
}
