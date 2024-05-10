package handler

import (
	"encoding/json"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"log"
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
	"typing":          func(server *WsServer, comment []byte) { server.sendTyping(comment) },
	"message":         func(server *WsServer, comment []byte) { server.sendPrivateMessage(comment) },
	"NewPost":         func(server *WsServer, comment []byte) { server.broadcastPostToClients(comment) },
	"addGroup":        func(server *WsServer, comment []byte) { server.addGroup(comment) },
	"messageRoom":     func(server *WsServer, comment []byte) { server.handleChat(comment) },
	"joinGroup":       func(server *WsServer, comment []byte) { server.sendJoinGroupNotification(comment) },
	"acceptJoinGroup": func(server *WsServer, comment []byte) { server.acceptJoinGroupNotification(comment) },
	"Broadcast":       func(server *WsServer, comment []byte) { server.broadcastGroup(comment) },
	"Private":         func(server *WsServer, comment []byte) { server.sendPrivateNotification(comment) },
}

func (server *WsServer) handleEndPoint(value string, comment []byte) {
	handlerWebSocket, ok := webSocketEndPoint[value]
	if !ok {
		tools.Log("unknown")
		return
	}
	handlerWebSocket(server, comment)
}

func (server *WsServer) registerClient(client *Client) {
	server.clients[client] = true
}

func (server *WsServer) unregisterClient(client *Client) {
	delete(server.clients, client)
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

/*----------------------------------------------------/
======================================================
/----------------------------------------------------*/

func (server *WsServer) sendJoinGroupNotification(p []byte) {

	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}

	notifType, ok := data["notifType"].(string)
	if !ok {
		err := "notifType manquant ou invalide"
		tools.Log(err)
		return
	}
	category, ok := data["category"].(string)
	if !ok {
		err := "category manquant ou invalide"
		tools.Log(err)
		return
	}
	idGroupe, ok := data["idGroupe"].(string)
	if !ok {
		err := "idGroupe manquant ou invalide"
		tools.Log(err)
		return
	}
	idUser, ok := data["idUser"].(string)
	if !ok {
		err := "idUser manquant ou invalide"
		tools.Log(err)
		return
	}
	db := bd.GetDB()
	group, err := repo.GetGroupByGroupID(db, idGroupe)
	if err != nil {
		tools.Log(err)
		return
	}
	app.AddNotification(idUser, group.GroupOwner, notifType, category, idGroupe)
	notif, err := json.Marshal(data)
	if err != nil {
		tools.Log(err)
		return
	}
	for client := range server.clients {
		if client.ID == group.GroupOwner {
			client.send <- notif
		}
	}
}

func (server *WsServer) acceptJoinGroupNotification(p []byte) {

	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}

	sourceID, ok := data["sourceID"].(string)
	if !ok {
		err := "sourceID manquant ou invalide"
		tools.Log(err)
		return
	}
	userID, ok := data["userID"].(string)
	if !ok {
		err := "userID manquant ou invalide"
		tools.Log(err)
		return
	}
	db := bd.GetDB()
	_, err := repo.GetGroupByGroupID(db, sourceID)
	if err != nil {
		tools.Log("Group not found")
		tools.Log(err)
		return
	}
	err = repo.AddMemberToGroup(db, sourceID, userID)
	if err != nil {
		tools.Log(err)
		return
	}
	for client := range server.clients {
		if client.ID == userID {
			client.joinRoom(sourceID)
		}
	}
}
