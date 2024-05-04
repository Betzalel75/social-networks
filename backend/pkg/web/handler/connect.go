package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"

	"github.com/gorilla/websocket"
)

type CheckConnexion struct {
	Type      string `json:"type"`
	Connected bool   `json:"connected"`
	Cookie    string `json:"cookie"`
}

type List struct {
	Id     string
	Name   string
	Status string
}

type BroadcastInfo struct {
	AllInfos []model.Connection
	Type     string `json:"type"` // utilisez "type" ici
}

type Users struct {
	ID      string
	Conn    *websocket.Conn
	Channel chan string // Ajoutez un channel pour chaque Users
}

var (
	user_Client  = make(map[string]*Users)
	Array        []List
	userMutex    sync.Mutex
	arrayMutex   sync.Mutex
	upgraderConn = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	connections = make(map[string]*websocket.Conn)
)

// Fonction pour ajouter un utilisateur à la liste si celui-ci n'est pas déjà présent
func addList(userId string) {
	// Vérifier si l'utilisateur est déjà présent dans le tableau
	for _, existingUser := range Array {
		if existingUser.Id == userId {
			// L'utilisateur est déjà dans le tableau, ne rien faire
			err := "user already exists"
			tools.Log(err)
			return
		}
	}

	// Si l'utilisateur n'est pas présent, l'ajouter à la liste
	// Récupérer les informations de l'utilisateur depuis la base de données
	userInfo, err := repo.GetUserByID(bd.GetDB(), userId)
	if err != nil {
		tools.Log(err)
		return
	}

	// Ajouter l'utilisateur à la liste
	Array = append(Array, List{
		Id:     userInfo.UserID,
		Name:   userInfo.FirstName,
		Status: "",
	})
}

// Remplir les informations de chaque utilisateur à partir de List et les ajouter à Clients

func addUser(user *Users) {
	userMutex.Lock()
	defer userMutex.Unlock()
	user_Client[user.ID] = user
}

func UpdateUsersList() {

	// Liste des utilisateurs WebSocket connectés
	clientsConnected := make(map[string]bool)
	for userID := range user_Client {
		clientsConnected[userID] = true
	}

	// Récupérer la liste complète des utilisateurs depuis la base de données
	users, err := repo.GetUsers(bd.GetDB())
	if err != nil {
		tools.Log(err)
	}

	var allUsers []model.Connection

	for _, user := range users {
		connect := model.Connection{
			UserID: user.UserID,
			Name:   user.FirstName,
			Photo:  user.Photo,
			Status: "offline",
		}

		allUsers = append(allUsers, connect)
	}

	// Mettre à jour le statut des utilisateurs en ligne
	for j, existingUser := range Array {
		for i := range allUsers {
			if allUsers[i].UserID == existingUser.Id {
				allUsers[i].Status = ""
				// fmt.Println("\033[1;31m", allUsers[i].Name, "\033[0m")
			}
		}
		fmt.Println("\033[1;32m", Array[j].Name, Array[j].Id, "\033[0m")
	}
	data := BroadcastInfo{
		AllInfos: allUsers,
		Type:     "check",
	}
	// Envoyer la liste mise à jour à tous les utilisateurs WebSocket
	for _, client := range user_Client {
		conn := client.Conn
		conn.WriteJSON(data)
	}
}

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	// Mise à niveau de la connexion HTTP en WebSocket
	conn, err := upgraderConn.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Erreur lors de la mise à niveau de la connexion WebSocket:")
		tools.Log(err)
		return
	}
	defer conn.Close()

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
	// Reccupérer un identifiant unique pour l'utilisateur a partir du cookie
	userID, err := repo.GetUserIDBySession(bd.GetDB(), checkData.Cookie)
	if err != nil {
		fmt.Println("\033[31mErreur lors de la récupération de l'ID utilisateur:\033[0m")
		tools.Log(err)
		return
	}

	addList(userID)
	Id = userID

	user := &Users{
		ID:      userID,
		Conn:    conn,
		Channel: make(chan string),
	}
	addUser(user)
	// tools.Debogage("connected: "+fmt.Sprintf("%d",len(Array)))
	// Envoyer la liste des utilisateurs connectés à tous les user
	UpdateUsersList()
	for {
		// Lire le message du client
		_, _, err := conn.ReadMessage()
		if err != nil {
			tools.Log(err)
			// tools.Debogage("Disconnect client")
			// Reste du code pour nettoyer la connexion et la liste des utilisateurs
			// close(user.Channel)
			// handleUserDisconnect(userID)
			handleUserReconnect(userID, conn)
			return
		}

	}

}

func handleUserDisconnect(userID string) {
	// Ajoutez ici la logique pour traiter la déconnexion de l'utilisateur
	// Supprimez l'utilisateur de votre liste des utilisateurs en ligne
	userMutex.Lock()
	defer userMutex.Unlock()
	delete(user_Client, userID)
	// delete(Clients, userID)
	removeUserFromArray(userID)
	UpdateUsersList()
	// tools.Debogage("Utilisateur" + userID + " déconnecté.")
}

func removeUserFromArray(userId string) {
	// Recherche de l'indice de l'utilisateur dans le tableau
	arrayMutex.Lock()
	defer arrayMutex.Unlock()

	index := -1
	for i, user := range Array {
		if user.Id == userId {
			index = i
			break
		}
	}

	// Si l'utilisateur est présent, le supprimer du tableau
	if index != -1 {
		Array = append(Array[:index], Array[index+1:]...)
	}
}

// Gestion de la reconnexion du client
func handleUserReconnect(userID string, conn *websocket.Conn) {
	// Récupération de la connexion WebSocket associée à l'identifiant utilisateur
	existingConn, exists := connections[userID]
	if exists {
		// Fermeture de la connexion WebSocket existante
		existingConn.Close()
	}

	// Mise à jour de la connexion WebSocket associée à l'identifiant utilisateur
	connections[userID] = conn

	// Attente de messages du client
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			// Gestion de la déconnexion du client
			tools.Log(err)
			handleUserDisconnect(userID)
			return
		}
	}
}
