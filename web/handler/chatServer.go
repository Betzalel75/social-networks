package handler

import (
	"encoding/json"
	"forum/internal/app"
	model "forum/internal/models"
	"forum/internal/tools"
	"log"
	"path/filepath"
)

type WsServer struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte
	rooms      map[*Room]bool
}

// NewWebsocketServer creates a new WsServer type
func NewWebsocketServer() *WsServer {
	return &WsServer{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
		rooms:      make(map[*Room]bool),
	}
}

// Run our websocket server, accepting various requests
func (server *WsServer) Run() {
	for {
		select {

		case client := <-server.register:
			server.registerClient(client)

		case client := <-server.unregister:
			server.unregisterClient(client)

		case comment := <-server.broadcast:
			var data map[string]interface{}
			if err := json.Unmarshal(comment, &data); err != nil {
				tools.Log(err)
				return
			}
			value := data["type"].(string)
			server.handleEndPoint(value, comment)
		}

	}
}

// Définir un type pour le gestionnaire de route
type WebSocketHandler func(*WsServer, []byte)

var webSocketEndPoint = map[string]WebSocketHandler{
	"typing":   func(server *WsServer, comment []byte) { server.sendTyping(comment) },
	"message":  func(server *WsServer, comment []byte) { server.sendPrivateMessage(comment) },
	"comment":  func(server *WsServer, comment []byte) { server.broadcastToClients(comment) },
	"NewPost":  func(server *WsServer, comment []byte) { server.broadcastPostToClients(comment) },
	"addGroup": func(server *WsServer, comment []byte) { server.addGroup(comment) },
}

func (server *WsServer) handleEndPoint(value string, comment []byte) {
	handlerWebSocket, ok := webSocketEndPoint[value]
	if !ok {
		tools.Log("unknown")
		return
	}
	handlerWebSocket(server, comment)
}

// func chat room
func (server *WsServer) handleChat(jsonMessage []byte) {
	var message Message
	if err := json.Unmarshal(jsonMessage, &message); err != nil {
		log.Printf("Error on unmarshal JSON message %s", err)
	}
	senderID := message.SenderID
	for client := range server.clients {
		if client.ID == senderID {
			client.chatRoom(message)
		}
	}
}
func (client *Client) chatRoom(message Message) {

	roomID := message.Target.GetId()
	if room := client.wsServer.findRoomByID(roomID); room != nil {
		room.broadcast <- &message
	}
}

func (server *WsServer) registerClient(client *Client) {
	server.clients[client] = true
}

func (server *WsServer) unregisterClient(client *Client) {
	delete(server.clients, client)
}

func (server *WsServer) broadcastToClients(comment []byte) {
	// Désérialisez les données JSON du commentaire
	var commentMessage model.CommentMessage
	err := json.Unmarshal(comment, &commentMessage)
	if err != nil {
		tools.Log(err)
		return
	}

	// Utilisez les valeurs désérialisées
	postID := commentMessage.PostID
	commentContent := commentMessage.Comment
	submit := commentMessage.Submit
	senderId := commentMessage.SenderID
	photo := commentMessage.Image
	
	commentId := tools.NeewId()
	go func() {
		image := ""
		// Sauvegarde des commentaires avec le client WebSocket dans la base de données
		if photo.Name != "" {
			img, err := tools.UploadFile("comment-"+postID, photo)
			if err != nil {
				tools.Log(err)
				return
			}
			// Utilisez le nom de fichier retourné s'il y a eu un téléchargement réussi
			image = img
		}
		app.AddComment(postID, commentContent, submit, senderId, commentId, image)
	}()

	commentMessage.DislikeNbr = 0
	commentMessage.LikeNbr = 0
	commentMessage.Type = "comment"
	commentMessage.CommentID = commentId
	commentMessage.Src = "comment-" + postID + filepath.Ext(photo.Name)
	// Convertissez la structure CommentMessage en JSON
	messageData, err := json.Marshal(commentMessage)
	if err != nil {
		tools.Log(err)
		return
	}
	for client := range server.clients {
		client.send <- messageData
	}
}

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
	// Sauvegarde des messages avec le client WebSocket dans la base de données
	idMessage := tools.NeewId()
	message.MessageID = idMessage
	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}
	senderID, ok := data["senderID"].(string)
	if !ok {
		err := "ID de l'emetteur manquant ou invalide"
		tools.Log(err)
		return
	}
	receiverID, ok := data["receiverID"].(string)
	if !ok {
		err := "ID du destinataire manquant ou invalide"
		tools.Log(err)
		return
	}
	go func() {
		submit, ok := data["submit"].(string)
		if !ok {
			err := "Action incorrect"
			tools.Log(err)
			return
		}
		app.AddContentMessage(receiverID, message.Content, submit, message.Cookie, idMessage)
	}()

	messageData, err := json.Marshal(message)
	if err != nil {
		tools.Log(err)
		return
	}

	found := false
	for client := range server.clients {
		if (client.ID == receiverID) || (client.ID == senderID) {

			client.send <- messageData
			found = true
		}
	}
	if !found {
		server.listClients()
		err := "Client destinataire non trouvé " + receiverID
		tools.Log(err)
	}
}

func (server *WsServer) listClients() {
	for client := range server.clients {
		log.Printf("Client ID: %s\n", client.ID)
	}
}

func (server *WsServer) broadcastPostToClients(p []byte) {
	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}
	senderID, ok := data["senderID"].(string)
	if !ok {
		err := "ID de l'emetteur manquant ou invalide"
		tools.Log(err)
		return
	}
	notification, err := json.Marshal(data)
	if err != nil {
		tools.Log(err)
		return
	}

	for client := range server.clients {
		// server.listClients()
		if client.ID != senderID {
			client.send <- notification
		}
	}
}

func (server *WsServer) addGroup(p []byte) {
	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}

	ownerID, ok := data["GroupOwner"].(string)
	if !ok {
		err := "ownerID du group manquant ou invalide"
		tools.Log(err)
		return
	}
	title, ok := data["GroupTitle"].(string)
	if !ok {
		err := "Title du group manquant ou invalide"
		tools.Log(err)
		return
	}
	desc, ok := data["GroupDesc"].(string)
	if !ok {
		err := "Description du group manquant ou invalide"
		tools.Log(err)
		return
	}

	// group := model.Group{GroupTitle: title, GroupDesc: desc, GroupOwner: ownerID}

	group, err := app.AddGroup(title, desc, ownerID)
	if err != nil {
		tools.Log(err)
		return
	}

	groupData, err := json.Marshal(group)
	if err != nil {
		tools.Log(err)
		return
	}
	for client := range server.clients {
		client.send <- groupData
	}
}
