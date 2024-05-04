package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"
)

type Room struct {
	ID         string
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
/*


func (server *WsServer) sendTyping(p []byte) {
	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}

	receiverID, ok := data["receiverID"].(string)
	if !ok {
		err := "ID du destinataire manquant ou invalide"
		tools.Log(err)
		return
	}
	// Recherchez le client destinataire dans la carte Clients
	inputKeys, err := json.Marshal(data)
	if err != nil {
		tools.Log(err)
		return
	}
	found := false
	for client := range server.clients {
		if client.ID == receiverID {

			client.send <- inputKeys
			found = true
		}
	}
	if !found {
		server.listClients()
		err := "Client destinataire non trouvé " + receiverID
		tools.Log(err)
	}
}

func (server *WsServer) sendPrivateMessage(p []byte) {
	// Désérialisez les données JSON du message
	var message model.Message
	err := json.Unmarshal(p, &message)
	if err != nil {
		tools.Log(err)
		return
	}
	fmt.Printf("log message")
	// Sauvegarde des messages avec le client WebSocket dans la base de données
	idMessage := tools.NeewId()
	message.MessageID = idMessage
	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}
	senderID := message.SenderID
	receiverID := message.ReceiverID
	// Verifie si le message vient d'un groupe
	group := false
	groupIDs, _ := repo.GetGroups(bd.GetDB())
	for _, groupID := range groupIDs {
		if groupID.GroupId == receiverID {
			group = true
		}
	}
	go func() {
		submit, ok := data["submit"].(string)
		if !ok {
			err := "Action incorrect"
			tools.Log(err)
			return
		}
		if !group {
			app.AddContentMessage(receiverID, message.Content, submit, message.Cookie, idMessage)
		} else {
			userIDS, _ := repo.GetGroupMembers(bd.GetDB(), receiverID)
			for _, userID := range userIDS {
				app.AddContentMessage(userID, message.Content, submit, message.Cookie, idMessage)
			}
		}
	}()

	messageData, err := json.Marshal(message)
	if err != nil {
		tools.Log(err)
		return
	}

	found := false
	if !group {
		for client := range server.clients {
			if (client.ID == receiverID) || (client.ID == senderID) {
				client.send <- messageData
				found = true
			}
		}
	}else{
		userIDS, _ := repo.GetGroupMembers(bd.GetDB(), receiverID)
    for _, userID := range userIDS {
      for client := range server.clients {
        if client.ID == userID {
          client.send <- messageData
          found = true
        }
      }
    }
	}
	if !found {
		server.listClients()
		err := "Client destinataire non trouvé " + receiverID
		tools.Log(err)
	}
}

*/
