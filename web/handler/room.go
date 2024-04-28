package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/gofrs/uuid"
)

type Room struct {
	ID         uuid.UUID
	Name       string
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
}

type Message struct {
	MessageID  string    `json:"idMessage"`  // Primary Key
	SenderID   string    `json:"senderID"`   // Foreign Key, references User Sender entity
	ReceiverID string    `json:"receiverID"` // Foreign Key, references User Receiver entity
	Content    string    `json:"message"`    // Content
	Type       string    `json:"type"`
	SenderName string    `json:"sender"`
	Cookie     string    `json:"cookie"`
	CreatedAt  time.Time // Timestamp
	Vu         sql.NullBool
	Target     *Room `json:"target"`
}

// NewRoom creates a new Room
func NewRoom(name string) *Room {
	return &Room{
		Name:       name,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *Message),
	}
}

func (message *Message) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

// RunRoom runs our room, accepting various requests
func (room *Room) RunRoom() {
	for {
		select {

		case client := <-room.register:
			room.registerClientInRoom(client)

		case client := <-room.unregister:
			room.unregisterClientInRoom(client)

		case message := <-room.broadcast:
			room.broadcastToClientsInRoom(message.encode())
		}
	}
}

func (room *Room) registerClientInRoom(client *Client) {
	// room.notifyClientJoined(client)
	room.clients[client] = true
}

func (room *Room) unregisterClientInRoom(client *Client) {
	delete(room.clients, client)
}

func (room *Room) broadcastToClientsInRoom(message []byte) {
	for client := range room.clients {
		client.send <- message
	}
}

// func (room *Room) notifyClientJoined(client *Client) {
// 	message := &Message{
// 		Action:  SendMessageAction,
// 		Target:  room,
// 		Message: fmt.Sprintf(welcomeMessage, client.GetName()),
// 	}

// 	room.publishRoomMessage(message.encode())
// }
