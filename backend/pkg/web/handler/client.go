package handler

import (
	"encoding/json"
	"fmt"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	"forum/pkg/tools"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Max wait time when writing message to peer
	writeWait = 10 * time.Second

	// Max time till next pong from peer
	pongWait = 60 * time.Second

	// Send ping interval, must be less then pong wait time
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 10000
)

var (
	newline = []byte{'\n'}
	// space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	WriteBufferSize: 4096,
	ReadBufferSize:  4096,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Client represents the websocket client at the server
type Client struct {
	// The actual websocket connection.
	ID       string
	conn     *websocket.Conn
	wsServer *WsServer
	send     chan []byte
	rooms    map[*Room]bool
}

func newClient(conn *websocket.Conn, wsServer *WsServer, userID string) *Client {
	return &Client{
		ID:       userID,
		conn:     conn,
		wsServer: wsServer,
		send:     make(chan []byte, 256),
		rooms:    make(map[*Room]bool),
	}

}

func (client *Client) readPump() {
	defer func() {
		client.disconnect()
	}()

	client.conn.SetReadLimit(maxMessageSize)
	client.conn.SetReadDeadline(time.Now().Add(pongWait))
	client.conn.SetPongHandler(func(string) error { client.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	// Start endless read loop, waiting for messages from client
	for {
		_, jsonMessage, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
				tools.Log(err)
			}
			break
		}

		client.wsServer.broadcast <- jsonMessage
	}

}

func (client *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()
	for {
		select {
		case message, ok := <-client.send:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The WsServer closed the channel.
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Attach queued chat messages to the current websocket message.
			n := len(client.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-client.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (client *Client) disconnect() {
	client.wsServer.unregister <- client
	// Vérifier si le canal n'est pas déjà fermé
	if _, ok := <-client.send; ok {
		for room := range client.rooms {
			room.unregister <- client
		}
		close(client.send)
	}
	client.conn.Close()
}

// ServeWs handles websocket requests from clients requests.
func ServeWs(wsServer *WsServer, w http.ResponseWriter, r *http.Request) {
	cookie, err := app.GetCookie(w, r)
	if err != nil {
		tools.Log(err)
	}
	tools.Debogage(cookie)
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		tools.Debogage(r)
		tools.Log(err)
		return
	}
	// Lire le message du client pour recuperer le cookie
	var checkData CheckConnexion
	_, p, err := conn.ReadMessage()
	if err != nil {
		err = json.Unmarshal(p, &checkData)
		fmt.Println("\033[31mAucun cookie\033[0m")
		tools.Log(err)
		// return
	}

	err = json.Unmarshal(p, &checkData)
	if err != nil {
		fmt.Println("\033[31mErreur lors de la désérialisation du message 'check':\033][0m")
		tools.Log(err)
		return
	}

	userID, err := repo.GetUserIDBySession(bd.GetDB(), checkData.Cookie)
	if err != nil {
		tools.Log(err)
		return
	}
	client := newClient(conn, wsServer, userID)

	go client.writePump()
	go client.readPump()

	wsServer.register <- client
}
