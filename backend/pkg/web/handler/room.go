package handler

import (
	"database/sql"
	"encoding/json"
	"forum/pkg/internal/app"
	"forum/pkg/tools"
	"time"
)

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
	// Target     *Room `json:"target"`
}

type Room struct {
	name       string
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
}

// NewRoom creates a new Room
func NewRoom(name string) *Room {
	return &Room{
		name:       name,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *Message),
	}
}

func (room *Room) GetName() string {
	return room.name
}

func (server *WsServer) findRoomByName(name string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetName() == name {
			foundRoom = room
			break
		}
	}

	return foundRoom
}

func (server *WsServer) createRoom(name string) *Room {
	room := NewRoom(name)
	go room.RunRoom()
	server.rooms[room] = true

	return room
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

func (message *Message) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		tools.Log(err)
	}

	return json
}

func (client *Client) isInRoom(room *Room) bool {
	if _, ok := client.rooms[room]; ok {
		return true
	}

	return false
}

func (client *Client) joinRoom(roomName string) *Room {
	room := client.wsServer.findRoomByName(roomName)
	if room == nil {
		room = client.wsServer.createRoom(roomName)
	}

	if !client.isInRoom(room) {
		client.rooms[room] = true
		room.register <- client
	}

	return room
}

func (server *WsServer) handleChat(jsonMessage []byte) {
	var message Message
	if err := json.Unmarshal(jsonMessage, &message); err != nil {
		tools.Log(err)
		return
	}
	idMessage := tools.NeewId()
	message.MessageID = idMessage
	go func() {
		app.AddContentMessage(message.ReceiverID, message.Content, "Send message", message.Cookie, idMessage)
	}()
	for client := range server.clients {
		if client.ID == message.SenderID {
			client.chatRoom(message)
		}
	}
}

func (client *Client) chatRoom(message Message) {
	roomID := message.ReceiverID
	if room := client.wsServer.findRoomByName(roomID); room != nil {
		room.broadcast <- &message
	}
}
