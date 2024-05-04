package handler

import (
	"encoding/json"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/tools"
)

func (server *WsServer) broadcastGroup(p []byte) {
	// Désérialisez les données JSON du message
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

	usersIDs, err := repo.GetGroupMembers(bd.GetDB(), receiverID)
	if err != nil {
		tools.Log(err)
		return
	}

	notif, err := json.Marshal(data)
	if err != nil {
		tools.Log(err)
		return
	}

	for _, id := range usersIDs {
		for client := range server.clients {
			if (client.ID == id) && (client.ID != senderID) {
				client.send <- notif
			}
		}
	}

}

// Private Posts Notification
func (server *WsServer) sendPrivateNotification(p []byte) {
	var data map[string]interface{}
	if err := json.Unmarshal(p, &data); err != nil {
		tools.Log(err)
		return
	}

	receivers, ok := data["receivers"].([]string)
	if !ok {
		err := "ID des destinataires manquant ou invalides"
		tools.Log(err)
		return
	}
	notification, err := json.Marshal(data)
	if err != nil {
		tools.Log(err)
		return
	}
	for _, id := range receivers {
		for client := range server.clients {
			if client.ID == id {
				client.send <- notification
			}
		}
	}
}
